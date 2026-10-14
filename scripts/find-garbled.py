import glob, os, re

# Scan for U+FFFD (replacement char) in English source files
bad = []
for ext in ['.astro', '.mdx']:
    for f in glob.glob(f'src/pages/**/*{ext}', recursive=True):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
            for i, line in enumerate(fh, 1):
                if '\ufffd' in line:
                    bad.append((f, i, line.strip()[:120].replace('\ufffd', '?')))
                    break

print("Files with U+FFFD (replacement character):")
for f, i, line in bad:
    print(f'  {f}:{i} - {line}')

# Also scan for CJK characters in English page files (not in [lang]/ directories)
cjk = []
for ext in ['.astro', '.mdx']:
    for f in glob.glob(f'src/pages/*{ext}', recursive=True):
        # Skip lang directories and data files
        if '[lang]' in f:
            continue
        with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
            for i, line in enumerate(fh, 1):
                for ch in line:
                    cp = ord(ch)
                    if 0x4E00 <= cp <= 0x9FFF or 0x3000 <= cp <= 0x303F:
                        cjk.append((f, i, line.strip()[:120]))
                        break

print(f"\nFiles with CJK characters (non-localized pages):")
for f, i, line in cjk:
    print(f'  {f}:{i} - {line}')
