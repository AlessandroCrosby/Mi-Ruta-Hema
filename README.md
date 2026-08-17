# MI RUTA HEMA — Pasaporte de continuidad

Esta versión final tiene un especial enfoque en la experiencia hacia el cuidador/familiar, adicionalmente en el reposotorio se enuentran las experiencias hacia los profesionales y el niño:

# Solución Principipal

- **Paciente/familia:** `ruta-hema-referencia/mi-ruta-hema/`

# Complementarias 

- **Profesional:** `ruta-hema-referencia/profesional/`
- **Niño:** `leos-adventure-2/dist/`

## Cómo iniciar

En Windows, desde la carpeta raíz del proyecto:

```powershell
.\ruta-hema-referencia\iniciar-demo.ps1
```

Si PowerShell bloquea scripts:

```powershell
powershell -ExecutionPolicy Bypass -File .\ruta-hema-referencia\iniciar-demo.ps1
```

Luego abra primero la interfaz **Profesional**. El profesional inicializa/migra la base local de demostración y las otras dos interfaces comparten el mismo `localStorage`.

## Datos reales vs. datos de demostración

### Reales / públicos

- Nombre y accesión de estudios TARGET.
- Conteos actuales de participantes mostrados por C3DC.
- Alcance del modelo C3DC: participante, diagnóstico, tratamiento, respuesta al tratamiento, supervivencia y análisis genético.
- Enlaces a las fuentes oficiales/recomendadas.

### Sintéticos

- Códigos H-001…H-012.
- Edad/procedencia de cada H-*.
- Citas del INSN.
- Inasistencias.
- Barreras familiares.
- Profesionales responsables.
- Servicio Social.
- Score de continuidad.

Esta separación es intencional: el desafío no requiere historias clínicas reales y exige confidencialidad.

## Si quieren editar el proyecto

```powershell
cd leos-adventure-2
npm install
npm run build
```
