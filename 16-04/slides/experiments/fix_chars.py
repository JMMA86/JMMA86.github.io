import os
import glob

# Define replacements with proper encoding
replacements = [
    (b'\xc3\x83\xc2\x81', b'\xc3\x81'),  # Ã -> Á
    (b'\xc3\x83\xc2\xb3', b'\xc3\xb3'),  # Ã³ -> ó
    (b'\xc3\x83\xc2\xa1', b'\xc3\xa1'),  # Ã¡ -> á
    (b'\xc3\x83\xc2\xad', b'\xc3\xad'),  # Ã­ -> í
    (b'\xc3\x83\xc2\xa9', b'\xc3\xa9'),  # Ã© -> é
    (b'\xc3\x83\xc2\xba', b'\xc3\xba'),  # Ãº -> ú
    (b'\xc3\x83\xc2\x93', b'\xc3\x93'),  # Ó -> Ó
    (b'\xc3\x83\xe2\x80\x9c', b'\xc3\x93'),  # Ó variant -> Ó
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9c', b'\xe2\x80\x94'),  # â€" -> —
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'\xe2\x80\x94'),  # â€" variant -> —
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x99', b'\xe2\x86\x92'),  # â†' -> →
    (b'\xc3\xa2\xe2\x82\xac\x9c', b'\xe2\x80\x94'),  # â€" variant 2 -> —
    (b'\xc3\xa2\xe2\x80\xa0\xc2\x90', b'\xe2\x86\x90'),  # â† -> ←
    (b'\xc3\xa2\xe2\x80\xa0\xe2\x80\x99', b'\xe2\x86\x92'),  # â†' variant -> →
]

def fix_file_bytes(filepath):
    """Fix encoding using byte replacement"""
    try:
        with open(filepath, 'rb') as f:
            content = f.read()

        modified = False
        for wrong, correct in replacements:
            if wrong in content:
                content = content.replace(wrong, correct)
                modified = True

        if modified:
            with open(filepath, 'wb') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    base_path = 'C:/Users/manuel.marin/Downloads/FVL/slides/experiments'
    os.chdir(base_path)

    html_files = glob.glob('*.html')

    print(f"Processing {len(html_files)} HTML files\n")

    fixed_count = 0
    for html_file in sorted(html_files):
        print(f"Processing: {html_file}")
        if fix_file_bytes(html_file):
            fixed_count += 1
            print(f"  Fixed\n")
        else:
            print(f"  No changes\n")

    print(f"\nFixed {fixed_count} files")

if __name__ == '__main__':
    main()
