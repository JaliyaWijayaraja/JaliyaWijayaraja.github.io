import re

path = r"c:\Users\jaliy\CV\Github Pages\JaliyaWijayaraja.github.io\_pages\research.md"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add classes to images
content = content.replace('<img src=', '<img class="responsive-media" src=')

# Wrap video in video-container
content = re.sub(r'(>[\s\n]*<video.*?</video>)', r'<div class="video-container">\1</div>', content, flags=re.DOTALL)

# Add IDs to headers
def add_id(m):
    header = m.group(1).replace('{', '').replace('}', '').strip()
    id_val = re.sub(r'[^a-zA-Z0-9]+', '-', header).lower().strip('-')
    return f"### {header} {{#{id_val}}}"

content = re.sub(r'### ([^{}\n]+)(?:\s*{#[^}]+})?', add_id, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
