# Documentación del Proyecto - Predicción de Shock Hemorrágico

## Estructura de la Documentación

```
doc/
├── README.md                    # Este archivo (índice de documentación)
├── experimentos.md             # Resumen de todos los experimentos realizados
├── latex/                      # Documento principal del proyecto (LaTeX)
│   ├── main.tex               # Documento principal
│   ├── metrics.tex            # Definiciones de métricas
│   ├── main.pdf               # PDF generado
│   └── images/                # Imágenes para el documento LaTeX
├── experiments/               # Resultados detallados de experimentos
│   ├── exp_01_base_models/
│   ├── exp_02_aggregated_features/
│   ├── exp_03_categorical_features/
│   ├── exp_04_feature_pruning/
│   └── exp_05_hyperparameter_search/
└── slides/                    # Presentaciones del proyecto
    ├── presentacion-final-adaptado-shock-hemorragico.html
    ├── plantilla-icesi.html
  └── Formato Planeación oralidad.pdf

## Documentos Principales

### 1. Documento LaTeX Principal
- **Ubicación**: `latex/main.tex`
- **Descripción**: Documento completo del proyecto de grado con todos los detalles técnicos
- **Compilación**: 
  ```bash
  cd latex
  pdflatex main.tex
  bibtex main
  pdflatex main.tex
  pdflatex main.tex
  ```

### 2. Presentación HTML
- **Ubicación**: `slides/presentacion-final-adaptado-shock-hemorragico.html`
- **Descripción**: Presentación interactiva moderna con diseño ICESI
- **Visualización**: Abrir directamente en navegador web
- **Navegación**: 
  - Flechas del teclado (← →)
  - Click en indicadores
  - Rueda del mouse

### 3. Resumen de Experimentos
- **Ubicación**: `experimentos.md`
- **Descripción**: Resumen consolidado de todos los experimentos realizados
- **Contenido**: Métricas, configuraciones y resultados de cada experimento

## Experimentos

### Experimento 1: Modelos Base
- Sin ingeniería de características adicionales
- Establece línea base de rendimiento

### Experimento 2: Features Agregadas
- Incorpora variables derivadas (N_COMORB, CARDIO_RISK, etc.)
- Mejora en recall y AUC-ROC

### Experimento 3: Features Categóricas
- Discretización de variables continuas (AGE_65, AGE_75, etc.)
- Análisis de impacto en interpretabilidad

### Experimento 4: Poda de Features
- Eliminación de características con baja prevalencia
- Optimización del modelo

### Experimento 5: Búsqueda de Hiperparámetros
- RandomizedSearchCV para optimización
- Configuración final del modelo

## Guía de Uso

### Para Desarrolladores
1. Los experimentos se ejecutan desde el DAG de Airflow
2. Resultados se guardan automáticamente en `experiments/`
3. Gráficas y métricas se generan por cada experimento

### Para Presentación
1. Usar la presentación HTML para defensa del proyecto
2. El documento LaTeX contiene todos los detalles técnicos
3. Los experimentos están documentados con gráficas y métricas

## Mantenimiento

### Actualizar Documento LaTeX
1. Editar `latex/main.tex`
2. Agregar nuevas imágenes en `latex/images/`
3. Compilar con pdflatex

### Actualizar Presentación
1. Editar `slides/presentacion-final-adaptado-shock-hemorragico.html`
2. Las imágenes están embebidas o en rutas relativas
3. Probar en navegador moderno (Chrome, Firefox, Edge)

### Agregar Nuevos Experimentos
1. Crear carpeta `experiments/exp_XX_nombre/`
2. Incluir resultados y gráficas
3. Actualizar `experimentos.md` con resumen