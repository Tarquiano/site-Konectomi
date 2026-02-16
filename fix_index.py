import sys

file_path = '/home/tarqui/morango/site-Konectomi/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Verify we are on the right lines
# Line 247 (index 246) should be <div class="team-text">
# Line 248 (index 247) should be <h3 class="animated-title">Experiências reais, conduzidas por pessoas.</h3>

# We'll use more robust matching for safety
start_index = -1
end_index = -1

for i, line in enumerate(lines):
    if '<div class="team-text">' in line and i > 200:
        start_index = i
    if '</div>' in line and start_index != -1 and i > start_index and i < start_index + 20: 
        end_index = i
        break

if start_index != -1 and end_index != -1:
    new_lines = lines[:start_index]
    replacement = [
        '                    <div class="team-text">\n',
        '                        <h3 class="animated-title">Experiências reais, conduzidas por pessoas.</h3>\n',
        '                        <p>Nossas experiências se inspiram no <span class="highlight-word">estilo americano</span> de <span class="highlight-word">operações manuais</span>, onde <span class="highlight-word">pessoas reais</span> controlam tudo. <span id="more-text-team" class="hidden-text">Fugimos do automático e deixamos equipe e jogadores gerenciarem serviços como voos e cafés ao vivo. Isso cria um realismo único, já que tudo depende da interação e <span class="highlight-word">colaboração verdadeira</span> entre a galera.</span></p>\n',
        '                        <button id="read-more-btn-team" class="read-more-btn">Ler mais</button>\n',
        '                    </div>\n'
    ]
    new_lines.extend(replacement)
    new_lines.extend(lines[end_index + 1:])
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Successfully fixed index.html from line {start_index+1} to {end_index+1}")
else:
    print(f"Error: Could not find team-text section (start: {start_index}, end: {end_index})")
