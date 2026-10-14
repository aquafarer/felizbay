import re
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()
cats = re.findall(r"category: '(\w+)'", content)
from collections import Counter
print('Category counts:', Counter(cats))
print('Total:', len(cats))
