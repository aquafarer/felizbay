import glob, os, re

bad = []
for ext in ['.astro', '.ts', '.tsx', '.js', '.mjs']:
    for f in glob.glob(f'src/**/*{ext}', recursive=True):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
            content = fh.read()
        if '~/assets/' not in content:
            continue
        matches = re.findall(r"'~/assets/([^']+\.webp)'", content)
        for m in matches:
            fp = 'src/assets/' + m
            if not os.path.exists(fp):
                # Try .png, .ico, .svg
                base = os.path.splitext(fp)[0]
                found = any(os.path.exists(base + ext) for ext in ['.png', '.ico', '.svg', '.jpg', '.jpeg'])
                if not found:
                    bad.append((f, m))

for f, m in bad:
    print(f'{f}: ~/assets/{m} missing')
if not bad:
    print('OK: no incorrect .webp imports found')
