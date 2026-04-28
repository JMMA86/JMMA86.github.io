#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import glob

# Mapeo de caracteres mal codificados a correctos
replacements = {
    # Caracteres mal codificados comunes
    'Ã³': 'ó', 'Ã¡': 'á', 'Ã­': 'í', 'Ã©': 'é', 'Ãº': 'ú',
    'Ã'': 'Ó', 'Ã': 'Á', 'Ã': 'Í', 'Ã‰': 'É', 'Ãš': 'Ú',
    'Ã±': 'ñ', 'Ã'': 'Ñ',
    'Ã³n': 'ón', 'Ã¡gico': 'ágico', 'Ã­a': 'ía',
    'â†': '→', 'â†'': '→', 'â€"': '—', 'â€˜': ''', 'â€™': ''',

    # Palabras específicas encontradas
    'Predicciรณn': 'Predicción',
    'PredicciÃ³n': 'Predicción',
    'hemorrรกgico': 'hemorrágico',
    'hemorrÃ¡gico': 'hemorrágico',
    'cirugรญa': 'cirugía',
    'cirugÃ­a': 'cirugía',
    'Ã\x81ngela': 'Ángela',
    'Ãngela': 'Ángela',
    'Gรณmez': 'Gómez',
    'GÃ³mez': 'Gómez',
    'Marรญn': 'Marín',
    'MarÃ­n': 'Marín',
    'ร"scar': 'Óscar',
    'Ã"scar': 'Óscar',
    'Fundaciรณn': 'Fundación',
    'FundaciÃ³n': 'Fundación',

    # Palabras sin tilde
    'organos': 'órganos',
    'perfusion': 'perfusión',
    'multiorganica': 'multiorgánica',
    'Tardia': 'Tardía',
    'interpretacion': 'interpretación',
    'personalizacion': 'personalización',
    'sanguineas': 'sanguíneas',
    'dano': 'daño',
    'saturacion': 'saturación',
    'intervencion': 'intervención',
    'Preparacion': 'Preparación',
    'hipoperfusion': 'hipoperfusión',
    'recuperacion': 'recuperación',
    'Clinico': 'Clínico',
    'clinico': 'clínico',
    'clinica': 'clínica',
    'clinicas': 'clínicas',
    'Clinicas': 'Clínicas',
    'diagnosticos': 'diagnósticos',
    'Metodologico': 'Metodológico',
    'METODOLOGICO': 'METODOLÓGICO',
    'mineria': 'minería',
    'cientifico': 'científico',
    'Fundacion': 'Fundación',
    'Composicion': 'Composición',
    'numericas': 'numéricas',
    'prequirurgica': 'prequirúrgica',
    'fisica': 'física',
    'Division': 'División',
    'Validacion': 'Validación',
    'Hipertension': 'Hipertensión',
    'cancer ': 'cáncer ',
    'exploracion': 'exploración',
    'transformacion': 'transformación',
    'preparacion': 'preparación',
    'diagnosticas': 'diagnósticas',
    'medico': 'médico',
    'medica': 'médica',
    'quirurgico': 'quirúrgico',
    'quirurgica': 'quirúrgica',
    'analisis': 'análisis',
    'especifico': 'específico',
    'diagnostico': 'diagnóstico',
    'basica': 'básica',
    'metricas': 'métricas',
    'estadistica': 'estadística',
    'estadistico': 'estadístico',
    'parametros': 'parámetros',
    'grafica': 'gráfica',
    'grafico': 'gráfico',
    'farmacologica': 'farmacológica',
    'farmacologico': 'farmacológico',
    'optimizacion': 'optimización',
    'validacion': 'validación',
    'precision': 'precisión',
    'tecnica': 'técnica',
    'tecnicas': 'técnicas',
    'especifica': 'específica',
    'especificas': 'específicas',
    'caracteristicas': 'características',
    'logica': 'lógica',
    'logico': 'lógico',
    'practica': 'práctica',
    'practico': 'práctico',
    'codigo': 'código',
    'comun': 'común',
    'numero': 'número',
    'numeros': 'números',
    'unica': 'única',
    'unico': 'único',
    'critica': 'crítica',
    'critico': 'crítico',
}

def fix_file(filepath):
    """Fix encoding issues in a single file"""
    try:
        # Try reading with UTF-8
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()

        # Apply replacements
        modified = False
        for wrong, correct in replacements.items():
            if wrong in content:
                content = content.replace(wrong, correct)
                modified = True
                print(f"  - Fixed: {wrong} → {correct}")

        # Write back if modified
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_path = r'C:\Users\manuel.marin\Downloads\FVL\slides\experiments'

    # Find all HTML files
    html_files = glob.glob(os.path.join(base_path, '*.html'))

    print(f"Found {len(html_files)} HTML files to process\n")

    fixed_count = 0
    for html_file in sorted(html_files):
        filename = os.path.basename(html_file)
        print(f"Processing: {filename}")
        if fix_file(html_file):
            fixed_count += 1
            print(f"  ✓ Fixed\n")
        else:
            print(f"  - No changes needed\n")

    print(f"\nSummary: Fixed {fixed_count} out of {len(html_files)} files")

if __name__ == '__main__':
    main()
