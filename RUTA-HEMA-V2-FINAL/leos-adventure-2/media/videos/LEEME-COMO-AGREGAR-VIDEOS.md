# Cómo agregar los videos instructivos

Las interfaces infantil y familiar ya contienen reproductores HTML5 reales y comparten este mismo catálogo. Los archivos de video no se incluyen porque deben ser preparados y validados por el equipo responsable.

## Ruta exacta

Copien los videos dentro de:

```text
RUTA-HEMA-V2-FINAL\leos-adventure-2\media\videos\
```

## Opción rápida: usar los tres nombres preparados

| Reproductor | Nombre exacto del archivo |
|---|---|
| Antes de mi tratamiento | `antes-del-tratamiento.mp4` |
| Durante mi visita | `durante-la-visita.mp4` |
| Después del tratamiento | `despues-del-tratamiento.mp4` |

Después de copiar los archivos, inicien la aplicación normalmente. No necesitan recompilar el proyecto.

## Formato recomendado

- Contenedor: MP4.
- Video: H.264.
- Audio: AAC.
- Proporción: 16:9.
- Resolución: 1280×720 o 1920×1080.
- Nombre: minúsculas, sin tildes, espacios ni datos personales.
- Duración sugerida: entre 2 y 5 minutos.
- Tamaño sugerido: menos de 100 MB por archivo.

## Cambiar títulos, descripciones o nombres

Editen el archivo `catalogo-videos.json` ubicado en esta misma carpeta. Cada elemento utiliza este formato:

```json
{
  "id": "mi-video",
  "icon": "🎬",
  "title": "Título que verá el niño",
  "duration": "3 min",
  "description": "Descripción breve y sencilla.",
  "objective": "Objetivo emocional o educativo",
  "file": "media/videos/mi-video.mp4",
  "mimeType": "video/mp4",
  "poster": "",
  "enabled": true
}
```

Para ocultar temporalmente un video cambien `"enabled": true` por `"enabled": false`.

Si desean una portada, copien una imagen JPG o PNG en esta carpeta y escriban, por ejemplo:

```json
"poster": "media/videos/portada-mi-video.jpg"
```

## Comprobación

1. Ejecuten `ruta-hema-referencia\iniciar-demo.ps1`.
2. Abran la interfaz Niño y entren en **Mis videos**.
3. Abran también la interfaz Familia y busquen **Videos: conozco mi tratamiento**.
4. Pulsen **Abrir reproductor** o **Reproducir guía**.
5. Si el nombre o la ruta son incorrectos, ambos reproductores mostrarán exactamente qué archivo falta.
6. Si reemplazaron un archivo y aparece la versión anterior, presionen `Ctrl + F5`.

Los videos deben ser revisados por el equipo responsable y no deben incluir datos personales del paciente.
