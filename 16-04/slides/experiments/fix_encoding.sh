#!/bin/bash

# Script para corregir caracteres mal codificados en archivos HTML

BASE_DIR="C:/Users/manuel.marin/Downloads/FVL/slides/experiments"
cd "$BASE_DIR"

# Contador
FIXED=0

# Iterar sobre todos los archivos HTML
for file in *.html; do
    echo "Procesando: $file"

    # Crear respaldo
    cp "$file" "$file.bak"

    # Aplicar correcciones con sed
    sed -i 's/â†'/→/g' "$file"
    sed -i 's/â€"/—/g' "$file"
    sed -i 's/Ãngela/Ángela/g' "$file"
    sed -i 's/GÃ³mez/Gómez/g' "$file"
    sed -i 's/MarÃ­n/Marín/g' "$file"
    sed -i 's/Ã"scar/Óscar/g' "$file"
    sed -i 's/FundaciÃ³n/Fundación/g' "$file"
    sed -i 's/PredicciÃ³n/Predicción/g' "$file"
    sed -i 's/hemorrÃ¡gico/hemorrágico/g' "$file"
    sed -i 's/cirugÃ­a/cirugía/g' "$file"
    sed -i 's/Fundacion /Fundación /g' "$file"
    sed -i 's/Composicion/Composición/g' "$file"
    sed -i 's/Clinicas/Clínicas/g' "$file"
    sed -i 's/numericas/numéricas/g' "$file"
    sed -i 's/prequirurgica/prequirúrgica/g' "$file"
    sed -i 's/fisica /física /g' "$file"
    sed -i 's/Division/División/g' "$file"
    sed -i 's/Validacion/Validación/g' "$file"
    sed -i 's/Hipertension/Hipertensión/g' "$file"
    sed -i 's/cancer /cáncer /g' "$file"
    sed -i 's/organos/órganos/g' "$file"
    sed -i 's/perfusion/perfusión/g' "$file"
    sed -i 's/multiorganica/multiorgánica/g' "$file"
    sed -i 's/Tardia/Tardía/g' "$file"
    sed -i 's/interpretacion/interpretación/g' "$file"
    sed -i 's/personalizacion/personalización/g' "$file"
    sed -i 's/sanguineas/sanguíneas/g' "$file"
    sed -i 's/dano /daño /g' "$file"
    sed -i 's/saturacion/saturación/g' "$file"
    sed -i 's/intervencion/intervención/g' "$file"
    sed -i 's/Preparacion/Preparación/g' "$file"
    sed -i 's/hipoperfusion/hipoperfusión/g' "$file"
    sed -i 's/recuperacion/recuperación/g' "$file"
    sed -i 's/ Clinico/ Clínico/g' "$file"
    sed -i 's/ clinico/ clínico/g' "$file"
    sed -i 's/ clinica/ clínica/g' "$file"
    sed -i 's/ clinicas/ clínicas/g' "$file"
    sed -i 's/diagnosticos/diagnósticos/g' "$file"
    sed -i 's/METODOLOGICO/METODOLÓGICO/g' "$file"
    sed -i 's/Metodologico/Metodológico/g' "$file"
    sed -i 's/mineria/minería/g' "$file"
    sed -i 's/cientifico/científico/g' "$file"
    sed -i 's/exploracion/exploración/g' "$file"
    sed -i 's/transformacion/transformación/g' "$file"
    sed -i 's/preparacion/preparación/g' "$file"
    sed -i 's/diagnosticas/diagnósticas/g' "$file"
    sed -i 's/ medico/ médico/g' "$file"
    sed -i 's/ medica/ médica/g' "$file"
    sed -i 's/quirurgico/quirúrgico/g' "$file"
    sed -i 's/quirurgica/quirúrgica/g' "$file"
    sed -i 's/ analisis/ análisis/g' "$file"
    sed -i 's/ especifico/ específico/g' "$file"
    sed -i 's/ diagnostico/ diagnóstico/g' "$file"
    sed -i 's/ basica/ básica/g' "$file"
    sed -i 's/ metricas/ métricas/g' "$file"
    sed -i 's/estadistica/estadística/g' "$file"
    sed -i 's/parametros/parámetros/g' "$file"
    sed -i 's/ grafica/ gráfica/g' "$file"
    sed -i 's/ grafico/ gráfico/g' "$file"
    sed -i 's/farmacologica/farmacológica/g' "$file"
    sed -i 's/optimizacion/optimización/g' "$file"
    sed -i 's/ validacion/ validación/g' "$file"
    sed -i 's/ precision/ precisión/g' "$file"
    sed -i 's/ tecnica/ técnica/g' "$file"
    sed -i 's/ tecnicas/ técnicas/g' "$file"
    sed -i 's/ especifica/ específica/g' "$file"
    sed -i 's/ especificas/ específicas/g' "$file"
    sed -i 's/caracteristicas/características/g' "$file"
    sed -i 's/ logica/ lógica/g' "$file"
    sed -i 's/ practica/ práctica/g' "$file"
    sed -i 's/ codigo/ código/g' "$file"
    sed -i 's/ numero/ número/g' "$file"
    sed -i 's/ unica/ única/g' "$file"
    sed -i 's/ unico/ único/g' "$file"
    sed -i 's/ critica/ crítica/g' "$file"
    sed -i 's/ critico/ crítico/g' "$file"
    sed -i 's/â†/←/g' "$file"
    sed -i 's/ Que / Qué /g' "$file"
    sed -i 's/>Que /'>Qué /g' "$file"
    sed -i 's/ QUE / QUÉ /g' "$file"
    sed -i 's/>QUE />QUÉ /g' "$file"

    # Comparar con el backup para ver si hubo cambios
    if ! cmp -s "$file" "$file.bak"; then
        echo "  ✓ Corregido"
        ((FIXED++))
    else
        echo "  - Sin cambios"
    fi

    # Eliminar backup
    rm "$file.bak"
done

echo ""
echo "Resumen: Se corrigieron $FIXED archivos"
