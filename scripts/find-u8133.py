with open('src/content/products/oars-pump-set.mdx', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        for j, ch in enumerate(line):
            if ord(ch) == 0x8133:
                seg = line[max(0,j-2):j+5]
                print(f'Line {i} col {j}: hex={seg.encode("utf-8").hex()} context={repr(seg)}')
                break

with open('src/pages/journal/index.astro', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        for j, ch in enumerate(line):
            if ord(ch) == 0x8133:
                seg = line[max(0,j-2):j+5]
                print(f'Line {i} col {j}: hex={seg.encode("utf-8").hex()} context={repr(seg)}')
                break
