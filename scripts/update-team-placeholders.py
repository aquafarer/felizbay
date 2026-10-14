"""Update placeholders for all language brand-team.yaml files."""
import os
import re

PAGES_DIR = r'C:\official\src\data\pages'
LANGS = ['ar','da','de','el','es','fi','fr','it','nl','no','pl','pt','ru','sv']

# Read the English leadership block
en_fp = os.path.join(PAGES_DIR, 'brand-team.yaml')
with open(en_fp, 'r', encoding='utf-8') as f:
    en_content = f.read()

leadership_match = re.search(
    r'leadership:\n(?:  .+\n)+  items:\n(?:    - .+\n(?:      .+\n)*)+(?=philosophy:)',
    en_content
)
if not leadership_match:
    print("ERROR: Could not find leadership block in English YAML")
    exit(1)

en_leadership = leadership_match.group(0)

for lang in LANGS:
    fp = os.path.join(PAGES_DIR, lang, 'brand-team.yaml')
    if not os.path.exists(fp):
        print(f'MISSING: {lang}/brand-team.yaml')
        continue

    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    old_match = re.search(
        r'leadership:\n(?:  .+\n)+  items:\n(?:    - .+\n(?:      .+\n)*)+(?=philosophy:)',
        content
    )
    if old_match:
        content = content[:old_match.start()] + en_leadership + content[old_match.end():]
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'OK: {lang}/brand-team.yaml')
    else:
        print(f'SKIP (no match): {lang}/brand-team.yaml')
