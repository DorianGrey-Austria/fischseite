## SLUGG Animation – warum der Lauf „schnell“ wirkt

Diese Notiz fasst die Techniken zusammen, die dem Charakterlauf Tempo und Glaubwürdigkeit geben, mit Verweisen auf die relevanten Stellen im Code.

### 1) Keyframes + Inbetweening (Interpolation)
- **Idee**: Wenige Run-Keyframes (6 Stück) werden kontinuierlich ineinander überblendet.
- **Wirkung**: Flüssige Bewegung ohne Ruckeln, obwohl es nur wenige Basisframes gibt.

Code (Ausschnitte):
```coffeescript
# src/Animator.coffee
lerp_animation_frames: (frames, position, srcID)->
  frame_a = frames[(~~(position) + 0) %% frames.length]
  frame_b = frames[(~~(position) + 1) %% frames.length]
  frame_b_ness = position %% 1
  @lerp_frames(frame_a, frame_b, frame_b_ness, srcID)

lerp_frames: (frame_a, frame_b, b_ness, srcID)->
  dots = {}
  for color, dot of frame_a.dots
    x = lerp(dot.x, frame_b.dots[color].x, b_ness)
    y = lerp(dot.y, frame_b.dots[color].y, b_ness)
    dots[color] = {x, y, color}
  {dots, width: frame_a.width, height: frame_a.height, srcID}
```

### 2) Skelett mit Farbpunkten + Segmentbildern
- **Idee**: Keyframes bestehen aus farbcodierten Punkten (Gelenke). Jedes Segmentbild (Oberarm, Unterschenkel, Fuß, …) wird zwischen zwei Punkten „aufgehängt“.
- **Wirkung**: Natürliche Schrittweite und Arm-/Beinschwung, ohne komplexe Rigging-Engine.

Code (Ausschnitt):
```coffeescript
# src/Character.coffee
segments = [
  {name: "front-upper-leg", a: "rgb(226, 0, 19)", b: "rgb(253, 107, 29)"}
  {name: "front-lower-leg", a: "rgb(253, 107, 29)", b: "rgb(224, 239, 105)"}
  # ... weitere Segmente
]
```

Die Punktdaten liegen in `animation-data.js` (z. B. `run/1` … `run/6`).

### 3) Echte Ausrichtung per atan2
- **Idee**: Jedes Segment wird am Platzierungspunkt positioniert und zur Ziel-Verbindung gedreht (`atan2`), dann gezeichnet.
- **Wirkung**: Realistische Winkeländerungen der Gliedmaßen bei jedem Schritt.

Code (Ausschnitt):
```coffeescript
# src/Animator.coffee
placement = calc_frame.dots[segment.a]
towards   = calc_frame.dots[segment.b]
ctx.translate(placement.x - calc_frame.width/2, placement.y - calc_frame.height)
ctx.rotate(atan2(towards.y - placement.y, towards.x - placement.x) - TAU/4)
ctx.drawImage(segment.image, -segment.image.width/2, 0)
```

### 4) Geschwindigkeits-gekoppeltes Timing
- **Idee**: Die Lauf-Animationszeit wird mit der Horizontalgeschwindigkeit skaliert.
- **Wirkung**: Je schneller die Figur läuft (größeres |vx|), desto schneller „laufen“ die Beine.

Code (Ausschnitt):
```coffeescript
# src/Character.coffee
run_frame = @animator.lerp_animation_frames(run_frames, @run_animation_time, "run")
@run_animation_time += abs(@vx) / 60  # Kopplung an Geschwindigkeit
```

Tuning: Kleinere Teilung (z. B. `/ 50`) → schnellerer Laufzyklus; größere Teilung → langsamer.

### 5) Zustands-Blending (Stand/Lauf/Sprung/Slide)
- **Idee**: Ziel-Frames (z. B. `stand`, `run`, `jump`, `slide`) werden gewichtet und mit Trägheit überblendet.
- **Wirkung**: Sehr weiche Übergänge zwischen Bewegungszuständen, was subjektiv „Schnelligkeit ohne Stottern“ vermittelt.

Code (Ausschnitte):
```coffeescript
# src/Animator.coffee – Gewichtsträgheit
@weights[frame.srcID] += (@weights_to[frame.srcID] - @weights[frame.srcID]) / 5

# src/Character.coffee – Ziel-Frame wählen
@animator.weight weighty_frame, 1
root_frames = [stand_frame, stand_wide_frame, crouch_frame, slide_frame, wall_slide_frame, air_frame, run_frame]
@animator.draw ctx, draw_height, root_frames, @face, @facing
```

Tuning: Den Teiler `/ 5` größer machen → trägere Übergänge; kleiner → schnellere Übergänge.

### 6) Sanfte Richtungswechsel statt harten Flips
- **Idee**: Ziel-Richtung (`@face`) wird geglättet zu `@facing`; zusätzlich wird der berechnete Frame auf die geflippte Version hin interpoliert.
- **Wirkung**: Kein abruptes Spiegeln bei schnellen Richtungswechseln.

Code (Ausschnitte):
```coffeescript
# src/Character.coffee
@face = +1 if @controller.x > 0
@face = -1 if @controller.x < 0
@facing += (@face - @facing) / 6  # Glättung

# src/Animator.coffee
calc_frame = @lerp_frames(calc_frame, @flip_frame(calc_frame), (1 - facing) / 2)
```

Tuning: Den Teiler `/ 6` kleiner machen → schnellere Richtungsanpassung; größer → weicher, träger.

---

### Schnell-Tuning (Cheatsheet)
- **Bein-Zyklus schneller/langsamer**: `@run_animation_time += abs(@vx) / 60` → Teiler anpassen.
- **Übergänge weicher/knackiger**: In `Animator.coffee` den Trägheits-Teiler `/ 5` anpassen.
- **Richtungswechsel weicher/knackiger**: In `Character.coffee` den Richtungs-Glättungs-Teiler `/ 6` anpassen.

### Dateien
- `src/Animator.coffee` – Interpolation, Ausrichtung, Blending
- `src/Character.coffee` – Zustandslogik, Timing-Kopplung, Richtungs-Glättung
- `animation-data.js` – Keyframe-Punktdaten (Run/Stand/Jump/etc.)
- `images/segments/*.png` – Segmentbilder (Kopf, Torso, Arme, Beine, Füße)


