"""Build the offline, dependency-free release from readable source files."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
src = root / 'src'
html = (src / 'index.html').read_text()
for marker, file in [('STYLE','style.css'),('DATA','data.js'),('GAME','game.js')]:
    html = html.replace('/* '+marker+' */', (src / file).read_text())
(root / 'UNDERGRID_ADVENTURE.html').write_text(html)
print('Built UNDERGRID_ADVENTURE.html')
