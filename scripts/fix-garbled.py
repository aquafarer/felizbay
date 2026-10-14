import glob

replacements = {}

# Replace U+FFFD -> em dash (—) in all English page files
for f in glob.glob('src/pages/**/*.astro', recursive=True):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
        content = fh.read()
    
    changed = False
    
    # Fix U+FFFD -> em dash
    if '\ufffd' in content:
        content = content.replace('\ufffd', '—')
        changed = True
    
    # Fix Chinese text in English pages
    if 'ϵ��' in content:
        content = content.replace('ϵ��', '系列')
        changed = True
    
    if changed:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'Fixed: {f}')

# Fix factory page specifically - remove Chinese (压胶机) 
with open('src/pages/factory/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

if '压胶机' in content:
    content = content.replace('压胶机', 'laminate sealing')
    with open('src/pages/factory/index.astro', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed: src/pages/factory/index.astro (压胶机 -> laminate sealing)')
