# Gestión de transferencias ficticias

## Objetivo

Crear una aplicación web interna para registrar y administrar transferencias bancarias ficticias.

La aplicación no se conecta con bancos reales y no procesa dinero.

## Entidad Transferencia

Una transferencia contiene:

- `id`: identificador numérico.
- `referencia`: identificador visible y único.
- `cuentaOrigen`: texto descriptivo de la cuenta ficticia de origen.
- `cuentaDestino`: texto descriptivo de la cuenta ficticia de destino.
- `titularDestino`: nombre del destinatario ficticio.
- `monto`: monto decimal mayor que cero.
- `moneda`: `CLP`, `ARS` o `USD`.
- `descripcion`: concepto opcional.
- `estado`: `NUEVA`, `APROBADA` o `PAGADA`.
- `fechaAprobacion`: fecha opcional.
- `fechaPago`: fecha opcional.
- `createdAt`.
- `updatedAt`.

## Reglas

### Creación

Toda transferencia nueva debe comenzar en estado `NUEVA`.

La referencia debe ser única.

El usuario no puede elegir el estado durante la creación.

El monto debe ser mayor que cero.

La cuenta de origen y destino no pueden ser iguales.

### Aprobación

Una transferencia solamente puede aprobarse si está en estado `NUEVA`.

Al aprobarla:

- cambia a `APROBADA`;
- se registra `fechaAprobacion`.

### Pago

Una transferencia solamente puede pagarse si está en estado `APROBADA`.

Al pagarla:

- cambia a `PAGADA`;
- se registra `fechaPago`.

### Eliminación

Puede eliminarse una transferencia `NUEVA`.

No puede eliminarse una transferencia `APROBADA` ni `PAGADA`.

## API requerida

### Listar

`GET /api/transferencias`

Filtros opcionales:

- estado;
- moneda;
- búsqueda por referencia o destinatario.

### Obtener detalle

`GET /api/transferencias/:id`

### Crear

`POST /api/transferencias`

Ejemplo:

```json
{
  "cuentaOrigen": "CTA-EMPRESA-001",
  "cuentaDestino": "CTA-PROVEEDOR-020",
  "titularDestino": "Proveedor ficticio",
  "monto": 150000,
  "moneda": "CLP",
  "descripcion": "Pago de prueba"
}
```

### Aprobar

`PATCH /api/transferencias/:id/aprobar`

### Pagar

`PATCH /api/transferencias/:id/pagar`

### Eliminar

`DELETE /api/transferencias/:id`

## Interfaz requerida

### Pantalla principal

Debe mostrar:
-título;
-botón Nueva transferencia;
-filtro por estado;
-filtro por moneda;
-buscador;
-tabla de transferencias.

Columnas:
-referencia;
-destinatario;
-monto;
-estado;
-fecha;
-moneda;
-acciones.

## Formulario

Campos:
-cuenta de origen;
-cuenta de destino;
-titular de destino;
-monto;
-moneda;
-descripción.

## Acciones

Para una transferencia NUEVA:
-aprobar;
-eliminar.

Para una transferencia APROBADA:
-marcar como pagada.

Para una transferencia PAGADA:
-no mostrar acciones de modificación.

Toda acción de cambio de estado debe solicitar confirmación.

## Estados visuales

-NUEVA: chip neutral.
-APROBADA: chip informativo.
-PAGADA: chip de éxito.

## Manejo de errores

Mostrar mensajes comprensibles cuando:

-la API no responde;
-una validación falla;
-la referencia está duplicada;
-el estado cambió desde otra sesión;
-la transferencia no existe.

## Criterios de aceptación

-Se puede registrar una transferencia válida.
-Toda transferencia comienza como NUEVA.
-No puede crearse con monto cero o negativo.
-No puede crearse con la misma cuenta de origen y destino.
-Una transferencia nueva puede aprobarse.
-Una transferencia aprobada puede pagarse.
-No puede pagarse directamente una transferencia nueva.
-No pueden retrocederse estados.
-No puede eliminarse una transferencia aprobada o pagada.
-La tabla refleja los cambios sin recargar manualmente el navegador.
-Las reglas se validan en el backend.
-Las pruebas automatizadas cubren los cambios de estado.
