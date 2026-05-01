# Informe de Dominio de Negocio y Datos: SKUlytics

## 1. Propósito Central de SKUlytics

SKUlytics es una **plataforma de inteligencia retail para marcas de e-commerce** que busca optimizar el rendimiento comercial en canales de venta digitales (Amazon, Walmart, Target).

### Problema que Resuelve

Las marcas que venden a través de retailers online enfrentan desafíos operativos críticos:

1. **Visibilidad limitada del rendimiento**: Datos dispersos entre múltiples retailers sin una vista unificada
2. **Reacción tardía a problemas**: Caídas en conversión, stockouts, o precios desalineados que se detectan después de impactar ventas
3. **Optimización de contenido manual**: Mejorar títulos, descripciones y scores de calidad requiere análisis manual intensivo

### Valor Entregado

- **Detección proactiva de anomalías**: Sistema de alertas que identifica desviaciones críticas antes de perder revenue
- **Análisis causal automatizado**: Agente investigador que diagnostica la raíz del problema y recomienda acciones
- **Optimización de conversión**: Correlación entre calidad de contenido (títulos, imágenes) y métricas de negocio (CVR, ventas)

---

## 2. Modelos de Datos y Granularidad

### Tabla Central: `fact_retail_summary_tbl`

**Granularidad**: Un registro por día, producto, retailer y región.

```
(date_key, product_key, retailer_key, region_key, brand_key)
```

**Propósito**: Almacena métricas diarias de rendimiento comercial y calidad de contenido para análisis temporal y alertas.

**Columnas Clave**:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `date_key` | DATE | Fecha de la transacción/snapshot |
| `product_key` | STRING | SKU (ej: SKU015) |
| `retailer_key` | STRING | Canal de venta (amazon, walmart, target) |
| `region_key` | STRING | Geografía (usa_natl, canada_natl) |
| `brand_key` | STRING | Marca propietaria (brand_001: BrewMaster) |
| **Ventas** | | |
| `gross_sales_ty` | DOUBLE | Ventas brutas año actual ($) |
| `gross_sales_ly` | DOUBLE | Ventas brutas año anterior ($) |
| `full_size_units_sold_ty` | BIGINT | Unidades vendidas año actual |
| **Inventario** | | |
| `inventory_on_hand` | BIGINT | Stock disponible en almacén |
| `oos_percent_month_ty` | DOUBLE | % días con out-of-stock este mes |
| **Precio** | | |
| `unit_price_ty` | DOUBLE | Precio unitario actual ($) |
| `unit_price_ly` | DOUBLE | Precio unitario año pasado ($) |
| **Conversión y Tráfico** | | |
| `cvr` | DOUBLE | Conversion Rate (ej: 0.025 = 2.5%) |
| `views_ty` | BIGINT | Vistas de página año actual |
| `bounce_rate` | DOUBLE | Tasa de rebote (0-1) |
| **Calidad de Contenido** | | |
| `contentscore` | BIGINT | Score global de calidad (0-100) |
| `titlescore` | BIGINT | Score específico del título |
| `imagescore` | BIGINT | Score de calidad de imágenes |
| `keywordscore` | BIGINT | Cobertura de keywords objetivo |

### Dimensiones Relacionadas

#### `dim_product`
- **Grain**: Un registro por SKU
- **Campos**: `product_key`, `product_name`, `brand_key`, `category`, `subcategory`, `segment`
- **Ejemplo**: SKU015 = "12-Cup Coffee Maker", categoría "Appliances/Coffee Makers"

#### `dim_retailer`
- **Grain**: Un registro por retailer
- **Campos**: `retailer_key`, `retailer_name`, `channel_type`, `platform_region`
- **Valores**: amazon, walmart, target (todos "Online", "North America")

#### `dim_brand`
- **Grain**: Un registro por marca
- **Campos**: `brand_key`, `brand_name`, `parent_company`, `brand_tier`, `brand_tone`
- **Ejemplo**: brand_001 = "BrewMaster" (Mid-market, "Professional and Reliable")

#### `dim_region`
- **Grain**: Un registro por región geográfica
- **Campos**: `region_key`, `region_name`, `country`
- **Valores**: usa_natl (USA National), canada_natl (Canada)

### Relaciones

```
fact_retail_summary_tbl (FACT)
├── dim_product (product_key)
│   └── dim_brand (brand_key)
├── dim_retailer (retailer_key)
└── dim_region (region_key)
```

---

## 3. Desglose de las 3 Alertas del Sistema

### 🔴 Alerta 1: **YoY Sales Mismatch (Promo) - Desajuste de Promoción Histórica**

#### Contexto de Negocio
Target suele ejecutar promociones estacionales (Black Friday, Back-to-School). Si este año no activan una promoción que sí existió el año pasado, las ventas caerán significativamente sin que sea un problema de producto o contenido.

#### Trigger Matemático
```sql
WHERE gross_sales_ty < (gross_sales_ly * 0.8)          -- Ventas bajaron >20%
  AND unit_price_ty > (unit_price_ly * 1.1)           -- Precio subió >10%
  AND retailer_key = 'target'                         -- Solo en Target
  AND date_key >= date_sub(CURRENT_DATE, 7)          -- Últimos 7 días
```

**Traducción**: Producto vendió >20% menos que el año pasado **y** el precio es >10% más alto. Esto sugiere que el año anterior había descuento activo.

#### Hipótesis a Explorar
- **Auditoría Histórica de Promociones**: Confirmar que existió promoción activa hace 1 año
- **Comparación de Precios**: Visualizar gap de precio año vs año en ventana de 14 días
- **Estatus de Promo Actual**: Determinar si Target olvidó activar descuento planificado

#### SQL de Investigación
```sql
SELECT 
    date_key,
    unit_price_ty as precio_este_año,
    unit_price_ly as precio_año_pasado,
    (unit_price_ty - unit_price_ly) as diferencia_precio,
    CASE 
        WHEN unit_price_ly < unit_price_ty THEN 'Promo Activa (AÑO PASADO)' 
        ELSE 'Sin Promo' 
    END as estado_promo
FROM fact_retail_summary_tbl 
WHERE product_key = '{product_key}' 
  AND retailer_key = 'target'
  AND date_key BETWEEN date_sub(DATE '{trigger_date}', 14) AND DATE '{trigger_date}'
ORDER BY date_key ASC
```

#### Acciones Recomendadas
1. **Contactar Account Manager de Target**: Verificar calendario promocional planificado
2. **Negociar activación urgente**: Si la promo estaba acordada pero no se ejecutó
3. **Ajustar forecast**: Si la promo no se repetirá, actualizar expectativas de ventas
4. **Comunicar a Marketing**: Preparar campañas alternativas para compensar falta de descuento

#### Datos de Prueba Esperados
```json
{
  "trigger_data": {
    "retailer_key": "target",
    "product_key": "SKU015",
    "region_key": "usa_natl",
    "brand_key": "brand_001",
    "trigger_date": "2026-01-01",
    "gross_sales_ty": 15000.00,
    "gross_sales_ly": 22000.00,      // -31.8% YoY
    "unit_price_ty": 89.99,
    "unit_price_ly": 69.99,          // +28.5% precio (indica promo pasada)
    "sales_drop_pct": -31.8,
    "price_increase_pct": 28.5
  }
}
```

---

### 🔴 Alerta 2: **Conversion Rate Mismatch - Caída de Conversión**

#### Contexto de Negocio
Un producto recibe tráfico (300+ views/día) pero convierte muy bajo (<2%). Esto indica que el contenido de la página (título, imágenes, descripciones) no convence a los compradores. Mientras tanto, el mismo producto en otros retailers convierte mejor.

#### Trigger Matemático
```sql
WHERE cvr < 0.02                                      -- CVR < 2%
  AND views_ty > 300                                  -- Tráfico significativo
  AND date_key >= date_sub(CURRENT_DATE, 7)          -- Últimos 7 días
  AND product_key != 'SKU003'                         -- Excluir productos específicos
```

**Traducción**: Producto tiene audiencia pero no vende. Problema de **contenido**, no de tráfico.

#### Hipótesis a Explorar
- **Benchmark Cross-Retailer**: Comparar CVR y scores de contenido entre Amazon/Walmart/Target
- **Identificar Gaps Específicos**: ¿Qué tiene el mejor retailer que el peor no tiene?
- **Correlación Scores**: ¿Qué componente (título/imágenes) tiene mayor impacto en CVR?

#### SQL de Investigación
```sql
SELECT 
    retailer_key,
    contentscore as score_contenido,
    titlescore as score_titulo,
    imagescore as score_imagenes,
    cvr as conversion_rate
FROM fact_retail_summary_tbl
WHERE product_key = '{product_key}'
  AND date_key = DATE '{trigger_date}'
ORDER BY contentscore DESC
```

**Output Esperado**:
| retailer | contentscore | titlescore | imagescore | cvr |
|----------|--------------|------------|------------|-----|
| amazon   | 85           | 90         | 88         | 0.0350 |
| target   | 72           | 65         | 70         | 0.0180 |
| walmart  | 68           | 60         | 65         | 0.0150 |

**Insight**: Walmart tiene el peor título (60) y CVR más bajo (1.5%). Acción: Reescribir título usando best practices.

#### Acciones Recomendadas
1. **Auditoría de Contenido**: Revisar PDP (Product Detail Page) del retailer con bajo CVR
2. **A/B Test de Títulos**: Implementar título del retailer ganador en el perdedor
3. **Mejorar Imágenes**: Si `imagescore` es bajo, agregar lifestyle images o 360° views
4. **Optimizar Keywords**: Si `keywordscore` es bajo, incorporar términos de búsqueda top

#### Datos de Prueba Esperados
```json
{
  "trigger_data": {
    "retailer_key": "walmart",
    "product_key": "SKU015",
    "region_key": "usa_natl",
    "brand_key": "brand_001",
    "trigger_date": "2026-01-01",
    "cvr": 0.0150,                   // 1.5% (bajo)
    "views_ty": 450,                 // Tráfico suficiente
    "contentscore": 68,              // Score bajo
    "titlescore": 60,
    "imagescore": 65,
    "bounce_rate": 0.68              // 68% se van sin comprar
  }
}
```

---

### 🔴 Alerta 3: **Imminent Stockout Risk - Riesgo de Agotamiento Inminente**

#### Contexto de Negocio
El producto vende rápido (velocidad alta) pero el inventario disponible está por debajo de 50 unidades. A esta tasa de venta, el stock se agotará en 3-5 días. Un stockout significa pérdida de ventas, caída en ranking orgánico, y pérdida de Buy Box.

#### Trigger Matemático
```sql
WHERE inventory_on_hand < 50                          -- Stock crítico
  AND full_size_units_sold_ty > 0                     -- Hay demanda activa
  AND date_key >= date_sub(CURRENT_DATE, 7)          -- Últimos 7 días
```

**Traducción**: Inventario bajo + ventas activas = **agotamiento inminente**.

#### Hipótesis a Explorar
- **Velocidad de Venta vs Inventario**: Calcular días hasta stockout basado en ventas promedio de últimos 14 días
- **Tendencia de Depleción**: Visualizar curva de inventario + ventas para confirmar aceleración
- **Impacto en OOS**: Ver si % de out-of-stock ya está aumentando (`oos_percent_month_ty`)

#### SQL de Investigación
```sql
SELECT 
    date_key,
    full_size_units_sold_ty as unidades_vendidas,
    inventory_on_hand as inventario_disponible,
    oos_percent_month_ty as riesgo_oos
FROM fact_retail_summary_tbl 
WHERE product_key = '{product_key}' 
  AND retailer_key = '{retailer_key}'
  AND region_key = '{region_key}'
  AND date_key BETWEEN date_sub(DATE '{trigger_date}', 14) AND DATE '{trigger_date}'
ORDER BY date_key ASC
```

**Output Esperado**:
| date_key   | unidades_vendidas | inventario_disponible | riesgo_oos |
|------------|-------------------|-----------------------|------------|
| 2025-12-18 | 12                | 180                   | 0.0        |
| 2025-12-19 | 15                | 165                   | 0.0        |
| 2025-12-20 | 18                | 147                   | 0.0        |
| ...        | ...               | ...                   | ...        |
| 2025-12-31 | 22                | 48                    | 0.12       |
| 2026-01-01 | 20                | 28                    | 0.18       |

**Cálculo**: Velocidad promedio = 18 unidades/día. Días restantes = 28 / 18 = **1.5 días** hasta stockout.

#### Acciones Recomendadas
1. **Alerta Urgente a Supply Chain**: Solicitar reabastecimiento express (2-3 días)
2. **Pausar Campañas Pagas**: Desactivar ads de Google/Amazon para no acelerar depleción
3. **Redistribuir Inventario**: Si hay stock en otra región, mover unidades
4. **Comunicar a Retail Partner**: Avisar a Amazon/Walmart para evitar penalización en ranking

#### Datos de Prueba Esperados
```json
{
  "trigger_data": {
    "retailer_key": "amazon",
    "product_key": "SKU003",
    "region_key": "usa_natl",
    "brand_key": "brand_002",
    "trigger_date": "2026-01-01",
    "inventory_on_hand": 28,         // Stock crítico
    "full_size_units_sold_ty": 20,   // Ventas activas
    "oos_percent_month_ty": 0.18,    // 18% del mes con OOS
    "avg_daily_sales_14d": 18,       // Promedio últimos 14 días
    "days_until_stockout": 1.5       // Calculado
  }
}
```

---

## 4. Formato de Datos de Prueba para Testing

Para simular cada escenario de alerta en Databricks, necesitas insertar filas en `fact_retail_summary_tbl` que cumplan las condiciones del trigger.

### Plantilla Genérica de Row

```python
{
    "retail_summary_key": "uuid-generado",
    "retailer_product_key": f"{retailer_key}_{product_key}",
    "product_key": "SKU015",
    "retailer_key": "target",
    "region_key": "usa_natl",
    "brand_key": "brand_001",
    "datekey": 20260101,                  # YYYYMMDD
    "date_key": "2026-01-01",
    
    # Ventas y Unidades
    "gross_sales_ty": 15000.00,
    "gross_sales_ly": 22000.00,
    "full_size_units_sold_ty": 167,
    "full_size_units_sold_ly": 245,
    
    # Inventario
    "inventory_on_hand": 45,              # Bajo para stockout
    "oos_percent_month_ty": 0.12,
    
    # Precios
    "unit_price_ty": 89.99,
    "unit_price_ly": 69.99,               # Indica promo pasada
    
    # Conversión y Tráfico
    "cvr": 0.0150,                        # Bajo para conv mismatch
    "views_ty": 450,
    "bounce_rate": 0.68,
    
    # Scores de Contenido
    "contentscore": 68,
    "titlescore": 60,
    "imagescore": 65,
    
    # Timestamps
    "record_created_date": "2026-01-01T12:00:00",
    "record_updated_date": "2026-01-01T12:00:00"
}
```

### Casos de Prueba Específicos

#### Caso 1: Promo Mismatch (Target)
```python
insert_row({
    "product_key": "SKU015",
    "retailer_key": "target",
    "date_key": "2026-01-01",
    "gross_sales_ty": 15000,
    "gross_sales_ly": 22000,           # -31.8% drop
    "unit_price_ty": 89.99,
    "unit_price_ly": 69.99             # +28.5% price (no promo)
})
```

#### Caso 2: Conversion Drop (Walmart)
```python
insert_row({
    "product_key": "SKU003",
    "retailer_key": "walmart",
    "date_key": "2026-01-01",
    "cvr": 0.0150,                     # 1.5% conversion
    "views_ty": 450,                   # High traffic
    "contentscore": 68,
    "titlescore": 60
})
```

#### Caso 3: Stockout Risk (Amazon)
```python
insert_row({
    "product_key": "SKU003",
    "retailer_key": "amazon",
    "date_key": "2026-01-01",
    "inventory_on_hand": 28,           # Low stock
    "full_size_units_sold_ty": 20,     # Active sales
    "oos_percent_month_ty": 0.18
})
```

---

## Resumen Ejecutivo

**SKUlytics** es un **sistema de alerta temprana para retail e-commerce** que detecta 3 tipos de problemas operacionales antes de que escalen:

1. **Promociones faltantes** → Impacto en ventas por desalineación de precio YoY
2. **Contenido deficiente** → Tráfico que no convierte por baja calidad de PDP
3. **Riesgo de stockout** → Inventario crítico con ventas activas

El modelo de datos está centrado en `fact_retail_summary_tbl` (granularidad diaria por SKU-retailer-región), enriquecida con dimensiones de producto, marca y retailer. El agente investigador ejecuta SQLs parametrizados contra esta tabla para diagnosticar causas raíz y recomendar acciones correctivas específicas.
