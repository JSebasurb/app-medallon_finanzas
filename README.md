<p align="center"><img src="assets/icon-192.png" width="96" alt="Medallón"></p>

# Medallón · Finanzas personales

App web para controlar gastos, ingresos, gastos fijos, presupuestos y metas de ahorro, con **arquitectura Medallón** y análisis con ML. No necesita servidor ni cuenta: se publica como sitio estático en **GitHub Pages**, se instala como app (PWA) y funciona sin conexión. Tus datos se guardan solo en tu dispositivo.

## Arquitectura Medallón

```
 Captura ──► 🥉 BRONCE ──► 🥈 PLATA ──► 🥇 ORO ──► ML / Análisis
 (formularios)  crudo        limpio       agregado    pronóstico, anomalías
                bronce.js    plata.js     oro.js      ml.js + notebook
```

| Capa | Qué hace | Código |
|---|---|---|
| Bronce | Guarda lo capturado tal cual (localStorage). | `js/bronce.js` |
| Plata | Valida, elimina duplicados, expande gastos fijos y deriva mes, semana y día. | `js/plata.js` |
| Oro | Agrega por semana o mes: ingresos, gastos, neto, ahorro. | `js/oro.js` |

## Estructura del repositorio

```
├── index.html · manifest.json · sw.js     App, PWA y modo sin conexión
├── css/styles.css                         Estilos (claro/oscuro automático)
├── js/                                    config · utils · bronce · plata · oro · ml · views · sheet · export · app
├── assets/                                Íconos (SVG, PNG, maskable, Apple)
├── notebooks/analisis_medallon.ipynb      Modelos en Python sobre Plata y Oro
├── data/{bronce,plata,oro}/               Tus exportaciones (ignoradas por git)
└── .github/workflows/pages.yml            Despliegue automático
```

## Publicar en GitHub Pages

1. Crea un repositorio y sube todo el contenido de esta carpeta a la rama `main`.
2. En **Settings → Pages**, elige **Source: GitHub Actions**.
3. Cada `push` a `main` publica en `https://TU_USUARIO.github.io/TU_REPO/`.

Alternativa sin Actions: **Source: Deploy from a branch → main / (root)** y borra `.github/`.

## Instalar como app
- **iPhone:** Safari → Compartir → *Agregar a pantalla de inicio*.
- **Android / escritorio:** Chrome → *Instalar app*.

## Flujo de ML
1. En la app: **Datos** → descarga Plata y Oro y guárdalos en `data/plata/` y `data/oro/`.
2. Abre `notebooks/analisis_medallon.ipynb` (`pip install pandas numpy scikit-learn matplotlib`).
3. Importa `data/oro/pronostico.csv` en **Análisis** para ver el pronóstico en la app.

## Privacidad
Todo ocurre en tu navegador. Haz respaldos con el JSON de Bronce: borrar los datos del navegador borra tus registros.

## Licencia
MIT
