$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }
if (-not $python) {
  throw 'No se encontró Python. Instala Python 3 y vuelve a ejecutar este script.'
}

Write-Host "Iniciando RUTA HEMA v3 en http://localhost:8765" -ForegroundColor Cyan
Write-Host "Profesional (ABRIR PRIMERO): http://localhost:8765/ruta-hema-referencia/profesional/" -ForegroundColor Green
Write-Host "Niño / Leo's Adventure: http://localhost:8765/leos-adventure-2/dist/"
Write-Host "Paciente/familia: http://localhost:8765/ruta-hema-referencia/mi-ruta-hema/"
Write-Host "Mantén esta ventana abierta mientras realizas la demostración."
if ($python.Name -eq 'py.exe') {
  & $python.Source -3 -m http.server 8765 --directory $root
} else {
  & $python.Source -m http.server 8765 --directory $root
}
