# Ruta Hema Infantil

Experiencia infantil tipo pasaporte para la demostración **Ruta Hematológica — INSN San Borja 2026**. Ofrece avatar, mapa, videos guía, juego, monedas, recompensas y celebración dentro de una ruta pediátrica clara y tranquilizadora.

## Qué incluye

- Selección de pacientes ficticios: `H-001` a `H-006`.
- Creación de avatar y recorrido infantil: llegada, equipo, control, tratamiento, descanso, próximo paso y seguimiento.
- Check-in emocional y mensajes sencillos: cómo me siento, me duele, estoy cansado, tengo náuseas o necesito ayuda.
- Eventos DEMO guardados en `localStorage`, compartidos con **Mi Ruta Hema** y **Ruta Hema Profesional**.
- Diseño adaptado para 3–6, 7–11, 12–15 y 15–17 años.
- Tienda de avatares con Tuntung Sajur y control parental compartido.
- Las monedas se entregan cuando el profesional registra una llegada puntual.
- Sin diagnósticos, dosis ni indicaciones clínicas: la aplicación solo comunica y organiza señales del niño.

## Ejecutar la demostración integrada

Desde la raíz del workspace:

```powershell
cd leos-adventure-2
npm run build
cd ..
.\ruta-hema-referencia\iniciar-demo.ps1
```

Abrir en el mismo navegador:

- Niño: `http://localhost:8765/leos-adventure-2/dist/`
- Familia: `http://localhost:8765/ruta-hema-referencia/mi-ruta-hema/`
- Profesional: `http://localhost:8765/ruta-hema-referencia/profesional/`

Las tres direcciones comparten el origen `localhost:8765`; por eso comparten `localStorage`.

## Flujo de prueba sugerido

1. En la app infantil, elegir `H-003`, crear un avatar y completar un paso.
2. Registrar “Preocupado”: Familia verá la novedad y Profesional podrá verla al actualizar su vista.
3. Registrar “Necesito ayuda”: se crea una alerta DEMO y una derivación pendiente para Servicio Social.
4. En Mi Ruta Hema, registrar “Dificultad de transporte”: el estado aparece en Profesional.

## Desarrollo

```powershell
npm install
npm run dev
npm run build
```

Para la demostración conectada, usar siempre la build y el script de la sección anterior.
