#!/usr/bin/env bash
set -euo pipefail

# Uso: ./scripts/compare_snapshot.sh /caminho/para/topbus-snapshot-YYYY-MM-DD.tar.gz https://github.com/org/candidate-repo.git [...mais repos]
# Gera extracao em /tmp/topbus-snapshot, checksums e compara com cada repo candidato

ARCHIVE="$1"
shift || true
CANDIDATES=("$@")
DATE=$(date +%F-%H%M%S)
SNAP_DIR="/tmp/topbus-snapshot"
TOP_SHA="/tmp/topbus-sha1.txt"
REPORT="/tmp/compare-report-${DATE}.txt"

if [ -z "$ARCHIVE" ] || [ ! -f "$ARCHIVE" ]; then
  echo "ERRO: arquivo de snapshot não encontrado: $ARCHIVE"
  echo "Uso: $0 /caminho/para/topbus-snapshot-YYYY-MM-DD.tar.gz https://github.com/org/repo.git [...]")
  exit 2
fi

rm -rf "$SNAP_DIR"
mkdir -p "$SNAP_DIR"

echo "Extraindo snapshot em $SNAP_DIR..."
tar -xzf "$ARCHIVE" -C "$SNAP_DIR"

# Gera checksums do snapshot
echo "Gerando checksums do snapshot em $TOP_SHA..."
(cd "$SNAP_DIR" && find . -type f -print0 | sort -z | xargs -0 sha1sum) > "$TOP_SHA"

echo "Iniciando comparações com candidatos..." > "$REPORT"

IDX=1
for url in "${CANDIDATES[@]:-}"; do
  if [ -z "$url" ]; then
    continue
  fi
  CAND_DIR="/tmp/candidate-${IDX}"
  rm -rf "$CAND_DIR"
  echo "Clonando $url em $CAND_DIR..." | tee -a "$REPORT"
  git clone --depth 1 "$url" "$CAND_DIR" 2>&1 | sed 's/^/  /' >> "$REPORT" || { echo "  falha ao clonar $url" | tee -a "$REPORT"; IDX=$((IDX+1)); continue; }

  # gera checksums do candidato
  CAND_SHA="/tmp/candidate-${IDX}-sha1.txt"
  (cd "$CAND_DIR" && find . -type f -print0 | sort -z | xargs -0 sha1sum) > "$CAND_SHA"

  # compara checksums
  DIFF_OUTPUT="/tmp/diff-candidate-${IDX}.txt"
  diff -u "$TOP_SHA" "$CAND_SHA" > "$DIFF_OUTPUT" || true

  DIFF_LINES=$(wc -l < "$DIFF_OUTPUT" || echo 0)
  if [ "$DIFF_LINES" -eq 0 ]; then
    echo "Resultado: MATCH EXATO (checksums iguais) para $url" | tee -a "$REPORT"
  else
    CHANGES=$(grep -c "^+\|^-" "$DIFF_OUTPUT" || true)
    echo "Resultado: diferenças encontradas para $url — linhas de diff: $DIFF_LINES (possíveis alterações: $CHANGES)" | tee -a "$REPORT"
    echo "Ver diff: $DIFF_OUTPUT" | tee -a "$REPORT"
  fi

  # comparação estrutural mais legível
  DIFF_TREE="/tmp/tree-diff-${IDX}.txt"
  diff -ru "$SNAP_DIR" "$CAND_DIR" > "$DIFF_TREE" || true
  echo "Diff estrutural salvo em: $DIFF_TREE" | tee -a "$REPORT"

  IDX=$((IDX+1))
done

echo "Comparações finalizadas. Relatório: $REPORT"

echo "Relatório completo salvo em: $REPORT"
exit 0
