# Nota de datos

Los archivos públicos recomendados por la Hackatón permiten explorar información clínica desidentificada de TARGET ALL y TARGET AML. En esta versión del MVP se integran **metadatos y conteos públicos verificables** directamente en la interfaz y se mantiene la operación hospitalaria como escenario sintético.

No se copiaron historias clínicas ni se usaron nombres, DNI, teléfonos o datos identificables.

El motivo es metodológico: TARGET/C3DC aportan diagnóstico, tratamiento, respuesta, supervivencia y otros elementos de investigación; no aportan las citas del INSN, las barreras de transporte de una familia específica ni la intervención de Servicio Social del hospital. Atribuir esas variables a TARGET sería incorrecto.

Si el equipo descarga posteriormente un export individual de C3DC, se puede incorporar como **cohorte de investigación separada**, sin mezclarla con los casos operativos H-*.

## Archivos clínicos públicos identificados en el catálogo CCDI

El catálogo oficial muestra, entre sus archivos disponibles, al menos:

- TARGET ALL Phase II Discovery: `https://d2l5jy2ao2mx5b.cloudfront.net/target/phs000464/TARGET_ALL_ClinicalData_Phase_II_Discovery_20211118.xlsx`
- TARGET AML Discovery: `https://d2l5jy2ao2mx5b.cloudfront.net/target/phs000465/TARGET_AML_ClinicalData_Discovery_20211201.xlsx`

No son necesarios para ejecutar esta versión del MVP. Si el equipo decide incorporar registros individuales desidentificados más adelante, conviene conservarlos como una cohorte de investigación separada de los casos operativos H-*.
