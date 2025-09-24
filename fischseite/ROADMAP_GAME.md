## Roadmap Game – Realistische Fischanimationen (Vanilla JS + ANIMATION.md)

Ziel: Das scroll-gesteuerte Minispiel „Tiefseetaucher“ erhält glaubwürdige, flüssige Fischbewegungen, inspiriert von den Techniken aus `ANIMATION.md` (Keyframe-Interpolation, Skelettpunkte, `atan2`-Orientierung, Zustands-Blending, geschwindigkeitsgekoppeltes Timing).

### Leitprinzipien aus ANIMATION.md (übertragen auf Fische)
- **Keyframes + Inbetweening**: Wenige Pose-Frames (z. B. Tail-Left, Neutral, Tail-Right) werden kontinuierlich interpoliert → glatte Flossen-/Schwanzbewegung.
- **Skelett mit Farbpunkten**: Virtuelle Gelenke (Kopf, Schwanzwurzel, Schwanzspitzen-Segmente, Rücken-/Bauchflosse). Segmente (Sprites) werden zwischen Punkten „aufgehängt“.
- **`atan2`-Ausrichtung**: Jedes Segment wird entlang seines Gelenkvektors rotiert; wirkt organisch bei Schwanzschlag.
- **Geschwindigkeits-Kopplung**: Animationsphase steigt mit horizontaler Spielgeschwindigkeit (`run_animation_time`-Analogon) → schnelleres Wedeln bei höherer Scrollgeschwindigkeit.
- **Zustands-Blending**: Weiche Übergänge zwischen Zuständen (idle glide, swim, boost/dodge). Gewichtete Überblendung statt harte Umschaltung.
- **Sanfte Richtungswechsel**: Zielrichtung wird geglättet und ggf. gespiegelt, statt abruptem Flip.

### Technischer Aufbau
- **Data-Layer**
  - `fish_animation_data.ts/json`: Gelenkpunkte für Basisposen (2–4 Keyframes). Struktur ähnlich `animation-data.js`.
  - Segment-Assets: `images/fish_segments/{head,body,tail_1,tail_2,dorsal,ventral}.png` (optional vereinfachte Vektor-Draws im Canvas für MVP).
- **Runtime**
  - `Animator`-Modul (leichtgewichtig):
    - `lerpFrames(a,b,t)`: Interpoliert Gelenkpunkte
    - `flipFrame(frame)`: Spiegelung für Richtungswechsel
    - `applyInertia(current,target,alpha)`: Gewichts-/Richtungs-Trägheit (Teiler analog `/5` bzw. `/6`)
  - `FishRenderer`:
    - Platziert Segmente mittels `ctx.translate/rotate(atan2(...))`, zeichnet Images/Shapes
  - **Timing**: `animationTime += gameSpeed * k` (k skaliert, z. B. 1/60), `phase = animationTime % 1`

### Integrationspfad in das Minispiel
1. **MVP (Woche 1)**
   - Canvas-Spiel mit Master-rAF, `IntersectionObserver`, Maussteuerung, einfachem Fisch (ein Shape), Hindernisse, Scroll-Speed.
   - Roadmap-Assets & Datenstrukturen definieren (ohne Nutzung im Renderpfad).
2. **Skelett-Animation (Woche 2)**
   - Implementiere `Animator` (lerp, flip, inertial weights) und `FishRenderer` (Segmente über Gelenkpunkte, `atan2`).
   - Erstelle 3–4 Keyframes je Fischpose; Interpolation in `draw()` einbauen.
3. **Geschwindigkeit koppeln (Woche 2)**
   - Kopple `animationTime` an `gameSpeed` (Scroll). Tuning über Teiler (Cheatsheet: kleiner → schneller, größer → langsamer).
4. **Zustände & Blending (Woche 3)**
   - Zustände: `idle`, `swim`, `evade` (kurzer Boost bei Hindernisnähe).
   - Gewichtete Mischung mehrerer Posen; Trägheit (analog `/5`) für weiche Übergänge.
5. **Richtungs-Glättung (Woche 3)**
   - Glätte Zielrichtung zu tatsächlicher `facing` (analog `/6`). Interp. zum Flip-Frame, kein harter Spiegel.
6. **Assets & Polishing (Woche 4)**
   - Austausch der Shapes gegen Segment-Sprites; feine Hitboxen je Segment.
   - Partikel (Blasen) bei Sammelobjekten/Kollision; Parallax-Hintergrund.

### Tuning-Cheatsheet (angepasst)
- **Wedeltempo**: `animationTime += gameSpeed / 60` → Teiler ändern
- **Übergänge**: Gewichts-Trägheit-Divisor erhöhen → träger; verringern → knackiger
- **Richtungswechsel**: Richtungs-Glättung-Divisor verringern → reaktiver; erhöhen → smoother

### Testing & Performance
- Nur eine rAF-Schleife global; pausierte Instanzen überspringen.
- HiDPI-Handling: `canvas.width/height = cssSize * devicePixelRatio`.
- Profiling in Chrome Performance; Mobile-Sanity (iOS Safari, Android Chrome).

### Milestones & Deliverables
- M1: MVP spielbar, Scroll-Speed ok, 60fps in Dividern
- M2: Skelett-Interpolation sichtbar, `atan2`-orientierte Segmente
- M3: Zustands-Blending + Speed-Kopplung fertig
- M4: Assets final, Effekte, Balancing, Cross-Browser geprüft


