import os

checks = {
    'rib-250': ['Air chambers', '3 persons', '4.4HP/3.25KW'],
    'rib-270': ['Air chambers', 'Warranty'],
    'rib-300': ['Air chambers', 'Warranty', 'Standard Accessories', 'oars'],
    'rib-330a': ['Air chambers', 'Warranty', 'Standard Accessories'],
    'rib-360a': ['Air chambers', 'Warranty', 'Standard Accessories', 'Optional Accessories'],
    'rib-390a': ['Air chambers', 'Warranty', '2 oars', 'foot pump', 'repair kit'],
    'rib-390al': ['Air chambers: 4', 'Warranty'],
    'rib-430a': ['Air chambers', 'Warranty', 'Standard Accessories', 'Optional Accessories'],
    'rib-480a': ['Air chambers: 5', 'Warranty', 'Standard Accessories'],
    'rib-520e': ['Air chambers: 5', 'Warranty', 'front and back cabin', 'bilge pump'],
    'rib-550a': ['Air chambers: 5', 'Warranty', 'Standard Accessories'],
    'rib-580a': ['Air chambers: 5', 'Warranty', 'Standard Features', 'Optional Features'],
    'rib-600': ['Air chambers: 6', 'Warranty', 'Standard Accessories'],
    'rib-680a': ['Air chambers: 7', 'Warranty', 'Standard Accessories'],
    'rib-700': ['Air chambers: 7', 'Warranty', 'Standard Accessories'],
    'rib-760': ['Air chambers: 7', 'Warranty', 'front and back cabin', '300L bulit in fuel tank'],
}

missing_any = False
for fname in sorted(os.listdir('C:/aweb/src/content/products')):
    if not fname.startswith('rib-') or not fname.endswith('.mdx'):
        continue
    slug = fname.replace('.mdx', '')
    path = f'C:/aweb/src/content/products/{fname}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check essential fields exist
    checks_list = ['Air chambers', 'specs:', 'Overall length', 'Max engine']
    for c in checks_list:
        if c not in content:
            print(f'MISSING ESSENTIAL: {slug} - {c}')
            missing_any = True

    # Check gallery
    gallery_count = content.count('url: /images/')
    if gallery_count < 1:
        print(f'MISSING GALLERY: {slug}')
        missing_any = True

    # Model-specific checks
    if slug in checks:
        for item in checks[slug]:
            if item not in content:
                print(f'MISSING: {slug} - "{item}"')
                missing_any = True

    # Check for {model_id} template string (leftover bug)
    if '{model_id}' in content:
        print(f'BUG: {slug} - contains unexpanded {{model_id}}')
        missing_any = True

    print(f'OK {slug}: {gallery_count} gallery images, {content.count("label:")} specs')

if not missing_any:
    print('\nAll 37 RIB MDX files verified successfully!')
else:
    print(f'\nSome issues found!')
