#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Pipeline de optimización de vídeo para Hero (16:9 y 9:16)
# Lee clips crudos de assets/video/raw/ (h-01..03.mp4 y v-01..03.mp4),
# aplica xfade de 0.5s, recorta a ~20s, elimina audio y exporta MP4 + WebM.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
RAW_DIR="${PROJECT_ROOT}/assets/video/raw"
OUT_DIR="${PROJECT_ROOT}/assets/video"

FFMPEG="${FFMPEG_BIN:-$(command -v ffmpeg || true)}"
FFPROBE="${FFPROBE_BIN:-$(command -v ffprobe || true)}"

if [[ -z "${FFMPEG}" && -x "/Users/musa/.local/bin/ffmpeg" ]]; then
  FFMPEG="/Users/musa/.local/bin/ffmpeg"
fi
if [[ -z "${FFPROBE}" && -x "/Users/musa/.local/bin/ffprobe" ]]; then
  FFPROBE="/Users/musa/.local/bin/ffprobe"
fi

if [[ -z "${FFMPEG}" || ! -x "${FFMPEG}" ]]; then
  echo "[ERROR] No se encontró ffmpeg en PATH ni en /Users/musa/.local/bin/ffmpeg" >&2
  exit 1
fi

if [[ -z "${FFPROBE}" || ! -x "${FFPROBE}" ]]; then
  echo "[ERROR] No se encontró ffprobe en PATH ni en /Users/musa/.local/bin/ffprobe" >&2
  exit 1
fi

mkdir -p "${OUT_DIR}"

FADE_DUR="0.5"
MAX_DURATION="20"
TARGET_FPS="30"

get_duration() {
  local file="$1"
  "${FFPROBE}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"
}

build_group() {
  local label="$1"
  local prefix="$2"
  local width="$3"
  local height="$4"
  local h264_crf="$5"
  local vp9_crf="$6"
  local max_mb="$7"
  local out_base="$8"

  local clips=()
  local idx
  for idx in 01 02 03; do
    local candidate="${RAW_DIR}/${prefix}-${idx}.mp4"
    if [[ -f "${candidate}" ]]; then
      clips+=("${candidate}")
    fi
  done

  if [[ ${#clips[@]} -eq 0 ]]; then
    echo "[AVISO] No se encontraron clips para el grupo '${label}' (${prefix}-01..03.mp4) en ${RAW_DIR}. Se omite."
    return 0
  fi

  echo "[INFO] Procesando grupo '${label}' (${#clips[@]} clip(s) encontrado(s))..."

  local input_args=()
  local filter_parts=()
  local durations=()
  local i=0

  for clip in "${clips[@]}"; do
    input_args+=("-i" "${clip}")
    local dur
    dur="$(get_duration "${clip}")"
    durations+=("${dur}")
    filter_parts+=("[${i}:v]fps=${TARGET_FPS},scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,format=yuv420p,settb=AVTB[v${i}]")
    i=$((i + 1))
  done

  local filter_complex=""
  local part
  for part in "${filter_parts[@]}"; do
    filter_complex+="${part};"
  done

  local final_label=""
  if [[ ${#clips[@]} -eq 1 ]]; then
    filter_complex+="[v0]trim=duration=${MAX_DURATION},setpts=PTS-STARTPTS[vout]"
    final_label="vout"
  else
    local prev_label="v0"
    local cum_dur="${durations[0]}"
    local j
    for ((j = 1; j < ${#clips[@]}; j++)); do
      local offset
      offset="$(awk -v c="${cum_dur}" -v f="${FADE_DUR}" -v n="${j}" 'BEGIN { o = c - (n * f); if (o < 0) o = 0; printf "%.3f", o }')"
      local next_label="x${j}"
      filter_complex+="[${prev_label}][v${j}]xfade=transition=fade:duration=${FADE_DUR}:offset=${offset}[${next_label}];"
      prev_label="${next_label}"
      cum_dur="$(awk -v c="${cum_dur}" -v d="${durations[${j}]}" 'BEGIN { printf "%.3f", c + d }')"
    done
    filter_complex+="[${prev_label}]trim=duration=${MAX_DURATION},setpts=PTS-STARTPTS[vout]"
    final_label="vout"
  fi

  local out_mp4="${OUT_DIR}/${out_base}.mp4"
  local out_webm="${OUT_DIR}/${out_base}.webm"

  echo "[INFO] Exportando ${out_mp4} (H.264 CRF ${h264_crf}, max ${width}x${height}, objetivo <= ${max_mb} MB)..."
  "${FFMPEG}" -y -hide_banner -loglevel warning \
    "${input_args[@]}" \
    -filter_complex "${filter_complex}" \
    -map "[${final_label}]" \
    -an \
    -c:v libx264 -crf "${h264_crf}" -preset slow -pix_fmt yuv420p \
    -movflags +faststart \
    "${out_mp4}"

  local size_bytes
  size_bytes="$(wc -c < "${out_mp4}" | tr -d ' ')"
  local max_bytes=$((max_mb * 1024 * 1024))
  if [[ "${size_bytes}" -gt "${max_bytes}" ]]; then
    local adjusted_crf=$((h264_crf + 4))
    echo "[AVISO] ${out_mp4} pesa $((size_bytes / 1024 / 1024)) MB (> ${max_mb} MB). Reintentando con CRF ${adjusted_crf}..."
    "${FFMPEG}" -y -hide_banner -loglevel warning \
      "${input_args[@]}" \
      -filter_complex "${filter_complex}" \
      -map "[${final_label}]" \
      -an \
      -c:v libx264 -crf "${adjusted_crf}" -preset slow -pix_fmt yuv420p \
      -movflags +faststart \
      "${out_mp4}"
    size_bytes="$(wc -c < "${out_mp4}" | tr -d ' ')"
  fi
  echo "[OK] ${out_mp4} -> $(awk -v b="${size_bytes}" 'BEGIN { printf "%.2f MB", b / 1048576 }')"

  echo "[INFO] Exportando ${out_webm} (VP9 CRF ${vp9_crf})..."
  "${FFMPEG}" -y -hide_banner -loglevel warning \
    "${input_args[@]}" \
    -filter_complex "${filter_complex}" \
    -map "[${final_label}]" \
    -an \
    -c:v libvpx-vp9 -crf "${vp9_crf}" -b:v 0 -row-mt 1 -pix_fmt yuv420p \
    "${out_webm}"

  local webm_bytes
  webm_bytes="$(wc -c < "${out_webm}" | tr -d ' ')"
  echo "[OK] ${out_webm} -> $(awk -v b="${webm_bytes}" 'BEGIN { printf "%.2f MB", b / 1048576 }')"
}

if [[ ! -d "${RAW_DIR}" ]]; then
  echo "[AVISO] No existe la carpeta ${RAW_DIR}. Nada que procesar."
  exit 0
fi

build_group "horizontal 16:9" "h" 1920 1080 24 32 8 "hero-16x9"
build_group "vertical 9:16"   "v" 720  1280 25 33 4 "hero-9x16"

echo "[FIN] Pipeline de vídeo completado."
