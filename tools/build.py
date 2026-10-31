"""Build the offline, dependency-free release from readable source files."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
src = root / 'src'
html = (src / 'index.html').read_text()
for marker, file in [('STYLE','style.css'),('DATA','data.js'),('EXPANSION','expansion-data.js'),('LIVING_DATA','living-data.js'),('ADVENTURE_DATA','adventure-data.js'),('GREATER_DATA','greater-data.js'),('WARD_DATA','ward-data.js'),('LIFE_DATA','life-data.js'),('OPEN_DATA','open-data.js'),('INDUSTRY_DATA','industry-data.js'),('GAME','game.js')]:
    content = (src / file).read_text()
    if marker == 'GAME': content = content.replace('/* CAMPAIGN */', (src / 'campaign.js').read_text()).replace('/* PRESENTATION */', (src / 'presentation.js').read_text()).replace('/* LIVING */', (src / 'living.js').read_text()).replace('/* ADVENTURE */', (src / 'adventure.js').read_text()).replace('/* GREATER */', (src / 'greater.js').read_text()).replace('/* WARD */', (src / 'ward.js').read_text()).replace('/* LIFE */', (src / 'life.js').read_text()).replace('/* ATLAS */', (src / 'atlas.js').read_text()).replace('/* TACTICS */', (src / 'tactics.js').read_text()).replace('/* GEOMETRY */', (src / 'geometry.js').read_text()).replace('/* OPEN */', (src / 'open.js').read_text()).replace('/* INDUSTRY */', (src / 'industry.js').read_text())
    html = html.replace('/* '+marker+' */', content)
(root / 'UNDERGRID_ADVENTURE.html').write_text(html)
print('Built UNDERGRID_ADVENTURE.html')
