#!/bin/bash

# ==============================================================
#  update-expo-version.sh
#  Actualiza Expo a la versión ^55.0.0, corrige dependencias
#  y ejecuta el diagnóstico del proyecto.
#
#  Uso:
#    chmod +x scripts/update-expo-version.sh
#    ./scripts/update-expo-version.sh <ruta-relativa-proyecto>
#
#  Ejemplo:
#    ./scripts/update-expo-version.sh Tema_10/Apoyo/unir-cinema-07-development-build
# ==============================================================

set -e  # Detiene el script ante cualquier error

# ── Colores ──────────────────────────────────────────────────
BOLD="\033[1m"
CYAN="\033[1;36m"
GREEN="\033[1;32m"
RED="\033[1;31m"
YELLOW="\033[1;33m"
RESET="\033[0m"

# ── Función de separador ──────────────────────────────────────
separator() {
  echo -e "${CYAN}──────────────────────────────────────────────────────${RESET}"
}

# ── Función de ejecución con cabecera ─────────────────────────
run_step() {
  local step_number="$1"
  local description="$2"
  shift 2
  local command=("$@")

  separator
  echo -e "${BOLD}Paso ${step_number}/3 — ${description}${RESET}"
  echo -e "${YELLOW}Ejecutando:${RESET} ${command[*]}"
  separator

  if "${command[@]}"; then
    echo ""
    echo -e "${GREEN}✔ Paso ${step_number} completado correctamente.${RESET}"
    echo ""
  else
    echo ""
    echo -e "${RED}✘ Error en el paso ${step_number}: '${command[*]}'${RESET}"
    echo -e "${RED}  El script se ha detenido.${RESET}"
    exit 1
  fi
}

# ── Validar argumento ─────────────────────────────────────────
if [ -z "$1" ]; then
  echo -e "${RED}Error: debes indicar la ruta relativa del proyecto Expo.${RESET}"
  echo -e "  Uso: $0 <ruta-relativa-proyecto>"
  exit 1
fi

PROJECT_DIR="$1"

if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}Error: el directorio '${PROJECT_DIR}' no existe.${RESET}"
  exit 1
fi

# ── Inicio ────────────────────────────────────────────────────
echo ""
separator
echo -e "${BOLD}  🚀  Actualización de Expo — Secuencia de comandos${RESET}"
echo -e "${BOLD}  📁  Proyecto: ${PROJECT_DIR}${RESET}"
separator
echo ""

# ── Limpieza: node_modules y package-lock.json ────────────────
separator
echo -e "${BOLD}Limpieza — Eliminando artefactos anteriores${RESET}"
separator

if [ -d "${PROJECT_DIR}/node_modules" ]; then
  echo -e "${YELLOW}Eliminando:${RESET} ${PROJECT_DIR}/node_modules"
  rm -rf "${PROJECT_DIR}/node_modules"
  echo -e "${GREEN}✔ node_modules eliminado.${RESET}"
else
  echo -e "  node_modules no encontrado, se omite."
fi

if [ -f "${PROJECT_DIR}/package-lock.json" ]; then
  echo -e "${YELLOW}Eliminando:${RESET} ${PROJECT_DIR}/package-lock.json"
  rm -f "${PROJECT_DIR}/package-lock.json"
  echo -e "${GREEN}✔ package-lock.json eliminado.${RESET}"
else
  echo -e "  package-lock.json no encontrado, se omite."
fi

echo ""

# ── Cambiar al directorio del proyecto ────────────────────────
cd "$PROJECT_DIR"

# ── Paso 1: Instalar la versión objetivo de Expo ──────────────
run_step 1 \
  "Instalar expo@^55.0.0" \
  npm install expo@^55.0.0

# ── Paso 2: Corregir versiones de dependencias compatibles ────
run_step 2 \
  "Corregir dependencias con 'expo install --fix'" \
  npx expo install --fix

# ── Paso 3: Diagnóstico del proyecto ──────────────────────────
run_step 3 \
  "Diagnóstico del proyecto con 'expo-doctor'" \
  npx expo-doctor

# ── Fin ───────────────────────────────────────────────────────
separator
echo -e "${GREEN}${BOLD}  ✅  Todos los pasos se completaron con éxito.${RESET}"
separator
echo ""



