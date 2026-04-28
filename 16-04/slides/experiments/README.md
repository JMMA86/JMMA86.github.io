# Slides modulares de experimentos

Seccion reconstruida en formato modular: una pantalla por archivo HTML.

## Estructura

- index.html (portada)
- pre_01_problema.html
- pre_02_importancia.html
- pre_03_objetivos.html
- trans_01_desarrollo.html
- pre_04_dataset.html
- pre_05_metodologia.html
- exp_01_enfoque.html
- 01_exp1_baseline.html
- exp_02_enfoque.html
- 02_exp2_aggregated.html
- exp_03_enfoque.html
- 03_exp3_categorical.html
- exp_04_enfoque.html
- 04_exp4_pruning.html
- 04b_exp4_pruning_comparativa.html
- exp_05_enfoque.html
- 05a_exp5_todos_modelos.html
- 05_exp5_duelo.html
- 06_exp5_xgb_a.html
- 07_exp5_xgb_b.html
- 08_exp5_xgb_c.html
- 09_exp5_tree_a.html
- 10_exp5_tree_b.html
- 11_exp5_tree_c.html
- 12_tree_final.html
- trans_02_avances.html
- 12_avances.html
- trans_03_cierre.html
- post_01_conclusiones.html
- post_02_trabajo_futuro.html
- post_03_gracias.html

## Estilo y navegacion

- Mismo lenguaje visual del archivo original de presentacion.
- Navegacion con flechas izquierda/derecha.
- Si hay scroll vertical en la pantalla actual, primero desplaza dentro de la pantalla.
- Al llegar al final/inicio, pasa a la siguiente/anterior pagina.
- Navegacion por puntos (dots) en la parte inferior.

## Datos

- Valores hardcodeados revisados manualmente contra metadata real.
- Cada pantalla incluye su bloque "Fuente datos".
- Regla de diseno: maximo 2 graficas por pantalla.

## Apertura

Se puede abrir directo desde archivo local o con servidor local.

Opcion servidor (recomendada):

```bash
python3 -m http.server 5500
```

Abrir:

- http://localhost:5500/doc/slides/experiments/index.html
