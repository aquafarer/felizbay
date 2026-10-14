with open('C:/aweb/src/pages/index.astro', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'Social' in line and ('\u00d7' in line or '\u8133' in line or 'SEO' in line):
            idx = line.find('Social')
            segment = line[idx:idx+40]
            print('Line', i)
            print('  hex:', segment.encode('utf-8').hex())
            print('  repr:', repr(segment))
            for j, ch in enumerate(segment):
                if ord(ch) > 127:
                    print(f'  char {j}: U+{ord(ch):04X}')
