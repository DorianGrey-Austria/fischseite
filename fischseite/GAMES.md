## Games – Tiefseetaucher Minispiel (Scroll-gesteuert)

- **Ziel**: Leichtes, thematisch passendes Minispiel („Endless Swimmer“) im schmalen Trennbereich, das die Seite aufwertet ohne Performanceeinbußen.
- **Kernidee**: Ein kleiner Fisch schwimmt von links nach rechts; der Nutzer steuert nur die vertikale Position. Hindernisse (Algen, Felsen, Raubfische), optional Sammelobjekte (Plankton/Bubbles).
- **Steuerung**: Maus-Y innerhalb des Canvas (alternativ Pfeiltasten ↑/↓). Fokus auf mühelose, „ambient“ Interaktion.
- **Scroll-abhängige Geschwindigkeit**: Spielgeschwindigkeit koppelt an die vertikale Scroll-Position.
  - Basis: `window.scrollY / (scrollHeight - innerHeight)` → in `gameSpeed` gemappt
  - Optional instanzspezifisch: relative Position des jeweiligen Trenners berücksichtigen
- **Architektur**: Vanilla JS + Canvas, keine Engine.
  - Eine globale Master-Schleife (`requestAnimationFrame`) verwaltet alle Instanzen
  - `IntersectionObserver` pausiert unsichtbare Instanzen (Viewport Culling)
  - Jede Instanz kapselt eigenen Zustand (`FishGame` Klasse)
- **Rendering**: Transparente Canvas-Ebene über bestehenden „Underwater Divider“-Styles; visuelle Kohärenz mit Seitenfarbpalette.
- **Hindernisse**: Einfache prozedurale Generierung, Kollision via bounding boxes (später verfeinerbar).
- **Leistung**: Nur eine rAF-Schleife; pausierte Instanzen werden übersprungen; HiDPI-Canvas-Resize; sparsame Zeichenoperationen.
- **Integration**: Canvas pro `.underwater-divider`, Auto-Init nach DOM-Load; keine Layoutänderungen nötig.
- **Erweiterbar**: Highscores über `localStorage`, zusätzliche Gegnermuster (Sinusdrift), Partikel-/Blaseneffekte.

### Minimaler Ablauf
1) DOM lädt → alle `.underwater-divider` finden → Canvas einfügen → `new FishGame(container)` registrieren
2) Globale Schleife berechnet `gameSpeed` aus Scroll-Position → `update()` → `draw()` für sichtbare Instanzen
3) Mausbewegung setzt Ziel-`y` des Fischs; Hindernisse scrollen von rechts nach links; Kollisionen prüfen

### Bezug zur Seite
- Farbpalette, Blasen/Plankton-Optik und ruhige Bewegung greifen das bestehende Unterwasser-Design auf.
- Höhe der Divider (ca. 80px) bestimmt Fischhöhe, Hitboxen und Hindernisdesign.


