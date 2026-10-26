# BARBERFLOW — automatización v0.1

Implementación inicial para importar y validar en n8n. NO desplegada ni probada con APIs reales. No contiene secretos ni modifica la web NexumAutomatic.

## Entrega

- `workflows/01-sync.json`: Calendar → Sheets, cada 5 minutos; upsert por calendario + evento, sin sobrescribir el estado de recordatorios.
- `workflows/02-reminders.json`: cada 15 minutos, selecciona citas entre 23 h 30 min y 24 h antes, vuelve a consultar Calendar, registra `sending`, envía Gmail y registra `sent`.
- `workflows/03-errors.json`: Error Trigger y aviso al operador. Asociarlo como Error Workflow en Settings de los otros dos. No es un sondeo horario: avisa al fallar una ejecución de producción.
- `bookings-header.csv`: cabeceras de la pestaña `Bookings`.
- `build.py`: generador reproducible; ejecutar `python barberflow/build.py`.

## Configuración de la demo

1. Utilizar una cuenta Google exclusiva de pruebas. Crear la página real de Appointment Schedule con un servicio: Corte clásico, 30 min, 15 €. Configurar Europe/Madrid, presencial y email obligatorio. Usar un calendario dedicado a reservas; los bloqueos personales no deben tener invitados. No utilizar datos de clientes.
2. Comprobar que la cuenta permite esa página y evita reservar huecos ocupados. Tres servicios con distintas duraciones requieren comprobar las funciones del plan; no se promete gratuidad.
3. Crear una hoja Google Sheets con una pestaña `Bookings`, importar las cabeceras del CSV como primera fila. Protegerla frente a edición del público. Mantener las columnas como texto para evitar conversiones de fechas/IDs.
4. Importar los tres JSON en n8n. Sustituir todas las apariciones de `REPLACE_CALENDAR_ID`, `REPLACE_SPREADSHEET_ID`, `REPLACE_OPERATOR_EMAIL`. El ID del calendario aparece también dentro del nodo Normalize. Seleccionar credenciales en cada nodo Calendar, Sheets y Gmail desde el almacén de credenciales n8n, nunca pegarlas en JSON o GitHub. Calendar solo necesita lectura; Sheets escritura y Gmail envío.
5. Revisar en la versión instalada los parámetros de los nodos y ejecutar manualmente la sincronización. En Calendar events habilitar Show Deleted y Return All y quitar filtros de fechas que añada por defecto el editor. Esta versión recorre el calendario dedicado completo, incluidas cancelaciones: no emplea syncToken. Verificar que devuelve tanto una reserva futura creada hace tiempo como un evento cancelado sin fechas. Si la versión del nodo impone fechas o no devuelve cancelaciones, NO activar: sustituir ese nodo por Events.list paginado sin límites temporales. Nunca deducir una cancelación solo porque falta en una página.
6. Configurar el Error Workflow de sync y reminders con el ID del workflow 03 importado. El Error Trigger solo se prueba con ejecuciones automáticas; la ejecución manual no garantiza aviso.
7. Evitar solapamientos: UN único workflow de recordatorios y UN ejecutor de producción. En una instancia self-hosted dedicada regular fijar `N8N_CONCURRENCY_PRODUCTION_LIMIT=1` (verificar soporte de la versión). No usar queue/múltiples workers ni lanzar ejecuciones manuales mientras el workflow esté activo. Si n8n Cloud no permite asegurar exclusión mutua, NO activar recordatorios en producción: reemplazar Sheets como cola por una base con reclamación atómica y bloqueo. Sheets no proporciona exclusión mutua.
8. Revisar y limitar el historial de ejecuciones en la instancia; los JSON solicitan no guardar datos de éxito/error. Los errores deben notificarse sin nombres ni correos de clientes. No añadir logs con datos personales.

## Comportamiento y límites explícitos

Calendar siempre decide la cita, n8n nunca crea huecos ni reservas. La revalidación compara inicio, estado e invitado antes del envío; una cancelación que ocurre después de esa comprobación todavía puede cruzarse con el envío. No existe transacción entre Calendar y Gmail.

La clave del recordatorio es `calendar_id|event_id|inicio UTC`; una reprogramación puede generar un nuevo recordatorio. Las modificaciones se sincronizan por upsert. Los eventos recurrentes y de día completo se excluyen; se admite un invitado cliente por cita. Se envía al primer invitado válido, por lo que la cuenta dedicada y el formulario deben garantizar un solo cliente, sin coanfitriones.

Después de marcar `sending`, cualquier fallo posterior detiene el flujo; no hay reintento de Gmail configurado. Una fila `sending` requiere revisión humana, incluso si Gmail sí envió pero falló el registro. Confirmar en Enviados antes de cambiarla a `sent` o permitir un nuevo intento. El aviso de error también puede fallar si Gmail está caído; revisar el estado de ejecuciones n8n.

Esta v0.1 solo envía dentro de la ventana 23h30–24h. Una reserva hecha con menos antelación o una caída que sobrepase la ventana no recibe recordatorio. No se envía un recordatorio atrasado por sorpresa. Calendario debe seguir enviando su confirmación. Si hay recordatorios nativos activados, desactivar uno de los dos sistemas para evitar duplicados.

No hay borrado automático de datos en esta versión. Antes de usar clientes reales acordar retención, información de privacidad y procedimiento de eliminación. Para demo, borrar los datos ficticios al finalizar. No activar comercialmente hasta pasar la aceptación y cerrar exclusión mutua y retención.

## Aceptación con cuentas de pruebas

- Reserva real desde móvil → Calendar → una fila en Sheets.
- Dos intentos de reservar el mismo hueco; comprobar rechazo del segundo.
- Volver a sincronizar tres veces: una sola fila y estado de recordatorio conservado.
- Crear reserva futura, modificar servicio/inicio; comprobar actualización.
- Cancelar una reserva, incluida una sin fecha en el payload de cancelación; fila cancelada y ningún correo.
- Fecha con cambio de horario Europe/Madrid; comprobar inicio correcto en correo.
- Probar ventana de 24h con una cita apropiada o reducir temporalmente sus dos límites exclusivamente en demo.
- Repetir ejecución: un solo correo; reprogramar: nueva clave.
- Forzar fallo Gmail después de Claim: queda sending, aviso, no reenvío automático.
- Caída/reanudación fuera de ventana: no enviar tarde. Verificar que una cita creada con menos de 24h conserva confirmación nativa.
- Verificar alertas en ejecución automática y eliminar datos de prueba.

## Pruebas locales

`node --test barberflow/tests/test-rules.cjs`

Comprueban reglas y estructura, NO equivalen a importación ni ejecución real en n8n. Los nodos se generan para versiones Calendar 1.3, Sheets 4.5, Gmail 2.1, Code 2 y Schedule 1.2; comprobar compatibilidad al importar.

## Demo comercial de 60 segundos

0–20 s: abrir página real en móvil y reservar. 20–35 s: mostrar Calendar y hueco bloqueado. 35–45 s: ejecutar sync y mostrar la fila. 45–60 s: enseñar recordatorio real de prueba, indicando si la ventana temporal se aceleró para la demo. No presentar una simulación como producción.

Oferta pendiente de concretar IVA y alojamiento: 149 € de instalación; 75 € señal y 74 € entrega. No incluye WhatsApp, pagos, chatbot ni soporte permanente. No alojar sin límite por un único pago.
