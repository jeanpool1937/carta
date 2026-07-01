# Cartas para Karina

Colección de cartas de amor digitales, cada una con su propio diseño visual.

## Estructura

- `index.html` — página de inicio con el listado de cartas
- `designs/` — cada carta como un HTML independiente
- `shared/` — recursos compartidos (animación de pétalos, imagen, configuración)
- `export/` — versión exportada/compilada de una carta

## Cómo verla localmente

Al ser HTML/CSS/JS estático sin build, basta con abrir `index.html` en el navegador,
o servir la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8000
```

## La carta "Diario de una Pasión"

`designs/06-diario-de-una-pasion.html` es editable y sincroniza el contenido en
tiempo real vía Supabase (con `localStorage` como respaldo si no hay conexión).
La configuración de Supabase vive en `shared/config.js`.
