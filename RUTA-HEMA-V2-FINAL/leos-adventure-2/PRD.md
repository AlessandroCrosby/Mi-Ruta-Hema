# PRD · Ruta Hema Infantil

## Propósito

Proveer una interfaz pediátrica amable para que un niño comprenda su recorrido y comunique cómo se siente. Es parte de una solución DEMO compuesta por tres interfaces: Niño, Familia y Profesional.

## Principios de producto

- **Experiencia infantil consistente:** avatar, tarjetas, navegación, mapa, animaciones, recompensas y progresión infantil.
- **El contenido se adapta:** lenguaje simple, visual y sin terminología médica compleja.
- **No es una herramienta diagnóstica:** registra señales de comunicación; no aconseja tratamientos, dosis ni determina gravedad.
- **Datos ficticios únicamente:** pacientes DEMO `H-001` a `H-006`.

## Experiencia infantil tipo pasaporte

1. El niño elige su código DEMO.
2. Crea o selecciona su avatar.
3. Recorre el mapa: Mi llegada, Conozco al equipo, Mi control, Mi tratamiento, Descanso y recuperación, Mi próximo paso y Seguimiento.
4. Puede indicar su emoción o comunicar una molestia con opciones visuales.
5. Recibe refuerzo positivo, badges y celebración al avanzar.
6. Ve videos guía y juega una actividad adaptada a su grupo etario.
7. Consulta monedas otorgadas por puntualidad y desbloquea avatares con aprobación parental cuando corresponde.

### Segmentación por edad

- Primera infancia: 3 a 6 años.
- Escolar: 7 a 11 años.
- Adolescente: 12 a 15 años.
- Adolescente mayor: 15 a 17 años. Para evitar solapamiento, la edad 15 se asigna al grupo anterior.

### Control familiar y continuidad

- La familia administra juegos, tiempo diario, recordatorios y aprobación de compras.
- Los casos ámbar reciben una encuesta breve de barreras no clínicas.
- Las respuestas, la actividad educativa y las recompensas se muestran al profesional.

### Comunicación infantil

- Emociones: Tranquilo, Bien, Más o menos, Preocupado, Necesito ayuda.
- Mensajes: Estoy bien, Me duele un poco, Estoy cansado, Tengo náuseas, Necesito que me ayuden, Necesito hablar con alguien.

## Contrato de sincronización DEMO

La clave compartida es `rutahema_v1` en `localStorage`. Los eventos infantiles se registran como novedades del paciente y se anuncian mediante `rutahema_last_event` y `rutahema:changed`.

| Evento | Resultado compartido |
| --- | --- |
| `child_checkin` | Novedad para Familia y Profesional. |
| `child_symptom_report` | Comunicación simple del niño, sin interpretación clínica. |
| `child_help_request` | Novedad, alerta pendiente y caso DEMO para Servicio Social. |
| `child_journey_progress` | Último paso/progreso de la aventura. |
| `BARRIER_CREATED` | Solicitud de Familia visible para el equipo. |

La persistencia es local y se reemplazará por una API autenticada en una fase futura.

## Criterios de aceptación

- La app infantil se reconoce como una aventura pediátrica cálida, clara e interactiva de Ruta Hema.
- H-003 puede generar un check-in visible en Mi Ruta Hema y Ruta Hema Profesional.
- “Necesito ayuda” genera una alerta para Servicio Social sin presentarse como diagnóstico.
- Una barrera reportada por la familia permanece visible para Profesional.
- Una cita actualizada en Profesional aparece en Familia.
- Las interfaces de Familia y Profesional no se rediseñan.
