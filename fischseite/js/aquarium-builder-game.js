/* 🏗️ AQUARIUM BUILDER GAME V1.0
   - Lehrreiches Drag-and-Drop Aquascaping-Tool
   - 4 Element-Kategorien mit realistischen Aquarium-Regeln
   - Educational Feedback mit echten Aquaristik-Tipps
   - Touch + Desktop optimiert
   - Animation Coordinator Integration
   - Glassmorphism UI Design
*/

// 🏗️ ELEMENT KATEGORIEN UND ITEMS
const AQUARIUM_ELEMENTS = {
    infrastructure: {
        name: 'Infrastruktur',
        icon: '🔧',
        color: '#FF6B6B',
        items: [
            {
                id: 'filter',
                name: 'Filter',
                icon: '🌪️',
                price: 50,
                essential: true,
                description: 'Entfernt Schadstoffe und sorgt für klares Wasser',
                tips: 'Ein Filter ist UNVERZICHTBAR für jedes Aquarium!'
            },
            {
                id: 'heater',
                name: 'Heizer',
                icon: '🌡️',
                price: 30,
                essential: true,
                description: 'Hält konstante Wassertemperatur für tropische Fische',
                tips: 'Tropische Fische benötigen 24-26°C Wassertemperatur'
            },
            {
                id: 'lighting',
                name: 'Beleuchtung',
                icon: '💡',
                price: 40,
                essential: false,
                description: 'LED-Beleuchtung für gesundes Pflanzenwachstum',
                tips: 'Pflanzen brauchen 8-10 Stunden Licht täglich'
            },
            {
                id: 'airpump',
                name: 'Luftpumpe',
                icon: '💨',
                price: 25,
                essential: false,
                description: 'Reichert Wasser mit lebenswichtigem Sauerstoff an',
                tips: 'Besonders wichtig bei hohem Fischbesatz'
            },
            {
                id: 'co2',
                name: 'CO2-Anlage',
                icon: '🫧',
                price: 80,
                essential: false,
                description: 'CO2-Düngung für prächtiges Pflanzenwachstum',
                tips: 'Nur für bepflanzte Aquarien mit anspruchsvollen Pflanzen'
            }
        ]
    },
    plants: {
        name: 'Pflanzen',
        icon: '🌱',
        color: '#4CAF50',
        items: [
            {
                id: 'foreground',
                name: 'Vordergrund-Pflanzen',
                icon: '🌿',
                price: 15,
                zone: 'front',
                description: 'Niedrige Pflanzen wie Glossostigma oder Hemianthus',
                tips: 'Schaffen Tiefenwirkung und natürlichen Rasen-Effekt'
            },
            {
                id: 'midground',
                name: 'Mittelgrund-Pflanzen',
                icon: '🍀',
                price: 20,
                zone: 'middle',
                description: 'Mittlere Pflanzen wie Anubias oder Cryptocoryne',
                tips: 'Bilden das Herzstück des Aquascapes'
            },
            {
                id: 'background',
                name: 'Hintergrund-Pflanzen',
                icon: '🌳',
                price: 25,
                zone: 'back',
                description: 'Hohe Pflanzen wie Vallisneria oder Cabomba',
                tips: 'Verstecken Technik und schaffen natürliche Kulisse'
            },
            {
                id: 'floating',
                name: 'Schwimmpflanzen',
                icon: '🪷',
                price: 10,
                zone: 'surface',
                description: 'Wasserhyazinthe oder Wassersalat',
                tips: 'Reduzieren Algenwachstum und schatten das Aquarium'
            },
            {
                id: 'moss',
                name: 'Moose',
                icon: '🌸',
                price: 12,
                zone: 'any',
                description: 'Java-Moos oder Christmas-Moos für natürliche Optik',
                tips: 'Perfekt zum Aufbinden auf Wurzeln und Steine'
            }
        ]
    },
    hardscape: {
        name: 'Hardscape',
        icon: '🪨',
        color: '#8D6E63',
        items: [
            {
                id: 'driftwood',
                name: 'Wurzeln',
                icon: '🪵',
                price: 35,
                description: 'Mangrovenwurzeln oder Moorkienwurzel',
                tips: 'Senken pH-Wert und bieten natürliche Verstecke'
            },
            {
                id: 'rocks',
                name: 'Steine',
                icon: '🪨',
                price: 20,
                description: 'Seiryu-Steine oder Lava-Gestein',
                tips: 'Achten Sie auf pH-neutrale Gesteine!'
            },
            {
                id: 'caves',
                name: 'Höhlen',
                icon: '🕳️',
                price: 25,
                description: 'Kokosnuss-Höhlen oder Keramik-Verstecke',
                tips: 'Rückzugsorte reduzieren Stress bei scheuen Fischen'
            },
            {
                id: 'substrate',
                name: 'Bodengrund',
                icon: '🏔️',
                price: 30,
                description: 'Aqua-Soil oder Kies für Pflanzenwurzeln',
                tips: 'Nährstoff-Soil für Pflanzen, Kies für einfache Pflege'
            },
            {
                id: 'decoration',
                name: 'Deko-Objekte',
                icon: '🏺',
                price: 15,
                description: 'Amphoren oder versunkene Schiffe',
                tips: 'Sparsam einsetzen - Natürlichkeit ist Trumpf!'
            }
        ]
    },
    fish: {
        name: 'Fische',
        icon: '🐠',
        color: '#2196F3',
        items: [
            {
                id: 'schooling',
                name: 'Schwarmfische',
                icon: '🐟',
                price: 45,
                bioload: 3,
                minGroup: 6,
                description: 'Neon-Salmler oder Kardinal-Salmler',
                tips: 'Schwarmfische brauchen mindestens 6 Artgenossen!'
            },
            {
                id: 'bottom',
                name: 'Bodenfische',
                icon: '🐡',
                price: 35,
                bioload: 2,
                minGroup: 1,
                description: 'Panzerwelse oder Dornaugen',
                tips: 'Reinigen den Bodengrund und sind sehr friedlich'
            },
            {
                id: 'centerpiece',
                name: 'Einzelgänger',
                icon: '🐠',
                price: 60,
                bioload: 4,
                minGroup: 1,
                aggressive: false,
                description: 'Kampffisch oder Zwergfadenfisch',
                tips: 'Meist territoriale Fische - nur ein Exemplar pro Art'
            },
            {
                id: 'predator',
                name: 'Raubfische',
                icon: '🦈',
                price: 80,
                bioload: 6,
                minGroup: 1,
                aggressive: true,
                description: 'Skalare oder Buntbarsche',
                tips: 'Nur mit robusten Mitbewohnern vergesellschaften!'
            },
            {
                id: 'cleaner',
                name: 'Putzerfische',
                icon: '🧽',
                price: 25,
                bioload: 1,
                minGroup: 1,
                description: 'Antennenwelse oder Otocinclus',
                tips: 'Helfen bei der Algenbekämpfung - aber keine Algenlösung!'
            }
        ]
    }
};

// 🎯 AQUARIUM VALIDATION RULES
const VALIDATION_RULES = {
    essential: ['filter', 'heater'], // Mindestanforderungen
    maxBioload: 20, // Maximaler Fischbesatz
    plantBalance: {
        minPlants: 3, // Mindestanzahl Pflanzen für CO2-Balance
        lightRequired: ['foreground', 'midground', 'background'] // Pflanzen die Licht brauchen
    },
    compatibility: {
        aggressive: ['predator'], // Aggressive Fische
        peaceful: ['schooling', 'bottom', 'centerpiece', 'cleaner'] // Friedliche Fische
    },
    aesthetics: {
        goldenRatio: 0.618, // Goldener Schnitt für Platzierung
        maxDecorations: 3 // Nicht zu viel Deko
    }
};

class AquariumBuilderGame {
    constructor() {
        this.container = null;
        this.aquariumArea = null;
        this.elementPalette = null;
        this.validationPanel = null;
        this.scoreDisplay = null;

        this.placedElements = new Map();
        this.draggedElement = null;
        this.score = 0;
        this.isEducationMode = true;

        this.isDragging = false;
        this.startPos = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };

        // Performance tracking
        this.lastFrameTime = 0;
        this.frameRate = 60;

        // 🔥 VERBESSERUNG #2: Achievement System
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.initializeAchievements();

        // 🔥 VERBESSERUNG #4: Visual Effects System
        this.particleSystem = {
            particles: [],
            bubbleInterval: null,
            isActive: false
        };

        // 🔥 VERBESSERUNG #5: Smart Suggestions System
        this.suggestionSystem = {
            currentSuggestions: [],
            lastSuggestionTime: 0,
            suggestionCooldown: 10000 // 10 seconds
        };

        this.init();
    }

    init() {
        this.createGameUI();
        this.setupEventListeners();
        this.registerWithAnimationCoordinator();
        this.updateValidation();

        console.log('🏗️ Aquarium Builder Game initialized');
    }

    createGameUI() {
        // Main game container
        this.container = document.createElement('div');
        this.container.className = 'aquarium-builder-game';
        this.container.innerHTML = `
            <div class="game-header">
                <div class="game-title">
                    <i class="fas fa-fish"></i>
                    <h3>Aquarium Builder</h3>
                    <span class="subtitle">Erschaffe dein perfektes Aquarium</span>
                </div>
                <div class="game-controls">
                    <button class="btn-reset" title="Alles zurücksetzen">
                        <i class="fas fa-redo"></i>
                        Reset
                    </button>
                    <button class="btn-help" title="Spielanleitung">
                        <i class="fas fa-question-circle"></i>
                        Hilfe
                    </button>
                    <button class="btn-export" title="Aquarium exportieren">
                        <i class="fas fa-download"></i>
                        Export
                    </button>
                    <div class="score-display">
                        <i class="fas fa-star"></i>
                        <span class="score-value">0</span>
                        <span class="score-label">Punkte</span>
                    </div>
                </div>
            </div>

            <div class="game-content">
                <div class="element-palette">
                    <div class="palette-header">
                        <h4>🧰 Element-Bibliothek</h4>
                        <div class="category-tabs"></div>
                    </div>
                    <div class="palette-content">
                        <div class="category-elements"></div>
                    </div>
                </div>

                <div class="aquarium-area">
                    <div class="aquarium-container">
                        <div class="aquarium-glass">
                            <div class="water-level"></div>
                            <div class="build-zone" data-zone="build">
                                <div class="drop-hint">
                                    <i class="fas fa-hand-pointer"></i>
                                    <p>Ziehe Elemente hierher um dein Aquarium zu bauen</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="validation-panel">
                    <div class="panel-header">
                        <h4>📋 Aquarium-Check</h4>
                        <div class="education-toggle">
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <span>Lernen-Modus</span>
                        </div>
                    </div>
                    <div class="validation-content">
                        <div class="requirements-check"></div>
                        <div class="tips-section"></div>
                        <div class="bioload-meter"></div>
                    </div>
                </div>
            </div>
        `;

        // Add to page (find appropriate location)
        const gamesSection = document.querySelector('#games') || document.body;
        gamesSection.appendChild(this.container);

        // Cache DOM elements
        this.aquariumArea = this.container.querySelector('.build-zone');
        this.elementPalette = this.container.querySelector('.category-elements');
        this.validationPanel = this.container.querySelector('.validation-content');
        this.scoreDisplay = this.container.querySelector('.score-value');

        this.createElementPalette();
        this.createAquariumZones();
    }

    createElementPalette() {
        const categoryTabs = this.container.querySelector('.category-tabs');
        const elementsContainer = this.container.querySelector('.category-elements');

        // Create category tabs
        Object.entries(AQUARIUM_ELEMENTS).forEach(([categoryId, category], index) => {
            const tab = document.createElement('button');
            tab.className = `category-tab ${index === 0 ? 'active' : ''}`;
            tab.dataset.category = categoryId;
            tab.innerHTML = `
                <span class="tab-icon">${category.icon}</span>
                <span class="tab-name">${category.name}</span>
            `;
            tab.style.borderColor = category.color;
            categoryTabs.appendChild(tab);
        });

        // Show first category by default
        this.showCategory('infrastructure');

        // Tab click handlers
        categoryTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.category-tab');
            if (!tab) return;

            // Update active tab
            categoryTabs.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show category
            this.showCategory(tab.dataset.category);
        });
    }

    showCategory(categoryId) {
        const category = AQUARIUM_ELEMENTS[categoryId];
        const container = this.container.querySelector('.category-elements');

        container.innerHTML = '';

        category.items.forEach(item => {
            const element = document.createElement('div');
            element.className = 'palette-element';
            element.dataset.elementId = item.id;
            element.dataset.category = categoryId;
            element.draggable = true;

            element.innerHTML = `
                <div class="element-icon">${item.icon}</div>
                <div class="element-info">
                    <div class="element-name">${item.name}</div>
                    <div class="element-price">€${item.price}</div>
                    ${item.essential ? '<div class="essential-badge">Essential</div>' : ''}
                </div>
                <div class="element-tooltip">
                    <p>${item.description}</p>
                    ${item.tips ? `<div class="tip">💡 ${item.tips}</div>` : ''}
                </div>
            `;

            container.appendChild(element);
        });
    }

    createAquariumZones() {
        const buildZone = this.aquariumArea;

        // Create placement zones for better organization
        const zones = ['background', 'midground', 'foreground', 'bottom', 'surface'];

        zones.forEach(zone => {
            const zoneElement = document.createElement('div');
            zoneElement.className = `placement-zone zone-${zone}`;
            zoneElement.dataset.zone = zone;
            buildZone.appendChild(zoneElement);
        });

        // Remove drop hint after first element is placed
        this.dropHint = buildZone.querySelector('.drop-hint');
    }

    setupEventListeners() {
        // Drag and drop for desktop
        this.container.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.container.addEventListener('dragover', this.handleDragOver.bind(this));
        this.container.addEventListener('drop', this.handleDrop.bind(this));
        this.container.addEventListener('dragend', this.handleDragEnd.bind(this));

        // Touch events for mobile
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Control buttons
        this.container.querySelector('.btn-reset').addEventListener('click', this.resetAquarium.bind(this));
        this.container.querySelector('.btn-help').addEventListener('click', this.showHelp.bind(this));
        this.container.querySelector('.btn-export').addEventListener('click', this.exportAquarium.bind(this));

        // 🔥 VERBESSERUNG #4: Start bubble effects
        this.startBubbleEffect();

        // Education mode toggle
        this.container.querySelector('.education-toggle input').addEventListener('change', (e) => {
            this.isEducationMode = e.target.checked;
            this.updateValidation();
        });

        // Element removal (right-click or long press)
        this.aquariumArea.addEventListener('contextmenu', this.handleElementRemove.bind(this));
        this.aquariumArea.addEventListener('dblclick', this.handleElementRemove.bind(this));
    }

    // 🖱️ DRAG AND DROP HANDLERS
    handleDragStart(e) {
        const element = e.target.closest('.palette-element');
        if (!element) return;

        this.draggedElement = {
            id: element.dataset.elementId,
            category: element.dataset.category,
            element: element
        };

        element.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', element.dataset.elementId);
    }

    handleDragOver(e) {
        if (!this.draggedElement) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        // Visual feedback
        if (e.target.closest('.build-zone')) {
            e.target.closest('.build-zone').classList.add('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();

        if (!this.draggedElement) return;

        const buildZone = e.target.closest('.build-zone');
        if (!buildZone) return;

        const rect = buildZone.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.placeElement(this.draggedElement, x, y);

        buildZone.classList.remove('drag-over');
    }

    handleDragEnd(e) {
        if (this.draggedElement) {
            this.draggedElement.element.classList.remove('dragging');
            this.draggedElement = null;
        }

        // Clean up visual feedback
        this.container.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }

    // 📱 TOUCH HANDLERS
    handleTouchStart(e) {
        const element = e.target.closest('.palette-element');
        if (!element) return;

        e.preventDefault();

        this.isDragging = true;
        this.draggedElement = {
            id: element.dataset.elementId,
            category: element.dataset.category,
            element: element
        };

        const touch = e.touches[0];
        this.startPos = { x: touch.clientX, y: touch.clientY };

        // Create drag preview
        this.createDragPreview(element, touch.clientX, touch.clientY);

        element.classList.add('dragging');
    }

    handleTouchMove(e) {
        if (!this.isDragging || !this.draggedElement) return;

        e.preventDefault();

        const touch = e.touches[0];
        this.updateDragPreview(touch.clientX, touch.clientY);

        // Visual feedback for drop zones
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const buildZone = elementBelow?.closest('.build-zone');

        // Clean previous highlights
        this.container.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });

        if (buildZone) {
            buildZone.classList.add('drag-over');
        }
    }

    handleTouchEnd(e) {
        if (!this.isDragging || !this.draggedElement) return;

        e.preventDefault();

        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const buildZone = elementBelow?.closest('.build-zone');

        if (buildZone) {
            const rect = buildZone.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            this.placeElement(this.draggedElement, x, y);
        }

        this.cleanupDragOperation();
    }

    createDragPreview(element, x, y) {
        this.dragPreview = element.cloneNode(true);
        this.dragPreview.className = 'drag-preview';
        this.dragPreview.style.cssText = `
            position: fixed;
            top: ${y - 30}px;
            left: ${x - 30}px;
            width: 60px;
            height: 60px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0.8;
            transform: scale(0.8);
            transition: none;
        `;

        document.body.appendChild(this.dragPreview);
    }

    updateDragPreview(x, y) {
        if (this.dragPreview) {
            this.dragPreview.style.left = `${x - 30}px`;
            this.dragPreview.style.top = `${y - 30}px`;
        }
    }

    cleanupDragOperation() {
        this.isDragging = false;

        if (this.draggedElement) {
            this.draggedElement.element.classList.remove('dragging');
            this.draggedElement = null;
        }

        if (this.dragPreview) {
            this.dragPreview.remove();
            this.dragPreview = null;
        }

        // Clean up visual feedback
        this.container.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }

    // 🏗️ ELEMENT PLACEMENT
    placeElement(draggedElement, x, y) {
        const elementData = this.getElementData(draggedElement.id, draggedElement.category);
        if (!elementData) return;

        // Create placed element
        const placedElement = document.createElement('div');
        placedElement.className = 'placed-element';
        placedElement.dataset.elementId = draggedElement.id;
        placedElement.dataset.category = draggedElement.category;

        placedElement.innerHTML = `
            <div class="element-visual">
                <span class="element-icon">${elementData.icon}</span>
                <span class="element-label">${elementData.name}</span>
            </div>
            <div class="element-controls">
                <button class="btn-remove" title="Entfernen">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Position element
        placedElement.style.cssText = `
            position: absolute;
            left: ${Math.max(0, Math.min(x - 30, this.aquariumArea.clientWidth - 60))}px;
            top: ${Math.max(0, Math.min(y - 30, this.aquariumArea.clientHeight - 60))}px;
        `;

        // Add to aquarium
        this.aquariumArea.appendChild(placedElement);

        // Store element data
        const elementId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        placedElement.dataset.instanceId = elementId;

        this.placedElements.set(elementId, {
            id: draggedElement.id,
            category: draggedElement.category,
            data: elementData,
            element: placedElement,
            position: { x, y }
        });

        // Hide drop hint
        if (this.dropHint) {
            this.dropHint.style.display = 'none';
        }

        // 🔥 VERBESSERUNG #1: Sound & Haptic Feedback
        this.playPlacementFeedback(draggedElement.category);

        // 🔥 VERBESSERUNG #4: Visual Effects
        this.createPlacementParticles(x, y, draggedElement.category);

        // Update game state
        this.updateScore();
        this.updateValidation();

        // 🔥 VERBESSERUNG #2: Check achievements after placement
        this.checkAchievements();

        // 🔥 VERBESSERUNG #5: Update smart suggestions
        this.updateSmartSuggestions();

        // Add remove handler
        placedElement.querySelector('.btn-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeElement(elementId);
        });

        console.log(`🏗️ Placed element: ${elementData.name}`);
    }

    removeElement(instanceId) {
        const elementData = this.placedElements.get(instanceId);
        if (!elementData) return;

        elementData.element.remove();
        this.placedElements.delete(instanceId);

        // Show drop hint if no elements left
        if (this.placedElements.size === 0 && this.dropHint) {
            this.dropHint.style.display = 'block';
        }

        this.updateScore();
        this.updateValidation();

        console.log(`🗑️ Removed element: ${elementData.data.name}`);
    }

    handleElementRemove(e) {
        e.preventDefault();

        const element = e.target.closest('.placed-element');
        if (!element) return;

        const instanceId = element.dataset.instanceId;
        this.removeElement(instanceId);
    }

    // 🎯 VALIDATION SYSTEM
    updateValidation() {
        const requirements = this.checkRequirements();
        const bioload = this.calculateBioload();
        const compatibility = this.checkCompatibility();
        const aesthetics = this.checkAesthetics();

        this.renderValidation({
            requirements,
            bioload,
            compatibility,
            aesthetics
        });
    }

    checkRequirements() {
        const placedTypes = Array.from(this.placedElements.values()).map(el => el.id);
        const essential = VALIDATION_RULES.essential;

        return {
            filter: placedTypes.includes('filter'),
            heater: placedTypes.includes('heater'),
            complete: essential.every(req => placedTypes.includes(req))
        };
    }

    calculateBioload() {
        let totalBioload = 0;
        let fishCount = 0;

        this.placedElements.forEach(element => {
            if (element.category === 'fish' && element.data.bioload) {
                totalBioload += element.data.bioload;
                fishCount++;
            }
        });

        return {
            current: totalBioload,
            max: VALIDATION_RULES.maxBioload,
            percentage: (totalBioload / VALIDATION_RULES.maxBioload) * 100,
            fishCount: fishCount
        };
    }

    checkCompatibility() {
        const fish = Array.from(this.placedElements.values())
            .filter(el => el.category === 'fish');

        const aggressive = fish.filter(f => f.data.aggressive);
        const peaceful = fish.filter(f => !f.data.aggressive);

        return {
            hasConflicts: aggressive.length > 0 && peaceful.length > 0,
            aggressive: aggressive.length,
            peaceful: peaceful.length
        };
    }

    checkAesthetics() {
        const decorations = Array.from(this.placedElements.values())
            .filter(el => el.id === 'decoration');

        const plants = Array.from(this.placedElements.values())
            .filter(el => el.category === 'plants');

        return {
            tooManyDecorations: decorations.length > VALIDATION_RULES.aesthetics.maxDecorations,
            hasPlants: plants.length > 0,
            plantBalance: plants.length >= VALIDATION_RULES.plantBalance.minPlants
        };
    }

    renderValidation(validation) {
        const container = this.validationPanel;
        const { requirements, bioload, compatibility, aesthetics } = validation;

        container.innerHTML = `
            <div class="requirements-section">
                <h5>📋 Grundausstattung</h5>
                <div class="requirement-item ${requirements.filter ? 'met' : 'missing'}">
                    <i class="fas ${requirements.filter ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <span>Filter ${requirements.filter ? '✓' : '✗'}</span>
                </div>
                <div class="requirement-item ${requirements.heater ? 'met' : 'missing'}">
                    <i class="fas ${requirements.heater ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <span>Heizer ${requirements.heater ? '✓' : '✗'}</span>
                </div>
            </div>

            <div class="bioload-section">
                <h5>🐠 Fischbesatz</h5>
                <div class="bioload-bar">
                    <div class="bioload-fill" style="width: ${Math.min(bioload.percentage, 100)}%"></div>
                    <span class="bioload-text">${bioload.current}/${bioload.max}</span>
                </div>
                <p class="bioload-status ${bioload.percentage > 100 ? 'overloaded' : bioload.percentage > 80 ? 'warning' : 'good'}">
                    ${bioload.percentage > 100 ? '⚠️ Überbesetzt!' :
                      bioload.percentage > 80 ? '⚡ Fast voll' :
                      '✅ Optimal'}
                </p>
            </div>

            ${compatibility.hasConflicts ? `
                <div class="compatibility-section warning">
                    <h5>⚠️ Verträglichkeit</h5>
                    <p>Aggressive und friedliche Fische nicht zusammen halten!</p>
                </div>
            ` : ''}

            ${this.isEducationMode ? `
                <div class="tips-section">
                    <h5>💡 Aquaristik-Tipps</h5>
                    ${this.generateEducationalTips(validation)}
                </div>
            ` : ''}
        `;
    }

    generateEducationalTips(validation) {
        const tips = [];

        if (!validation.requirements.complete) {
            tips.push('🔧 Filter und Heizer sind unverzichtbar für ein gesundes Aquarium');
        }

        if (validation.bioload.percentage > 80) {
            tips.push('🐠 Zu viele Fische können zu schlechter Wasserqualität führen');
        }

        if (!validation.aesthetics.hasPlants) {
            tips.push('🌱 Pflanzen produzieren Sauerstoff und reduzieren Algen');
        }

        if (validation.compatibility.hasConflicts) {
            tips.push('⚔️ Aggressive Fische stressen friedliche Arten');
        }

        if (validation.aesthetics.tooManyDecorations) {
            tips.push('🏺 Weniger ist mehr - natürliche Aquascapes wirken harmonischer');
        }

        if (tips.length === 0) {
            tips.push('🏆 Perfekt! Ihr Aquarium erfüllt alle wichtigen Kriterien');
        }

        return tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
    }

    // 🎯 SCORING SYSTEM
    updateScore() {
        let score = 0;

        // Basic requirements (40 points)
        const requirements = this.checkRequirements();
        if (requirements.complete) score += 40;

        // Balanced bioload (20 points)
        const bioload = this.calculateBioload();
        if (bioload.percentage <= 80) score += 20;

        // Fish compatibility (20 points)
        const compatibility = this.checkCompatibility();
        if (!compatibility.hasConflicts) score += 20;

        // Aesthetic balance (20 points)
        const aesthetics = this.checkAesthetics();
        if (aesthetics.hasPlants && !aesthetics.tooManyDecorations) score += 20;

        this.score = score;
        this.scoreDisplay.textContent = score;

        // Visual feedback
        this.scoreDisplay.className = `score-value ${
            score >= 80 ? 'excellent' :
            score >= 60 ? 'good' :
            score >= 40 ? 'fair' : 'poor'
        }`;
    }

    // 🎮 GAME CONTROLS
    resetAquarium() {
        if (this.placedElements.size === 0) return;

        if (confirm('Möchten Sie wirklich alle Elemente entfernen?')) {
            this.placedElements.forEach((_, instanceId) => {
                this.removeElement(instanceId);
            });

            if (this.dropHint) {
                this.dropHint.style.display = 'block';
            }

            console.log('🔄 Aquarium reset');
        }
    }

    showHelp() {
        const helpDialog = document.createElement('div');
        helpDialog.className = 'help-dialog';
        helpDialog.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h3>🏗️ Aquarium Builder - Spielanleitung</h3>
                    <button class="btn-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="help-body">
                    <div class="help-section">
                        <h4>🎯 Spielziel</h4>
                        <p>Erstelle ein perfektes Aquarium mit realistischen Aquaristik-Regeln!</p>
                    </div>

                    <div class="help-section">
                        <h4>🕹️ Steuerung</h4>
                        <ul>
                            <li><strong>Desktop:</strong> Elemente aus der Palette ins Aquarium ziehen</li>
                            <li><strong>Mobile:</strong> Element antippen und ins Aquarium ziehen</li>
                            <li><strong>Entfernen:</strong> Doppelklick oder X-Button</li>
                        </ul>
                    </div>

                    <div class="help-section">
                        <h4>📏 Aquaristik-Regeln</h4>
                        <ul>
                            <li>🔧 <strong>Filter & Heizer</strong> sind unverzichtbar</li>
                            <li>🐠 <strong>Fischbesatz</strong> nicht überlasten (max. 20 Punkte)</li>
                            <li>⚔️ <strong>Aggressive</strong> und friedliche Fische trennen</li>
                            <li>🌱 <strong>Pflanzen</strong> für gesundes Aquarium verwenden</li>
                            <li>🎨 <strong>Weniger Deko</strong> = natürlichere Optik</li>
                        </ul>
                    </div>

                    <div class="help-section">
                        <h4>🏆 Bewertung</h4>
                        <ul>
                            <li><strong>80-100 Punkte:</strong> Aquaristik-Experte! 🏆</li>
                            <li><strong>60-79 Punkte:</strong> Sehr gut! 🥈</li>
                            <li><strong>40-59 Punkte:</strong> Solide Basis 🥉</li>
                            <li><strong>0-39 Punkte:</strong> Üben Sie weiter! 📚</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(helpDialog);

        // Close handler
        helpDialog.querySelector('.btn-close').addEventListener('click', () => {
            helpDialog.remove();
        });

        helpDialog.addEventListener('click', (e) => {
            if (e.target === helpDialog) {
                helpDialog.remove();
            }
        });
    }

    // 🎨 ANIMATION COORDINATOR INTEGRATION
    registerWithAnimationCoordinator() {
        if (window.animationCoordinator) {
            window.animationCoordinator.registerSystem('aquariumBuilder', {
                priority: 3,
                update: this.update.bind(this)
            });
            console.log('🎬 Aquarium Builder registered with Animation Coordinator');
        }
    }

    update(deltaTime) {
        // Performance-optimized update loop
        // Currently no continuous animations needed
        // Reserved for future features like water effects
    }

    // 🔧 UTILITY METHODS
    getElementData(elementId, categoryId) {
        const category = AQUARIUM_ELEMENTS[categoryId];
        return category?.items.find(item => item.id === elementId);
    }

    destroy() {
        // Cleanup when game is removed
        if (window.animationCoordinator) {
            window.animationCoordinator.unregisterSystem('aquariumBuilder');
        }

        if (this.container) {
            this.container.remove();
        }

        console.log('🏗️ Aquarium Builder Game destroyed');
    }

    // 🔥 VERBESSERUNG #1: Sound & Haptic Feedback System
    playPlacementFeedback(category) {
        // Sound feedback based on category
        if (window.aquariumSounds) {
            switch(category) {
                case 'infrastructure':
                    window.aquariumSounds.playButton();
                    break;
                case 'plants':
                    window.aquariumSounds.playSuccess();
                    break;
                case 'hardscape':
                    window.aquariumSounds.playCollect();
                    break;
                case 'fish':
                    window.aquariumSounds.playSpawn();
                    break;
                default:
                    window.aquariumSounds.playButton();
            }
        }

        // Haptic feedback
        if (window.aquariumHaptics) {
            window.aquariumHaptics.button();
        }
    }

    // 🔥 VERBESSERUNG #2: Achievement System
    initializeAchievements() {
        this.achievements.set('first_build', {
            name: 'Erster Baustein',
            description: 'Platziere dein erstes Element',
            icon: '🏗️',
            requirement: () => this.placedElements.size >= 1
        });

        this.achievements.set('basic_setup', {
            name: 'Grundausstattung',
            description: 'Filter und Heizer installiert',
            icon: '🔧',
            requirement: () => {
                const requirements = this.checkRequirements();
                return requirements.complete;
            }
        });

        this.achievements.set('green_thumb', {
            name: 'Grüner Daumen',
            description: 'Platziere 5 verschiedene Pflanzen',
            icon: '🌱',
            requirement: () => {
                const plants = Array.from(this.placedElements.values())
                    .filter(el => el.category === 'plants');
                const uniquePlants = new Set(plants.map(p => p.id));
                return uniquePlants.size >= 5;
            }
        });

        this.achievements.set('aquascaper', {
            name: 'Aquascaper',
            description: 'Erreiche 80+ Punkte',
            icon: '🏆',
            requirement: () => this.score >= 80
        });

        this.achievements.set('fish_expert', {
            name: 'Fisch-Experte',
            description: 'Perfekte Fisch-Verträglichkeit',
            icon: '🐠',
            requirement: () => {
                const compatibility = this.checkCompatibility();
                return !compatibility.hasConflicts && compatibility.peaceful > 0;
            }
        });

        this.achievements.set('master_builder', {
            name: 'Meister-Bauherr',
            description: 'Perfekte 100 Punkte erreichen',
            icon: '👑',
            requirement: () => this.score === 100
        });
    }

    checkAchievements() {
        for (const [id, achievement] of this.achievements) {
            if (!this.unlockedAchievements.has(id) && achievement.requirement()) {
                this.unlockAchievement(id, achievement);
            }
        }
    }

    unlockAchievement(id, achievement) {
        this.unlockedAchievements.add(id);
        this.showAchievementNotification(achievement);

        // Special sound for achievements
        if (window.aquariumSounds) {
            window.aquariumSounds.playWin();
        }
        if (window.aquariumHaptics) {
            window.aquariumHaptics.raceFinish(1);
        }

        console.log(`🏆 Achievement unlocked: ${achievement.name}`);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #333;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            animation: achievementSlideIn 0.5s ease-out;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${achievement.icon}</span>
                <div>
                    <div style="font-size: 16px;">🏆 Achievement Unlocked!</div>
                    <div style="font-size: 14px; opacity: 0.8;">${achievement.name}</div>
                </div>
            </div>
        `;

        // Add animation style
        if (!document.getElementById('achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                @keyframes achievementSlideIn {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes achievementSlideOut {
                    0% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'achievementSlideOut 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // 🔥 VERBESSERUNG #3: Export/Share Feature
    exportAquarium() {
        const aquariumData = {
            timestamp: new Date().toISOString(),
            score: this.score,
            elements: Array.from(this.placedElements.values()).map(el => ({
                id: el.id,
                category: el.category,
                position: el.position,
                name: el.data.name
            })),
            achievements: Array.from(this.unlockedAchievements),
            validation: {
                requirements: this.checkRequirements(),
                bioload: this.calculateBioload(),
                compatibility: this.checkCompatibility(),
                aesthetics: this.checkAesthetics()
            }
        };

        // Create downloadable JSON
        const blob = new Blob([JSON.stringify(aquariumData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aquarium-design-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        // Show share dialog
        this.showShareDialog(aquariumData);
    }

    showShareDialog(aquariumData) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const shareText = `🏗️ Ich habe ein Aquarium mit ${aquariumData.score} Punkten gebaut! ${aquariumData.elements.length} Elemente, ${aquariumData.achievements.length} Achievements erreicht. 🐠`;

        dialog.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; text-align: center;">
                <h3>🎉 Aquarium teilen</h3>
                <div style="margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 10px; font-family: monospace; font-size: 14px; word-break: break-all;">
                    ${shareText}
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="copy-share-btn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">📋 Text kopieren</button>
                    <button id="close-share-btn" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">❌ Schließen</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Event handlers
        dialog.querySelector('#copy-share-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Text kopiert! Du kannst ihn jetzt teilen.');
            });
        });

        dialog.querySelector('#close-share-btn').addEventListener('click', () => {
            dialog.remove();
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.remove();
        });
    }

    // 🔥 VERBESSERUNG #4: Advanced Visual Effects
    createPlacementParticles(x, y, category) {
        const colors = {
            infrastructure: '#FF6B6B',
            plants: '#4CAF50',
            hardscape: '#8D6E63',
            fish: '#2196F3'
        };

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: ${colors[category]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: placementParticle 1s ease-out forwards;
            `;

            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);

            this.aquariumArea.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }
    }

    startBubbleEffect() {
        if (this.particleSystem.isActive) return;

        this.particleSystem.isActive = true;
        this.particleSystem.bubbleInterval = setInterval(() => {
            this.createBubble();
        }, 2000);
    }

    createBubble() {
        const bubble = document.createElement('div');
        const x = Math.random() * this.aquariumArea.clientWidth;

        bubble.style.cssText = `
            position: absolute;
            left: ${x}px;
            bottom: 0px;
            width: ${4 + Math.random() * 8}px;
            height: ${4 + Math.random() * 8}px;
            background: radial-gradient(circle, rgba(255,255,255,0.8), rgba(78,205,196,0.3));
            border-radius: 50%;
            pointer-events: none;
            animation: bubbleFloat ${3 + Math.random() * 2}s ease-out forwards;
        `;

        this.aquariumArea.appendChild(bubble);
        setTimeout(() => bubble.remove(), 5000);
    }

    // 🔥 VERBESSERUNG #5: Smart Suggestions System
    updateSmartSuggestions() {
        const now = Date.now();
        if (now - this.suggestionSystem.lastSuggestionTime < this.suggestionSystem.suggestionCooldown) {
            return;
        }

        const suggestions = this.generateSmartSuggestions();
        if (suggestions.length > 0) {
            this.showSuggestion(suggestions[0]);
            this.suggestionSystem.lastSuggestionTime = now;
        }
    }

    generateSmartSuggestions() {
        const suggestions = [];
        const requirements = this.checkRequirements();
        const bioload = this.calculateBioload();
        const aesthetics = this.checkAesthetics();
        const placedCategories = Array.from(this.placedElements.values()).map(el => el.category);

        // Smart logic based on current state
        if (!requirements.filter) {
            suggestions.push({
                icon: '🌪️',
                text: 'Ein Filter ist unverzichtbar für sauberes Wasser!',
                category: 'infrastructure',
                priority: 'high'
            });
        }

        if (!requirements.heater) {
            suggestions.push({
                icon: '🌡️',
                text: 'Tropische Fische brauchen einen Heizer!',
                category: 'infrastructure',
                priority: 'high'
            });
        }

        if (!placedCategories.includes('plants') && placedCategories.includes('fish')) {
            suggestions.push({
                icon: '🌱',
                text: 'Pflanzen produzieren Sauerstoff für deine Fische!',
                category: 'plants',
                priority: 'medium'
            });
        }

        if (bioload.percentage > 80) {
            suggestions.push({
                icon: '⚠️',
                text: 'Zu viele Fische können zu Wasserproblemen führen!',
                category: 'fish',
                priority: 'high'
            });
        }

        if (this.score >= 80 && !this.unlockedAchievements.has('aquascaper')) {
            suggestions.push({
                icon: '🏆',
                text: 'Du bist auf dem Weg zum Aquascaping-Experten!',
                category: 'general',
                priority: 'low'
            });
        }

        return suggestions.sort((a, b) => {
            const priority = { high: 3, medium: 2, low: 1 };
            return priority[b.priority] - priority[a.priority];
        });
    }

    showSuggestion(suggestion) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #4ECDC4, #44A08D);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            max-width: 300px;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
            animation: suggestionSlideIn 0.5s ease-out;
        `;

        popup.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">${suggestion.icon}</span>
                <div>
                    <div style="font-size: 14px; font-weight: bold;">💡 Tipp</div>
                    <div style="font-size: 13px; opacity: 0.9;">${suggestion.text}</div>
                </div>
                <button style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; margin-left: auto;" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.style.animation = 'suggestionSlideOut 0.5s ease-in forwards';
                setTimeout(() => popup.remove(), 500);
            }
        }, 8000);
    }
}

// 🎮 GAME INITIALIZATION
let aquariumBuilderGame = null;

function initAquariumBuilder() {
    if (aquariumBuilderGame) {
        aquariumBuilderGame.destroy();
    }

    aquariumBuilderGame = new AquariumBuilderGame();
    return aquariumBuilderGame;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAquariumBuilder);
} else {
    initAquariumBuilder();
}

// Export for external access
window.AquariumBuilderGame = AquariumBuilderGame;
window.initAquariumBuilder = initAquariumBuilder;

console.log('🏗️ Aquarium Builder Game module loaded');