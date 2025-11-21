# 🎮 Fischseite Games - Feature Overview

> Quick reference guide for all game features

---

## 🐠 Collector Game Features

### Core Gameplay
- ⏱️ **30 seconds** to collect as many items as possible
- 🎯 **Target:** 15-36 items (difficulty-based)
- 💰 **Points:** 5-15 per good item, -5 for bad items
- 🎓 **Educational:** Aquarium tips every 3 seconds

### New Features (v5.3)

#### 🔥 Combo System
- **Window:** 1.5 seconds between catches
- **Multipliers:** 1x → 1.5x → 2x → 2.5x → 3x → ... → 5x (max)
- **Visual:** Growing combo counter with emoji
- **End Stats:** Shows max combo achieved

**How to trigger:**
1. Collect any good item
2. Collect another within 1.5 seconds
3. Keep chain going for higher multipliers
4. Bad items break the combo!

#### ⚡ Frenzy Mode
- **Trigger:** 10% chance per second (after 5s)
- **Duration:** 5 seconds
- **Effect:** 2x ALL points (stacks with combos!)
- **Visual:** Big "🔥 FRENZY MODE! 🔥" notification
- **Indicator:** Persistent display while active

**Maximum multiplier:** 5x (combo) × 2x (frenzy) × 2x (power-up) = **20x!**

#### 🌊 Water Physics
- **Currents:** Horizontal drift (changes every 2s)
- **Gravity:** Realistic 0.15 downward force
- **Buoyancy:** Good items float, bad items sink
- **Drag:** 2% resistance per frame
- **Bounce:** 50% energy loss on walls

**Item Properties:**
- Good items: Density 0.8-1.2, positive buoyancy
- Bad items: Density 1.2, negative buoyancy
- All items: Mass affects movement

#### 🚀 Progressive Difficulty
- **Score 0-250:** Normal speed
- **Score 250-500:** 1.5x speed
- **Score 500+:** 2x speed (maximum)

Keeps endgame challenging!

#### 🎁 Power-Ups (15% spawn rate)
1. **⚡ Speed Boost** (5s)
   - Items fall 1.5x faster
   - +20 points on collection

2. **🧲 Magnet** (8s)
   - Auto-collect items within 200px radius
   - +15 points on collection

3. **🌟 Double Points** (10s)
   - All points doubled
   - Stacks with combos and frenzy!

4. **⏰ Time Freeze** (3s)
   - Timer stops
   - Keep playing!

#### 💫 Visual Effects
- **Floating Points:** Show total gained with multipliers
- **Particle Explosions:** More particles with higher combos
- **Color Coding:** Green → Gold at 3+ combo
- **Animations:** Smooth 60 FPS rendering

---

## 🏁 Racing Game Features

### Core Gameplay
- ⏱️ **30 seconds** race duration
- 🐠 **8 fish** competing simultaneously
- 💰 **Betting:** 10-50 points on your favorite
- 🏆 **Odds:** 3:1 payout if you win

### New Features (v5.3)

#### 🚀 Turbo Meter System
- **Starting Energy:** 100%
- **Recharge Rate:** 3% per second
- **Boost Cost:** 20% per click
- **Max Boosts:** 5 before depletion
- **Full Recharge:** ~33 seconds

**Visual Indicator:**
- Green bar (>50%): Safe to boost
- Orange bar (20-50%): Use sparingly
- Red bar (<20%): Almost empty!

**Strategy:**
- Don't spam boost early
- Save energy for final sprint
- Collect turbo refill power-ups

#### 🎁 Track Power-Ups
**Spawn:** 5% chance per 100ms (max 3 on track)

1. **⚡ Speed Boost**
   - Effect: +1 permanent base speed
   - Best for: Long-term advantage

2. **🌟 Mega Boost**
   - Effect: +5 instant boost
   - Best for: Quick overtakes

3. **🔋 Turbo Refill**
   - Effect: +40% energy (player only)
   - Best for: Extended boosting

4. **🎯 Teleport**
   - Effect: +50px position
   - Best for: Last-minute wins

**Collection:**
- Automatic when fish passes
- All fish can collect (not just player!)
- Notification for player's fish

#### 🏊 Stamina System
**Every fish has unique endurance:**
- Stamina Drain: 0.3-0.7 per boost
- Stamina Recharge: 0.2-0.4 per frame
- Exhaustion Threshold: <10 stamina

**Effects of Exhaustion:**
- Speed: 50% reduction
- Appearance: Faded + grayscale
- Recovery: Recharges when >50 stamina

**Boost Impact:**
- Normal swimming: Recharges stamina
- Boosting: Drains 2x stamina
- Strategy: Pace your boosts!

**Visual Feedback:**
```
Normal:   🐠 (100% opacity, full color)
Tired:    🐠 (80% opacity, slight fade)
Exhausted: 🐠 (60% opacity, grayscale)
```

#### 🎯 Strategic Gameplay
**Before:** Click boost once → Watch race → Hope you win
**After:** Manage energy → Collect power-ups → Pace stamina → Win!

**Winning Strategies:**
1. **Energy Conservation**
   - Don't boost before countdown ends
   - Save 40% for final stretch
   - Collect turbo refills

2. **Power-Up Priority**
   - Speed boosts early (permanent!)
   - Turbo refills mid-race
   - Teleports for close finishes

3. **Stamina Management**
   - Let fish recharge naturally
   - Boost in short bursts
   - Watch opponent exhaustion

4. **Dramatic Finishes**
   - Leading fish exhausted? Perfect!
   - Save energy for final boost
   - Comeback victories possible

---

## 🧠 Memory Game Features

### Core Gameplay
- 🎯 **Match pairs** of Austrian fish
- ⏱️ **Time limits:** 90s / 120s / 150s (by difficulty)
- 🌟 **Scoring:** Speed + accuracy bonuses

### Existing Features (Already Optimized)

#### 🔥 Combo System
- Consecutive matches = Bonus points
- Visual "🔥 3x COMBO!" notifications
- Max combo tracked

#### ⏱️ Time Pressure
- Countdown timer
- Speed bonus for fast completion
- Color-coded urgency

#### 💡 Hints
- Inactivity detection (5s)
- Subtle hints for stuck players

#### 📊 Performance Tracking
- Moves counter
- Accuracy percentage
- Personal best tracking

**Status:** No changes made - already excellent!

---

## 🏗️ Builder Game Features

### Core Gameplay
- 🎨 **Drag-and-drop** aquarium design
- 4️⃣ **Categories:** Infrastructure, Plants, Decoration, Fish
- 💡 **Educational:** Real aquarium tips

### Current Features
- Element catalog
- Price tracking
- Tip system
- Compatibility checks

### Future Enhancements (Planned)
- [ ] Challenge mode with goals
- [ ] Budget constraints
- [ ] Fish happiness meter
- [ ] Water quality simulation
- [ ] Customer orders
- [ ] Star rating system

**Status:** Not modified in this update

---

## 🎯 Feature Comparison

| Feature | Collector | Racing | Memory | Builder |
|---------|-----------|--------|--------|---------|
| **Combo System** | ✅ New | ❌ | ✅ Existing | ❌ |
| **Physics Engine** | ✅ New | ✅ New | ❌ | ❌ |
| **Power-Ups** | ✅ Enhanced | ✅ New | ❌ | ❌ |
| **Energy Management** | ❌ | ✅ New | ❌ | ❌ |
| **Progressive Difficulty** | ✅ New | ❌ | ✅ Existing | ❌ |
| **Visual Effects** | ✅ Enhanced | ✅ Enhanced | ✅ Existing | ✅ Existing |
| **Mobile Optimized** | ✅ | ✅ | ✅ | ✅ |
| **Keyboard Support** | ✅ | ✅ | ✅ | ✅ |

---

## 🎮 Gameplay Tips

### Collector Game
1. **Build Combos:** Collect items quickly for multipliers
2. **Watch Currents:** Anticipate drift direction
3. **Chase Frenzy:** Maximize points during 2x periods
4. **Grab Power-Ups:** Especially magnets and double points
5. **Late Game:** Items fall faster - stay focused!

### Racing Game
1. **Boost Wisely:** Don't deplete turbo early
2. **Collect Power-Ups:** Speed boosts are permanent
3. **Watch Stamina:** Yours AND opponents'
4. **Save Energy:** For final sprint
5. **Comeback Wins:** Exhausted leaders are vulnerable!

### Memory Game
1. **Speed Matters:** Fast matches = bonus points
2. **Build Combos:** Consecutive pairs multiply score
3. **Use Hints:** If stuck after 5 seconds
4. **Pattern Memory:** Group fish by type mentally

### Builder Game
1. **Essentials First:** Filter and heater are required
2. **Plant Zones:** Front, middle, back placement matters
3. **Fish Compatibility:** Check bioload and aggression
4. **Read Tips:** Hover over items for advice

---

## 📊 Scoring Systems

### Collector Game
```
Base Score = Item Points × Difficulty Multiplier
Combo Multiplier = 1 + (Combo - 1) × 0.5 (max 5x)
Frenzy Multiplier = 2x (when active)
Power-Up Multiplier = 2x (with double points)

Final Score = Base × Combo × Frenzy × Power-Up + Bonus
```

**Example:**
- 10pt item
- 4x combo
- Frenzy active
- Double points power-up
- = 10 × 2.5 × 2 × 2 = **100 points!**

### Racing Game
```
Starting Points = 100
Bet Amount = 10-50 (your choice)
Win Payout = Bet × 3
Loss = Bet lost

Final Score = Starting ± Bet Results
```

**Example:**
- Bet 30 on Nemo
- Nemo wins
- = 100 - 30 + 90 = **160 points!**

---

## 🏆 Achievements (Coming Soon)

### Collector
- [ ] **Combo Master:** 10x combo
- [ ] **Frenzy Hunter:** Trigger 5 frenzies
- [ ] **Perfect Run:** Collect all target items
- [ ] **Speed Demon:** 500+ points

### Racing
- [ ] **Energy Efficient:** Win with 50%+ turbo
- [ ] **Comeback King:** Win from last place
- [ ] **Power Player:** Collect 10 power-ups
- [ ] **Marathon:** Win 5 races in a row

---

## 🔧 Keyboard Shortcuts

### Global
- `ESC` or `P`: Pause game
- `R`: Restart game
- `H` or `?`: Show help

### Collector Game
- `SPACE`: Pause/Resume
- Arrow keys: (Reserved for future)

### Racing Game
- `SPACE`: Boost selected fish
- `1-8`: (Reserved for quick fish selection)

---

## 📱 Mobile Controls

### Touch Optimized
- Min touch target: 44×44px
- Pause button: Extra large (56px)
- Swipe gestures: Future enhancement

### Responsive
- Adjusts to screen size
- Portrait and landscape modes
- Works on tablets and phones

---

## 🎨 Accessibility

### Visual
- High contrast mode support
- Color-blind friendly indicators
- Large touch targets

### Motion
- Reduced motion support
- Disable animations option
- Slower particle effects

### Audio
- Optional sound effects
- Visual alternatives
- Haptic feedback

---

## 📈 Version History

### v5.3 (Current) - Realism Update
- Water physics with currents
- Stamina system for racing
- Visual exhaustion indicators

### v5.2 - Gameplay Update
- Combo system
- Frenzy mode
- Turbo meter
- Track power-ups

### v5.1 - Foundation
- Pause functionality
- Performance optimizations
- Mobile responsiveness

---

**For detailed technical documentation, see `GAME_IMPROVEMENTS.md`**
**For deployment guide, see `PULL_REQUEST_DESCRIPTION.md`**

---

Last Updated: 2025-11-21
