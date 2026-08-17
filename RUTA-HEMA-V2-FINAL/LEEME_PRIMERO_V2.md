# RUTA HEMA v3 — Pasaporte de continuidad

Esta versión conserva las tres experiencias del prototipo original:

- **Profesional:** `ruta-hema-referencia/profesional/`
- **Paciente/familia:** `ruta-hema-referencia/mi-ruta-hema/`
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

Luego abra primero la interfaz **Profesional**. El profesional inicializa/migra la base local de demostración v2 y las otras dos interfaces comparten el mismo `localStorage`.

## Cómo colocar los videos instructivos

Las interfaces infantil y familiar contienen reproductores reales y comparten los mismos archivos. Copien los videos MP4 en:

```text
RUTA-HEMA-V2-FINAL\leos-adventure-2\media\videos\
```

Los tres nombres preparados son `antes-del-tratamiento.mp4`, `durante-la-visita.mp4` y `despues-del-tratamiento.mp4`. Los títulos, descripciones, rutas y el orden pueden modificarse sin recompilar mediante `leos-adventure-2\media\videos\catalogo-videos.json`. El cambio aparecerá tanto en **Mis videos** del niño como en **Videos: conozco mi tratamiento** de la familia.

La guía completa está en `leos-adventure-2\media\videos\LEEME-COMO-AGREGAR-VIDEOS.md`.

## Qué cambió en v3

1. Las experiencias de Niño y Familia ahora usan una **bitácora/pasaporte** con sellos, páginas de ruta y progreso.
2. La edad se muestra y clasifica en cuatro diseños: 3–6, 7–11, 12–15 y 15–17. Para evitar doble clasificación, los 15 años se asignan al grupo 12–15.
3. Se incorporó una biblioteca de tres videos guía demostrativos y un juego de memoria adaptado al grupo etario.
4. Las familias con alerta ámbar pueden completar una encuesta de barreras; las respuestas aparecen en la ficha profesional.
5. La familia puede configurar control parental para juegos, tiempo diario, recordatorios y aprobación de compras.
6. Las llegadas puntuales registradas por el profesional entregan 20 monedas. El niño puede usarlas para desbloquear Tuntung Sajur, Explorador Estelar o Guardián Hema.
7. Las tres interfaces comparten edad, monedas, avatares, videos, juegos, controles, encuestas y novedades mediante el mismo contrato local de demostración.

## Funciones conservadas de v2

1. Se eliminó la fecha fija de la demo; ahora la aplicación usa la fecha local real del equipo.
2. Se agregó un **score operativo de continuidad 0–100**, determinístico y explicable. No es ML, no es riesgo clínico y no recomienda tratamiento.
3. El panel principal muestra no solo el nivel rojo/ámbar/verde, sino **por qué** se prioriza un caso y **qué acción concreta** se sugiere.
4. Se añadió el módulo **Fuentes y evidencia**, con trazabilidad a TARGET ALL, TARGET AML y C3DC.
5. Se integraron conteos públicos reales de las cohortes de referencia:
   - TARGET ALL Expansion Phase 2 (`phs000464`): 1,704 participantes en C3DC.
   - TARGET AML (`phs000465`): 2,144 participantes en C3DC.
6. Los pacientes `H-*`, sus citas, inasistencias, barreras, profesionales y casos de Servicio Social siguen siendo **escenarios sintéticos**. Esto está marcado explícitamente para no atribuir a TARGET/C3DC datos que esas fuentes no aportan al reto operativo.
7. Las fichas de pacientes con ALL/AML muestran la cohorte pública que sirve de **referencia clínica**, sin afirmar que el caso H-* fue copiado de un participante real.
8. El CSV exportado ahora incluye `score_continuidad`, `cohorte_referencia` y `tipo_dato`.
9. Se corrigió el correo de configuración a un dominio de demostración para no simular una dirección institucional real.

## Regla del score operativo

El score suma señales de continuidad que sí aparecen en el planteamiento del reto:

- 2 o más inasistencias recientes: +35
- 1 inasistencia reciente: +20
- Sin próxima cita en una fase que la requiere: +25
- Seguimiento atrasado: +20
- Barrera social, geográfica o de comunicación activa: +20
- Traslado desde fuera de Lima/Callao cuando la barrera sigue activa: +5
- Más de 14 días sin contacto: +10
- Servicio Social requerido/en seguimiento por una barrera activa: +5

Clasificación:

- **Rojo:** 60–100
- **Ámbar:** 25–59
- **Verde:** 0–24

El score sirve para priorizar trabajo del equipo. El personal mantiene el control de la decisión final.

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

## Fuentes públicas integradas

- C3DC Studies: https://clinicalcommons.ccdi.cancer.gov/studies
- TARGET ALL P2: https://clinicalcommons.ccdi.cancer.gov/studies/phs000464
- TARGET AML: https://clinicalcommons.ccdi.cancer.gov/studies/phs000465
- CCDI Data Catalog — TARGET ALL: https://datacatalog.ccdi.cancer.gov/dataset/TARGET-ALL%20Phase%202%20and%203
- CCDI Data Catalog — TARGET AML: https://datacatalog.ccdi.cancer.gov/dataset/TARGET-AML
- NCI GDC TARGET ALL: https://gdc.cancer.gov/content/target-all-publications-summary
- NCI GDC TARGET AML: https://gdc.cancer.gov/content/target-aml-publications-summary
- C3DC Release Notes: https://clinicalcommons.ccdi.cancer.gov/static/media/C3DC_Release_Notes_R8_V2.6f3cd31b.pdf

## Si quieren editar Leo's Adventure

El ZIP final no incluye `node_modules` para mantenerlo liviano. La demo ya está compilada en `leos-adventure-2/dist` y funciona sin Node.js. Solo si van a recompilar el código React:

```powershell
cd leos-adventure-2
npm install
npm run build
```
