# data/ · capas del Medallón

Aquí guardas, **solo en tu equipo**, lo que exporta la app (pestaña *Datos*). Los CSV/JSON están en `.gitignore` para que tus finanzas no terminen en un repositorio público.

| Carpeta | Archivo | Contenido |
|---|---|---|
| `bronce/` | `medallon-respaldo.json` | Registros crudos tal como los capturaste (también sirve para restaurar la app). |
| `plata/` | `plata_movimientos.csv` | `id, fecha, mes, semana, dia_semana, tipo, categoria, monto, nota, origen` |
| `oro/` | `oro_mensual.csv`, `oro_semanal.csv` | `periodo, ingresos, gastos, neto, movimientos, tasa_ahorro` |

El notebook `notebooks/analisis_medallon.ipynb` lee Plata y Oro y escribe `oro/pronostico.csv`, que puedes importar de vuelta en la app (Análisis → Importar pronostico.csv).
