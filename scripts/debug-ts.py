with open('C:/aweb/src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("id: 'rib-250'")
snippet = content[idx:idx+400]
# Print visible chars with indentation markers
for i, ch in enumerate(snippet):
    if ch == '\n':
        print(f'\\n[{i}]', end='')
    elif ch == ' ':
        print('·', end='')
    elif ch == ',':
        print(',', end='')
    elif ch == '}':
        print('}', end='')
    elif ch == '{':
        print('{', end='')
    elif ch == "'":
        print("'", end='')
    elif ch == ':':
        print(':', end='')
    else:
        print(ch, end='')
print()

# Also check what's around ai_comparison
ac_idx = content.find("ai_comparison:", idx)
print(f"\nai_comparison found at index {ac_idx}")
print("Context:", repr(content[ac_idx-50:ac_idx+50]))
