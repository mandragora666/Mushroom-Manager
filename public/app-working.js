// 🍄 Mushroom Manager - Working Version
console.log('🍄 Starting Mushroom Manager (Working Version)...');

// Simple global function to handle navigation
function loadSection(section) {
    console.log('📄 Loading section:', section);
    
    const content = document.getElementById('content');
    const pageTitle = document.getElementById('pageTitle');
    const pageDescription = document.getElementById('pageDescription');
    const pageTitleMobile = document.getElementById('pageTitleMobile');
    const pageDescriptionMobile = document.getElementById('pageDescriptionMobile');

    let title, description, contentHtml;

    switch(section) {
        case 'dashboard':
            title = 'Dashboard';
            description = 'Übersicht Ihrer Pilzzucht-Aktivitäten';
            contentHtml = getDashboardContent();
            break;
        case 'zuchtprotokoll':
            title = 'Zuchtprotokoll';
            description = 'Dokumentation Ihrer Pilzzucht-Projekte';
            contentHtml = getZuchtprotokollContent();
            break;
        case 'wiki':
            title = 'Wiki & Substrate';
            description = 'Pilzsorten und Substratrezepte Datenbank';
            contentHtml = getWikiContent();
            break;
        case 'inventar':
            title = 'Inventarverwaltung';
            description = 'Materialien und Lagerbestand verwalten';
            contentHtml = getInventarContent();
            break;
        case 'kulturen':
            title = 'Kulturen';
            description = 'Agar, Flüssigkulturen und Sporensspritzen';
            contentHtml = getKulturenContent();
            break;
        case 'rechner':
            title = 'Rechner';
            description = 'Substrat- und Tinkturberechnung';
            contentHtml = getRechnerContent();
            break;
        case 'einstellungen':
            title = 'Einstellungen';
            description = 'App-Konfiguration und Benutzereinstellungen';
            contentHtml = getEinstellungenContent();
            break;
        default:
            title = 'Nicht gefunden';
            description = '';
            contentHtml = '<p class="text-center text-gray-600">Sektion nicht gefunden</p>';
    }

    // Update titles
    if (pageTitle) pageTitle.textContent = title;
    if (pageDescription) pageDescription.textContent = description;
    if (pageTitleMobile) pageTitleMobile.textContent = title;
    if (pageDescriptionMobile) pageDescriptionMobile.textContent = description;

    content.innerHTML = contentHtml;
    console.log('✅ Section loaded:', section);
    
    // Update navigation states
    updateNavigation(section);
    
    // Load live data for dashboard
    if (section === 'dashboard') {
        loadDashboardData();
    }
}

function updateNavigation(section) {
    // Desktop navigation
    document.querySelectorAll('#desktopNavigation .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });

    // Mobile navigation
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('active', 'text-green-600');
        item.classList.add('text-gray-600');
        if (item.getAttribute('data-section') === section) {
            item.classList.remove('text-gray-600');
            item.classList.add('active', 'text-green-600');
        }
    });
}

// Load dashboard data from API
async function loadDashboardData() {
    try {
        console.log('📊 Loading dashboard data from API...');
        
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
            const stats = await response.json();
            console.log('✅ Dashboard stats loaded:', stats);
            
            // Update UI elements if they exist
            const activeProtocols = document.getElementById('activeProtocols');
            const mushroomSpecies = document.getElementById('mushroomSpecies');
            const successRate = document.getElementById('successRate');
            
            if (activeProtocols) activeProtocols.textContent = stats.activeProtocols || 0;
            if (mushroomSpecies) mushroomSpecies.textContent = stats.mushroomSpecies || 0;
            if (successRate) successRate.textContent = (stats.averageSuccessRate || 0) + '%';
        } else {
            console.warn('⚠️ Failed to load dashboard stats, using fallback data');
        }
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
    }
}

function getDashboardContent() {
    return `
        <!-- Quick Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div class="card p-4 lg:p-6 cursor-pointer" onclick="loadSection('zuchtprotokoll')">
                <div class="flex items-center justify-between mb-3 lg:mb-4">
                    <div class="bg-green-100 p-2 lg:p-3 rounded-lg">
                        <i class="fas fa-clipboard-list text-green-600 text-lg lg:text-xl"></i>
                    </div>
                    <span id="activeProtocols" class="text-xl lg:text-2xl font-bold text-gray-800">2</span>
                </div>
                <h3 class="font-semibold text-gray-800 text-sm lg:text-base">Aktive Protokolle</h3>
                <p class="text-xs lg:text-sm text-gray-600">Laufende Zuchtprojekte</p>
            </div>

            <div class="card p-4 lg:p-6 cursor-pointer" onclick="loadSection('wiki')">
                <div class="flex items-center justify-between mb-3 lg:mb-4">
                    <div class="bg-purple-100 p-2 lg:p-3 rounded-lg">
                        <i class="fas fa-seedling text-purple-600 text-lg lg:text-xl"></i>
                    </div>
                    <span id="mushroomSpecies" class="text-xl lg:text-2xl font-bold text-gray-800">5</span>
                </div>
                <h3 class="font-semibold text-gray-800 text-sm lg:text-base">Pilzsorten</h3>
                <p class="text-xs lg:text-sm text-gray-600">In der Wiki-Datenbank</p>
            </div>

            <div class="card p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
                <div class="flex items-center justify-between mb-3 lg:mb-4">
                    <div class="bg-blue-100 p-2 lg:p-3 rounded-lg">
                        <i class="fas fa-chart-line text-blue-600 text-lg lg:text-xl"></i>
                    </div>
                    <span id="successRate" class="text-xl lg:text-2xl font-bold text-gray-800">79%</span>
                </div>
                <h3 class="font-semibold text-gray-800 text-sm lg:text-base">Durchschnittliche Erfolgsrate</h3>
                <p class="text-xs lg:text-sm text-gray-600">Aller Protokolle</p>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-4 lg:p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-plus-circle text-green-600 mr-2"></i>
                Schnellaktionen
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button class="btn-primary w-full text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center" 
                        onclick="loadSection('zuchtprotokoll')">
                    <i class="fas fa-clipboard-list mr-2"></i>
                    Neues Protokoll
                </button>
                <button class="btn-secondary w-full py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                        onclick="loadSection('wiki')">
                    <i class="fas fa-book-open mr-2"></i>
                    Wiki-Eintrag
                </button>
            </div>
        </div>

        <!-- Recent Activities -->
        <div class="card p-4 lg:p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-history text-gray-600 mr-2"></i>
                Letzte Aktivitäten
            </h3>
            <div class="space-y-3">
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div class="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <i class="fas fa-plus text-green-600 text-sm"></i>
                    </div>
                    <div class="flex-grow min-w-0">
                        <p class="font-medium text-gray-800 text-sm">Neues Zuchtprotokoll erstellt</p>
                        <p class="text-xs text-gray-600 truncate">Black Pearl - Pleurotus ostreatus</p>
                    </div>
                    <span class="text-xs text-gray-500 flex-shrink-0 ml-2">2h</span>
                </div>
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div class="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <i class="fas fa-edit text-blue-600 text-sm"></i>
                    </div>
                    <div class="flex-grow min-w-0">
                        <p class="font-medium text-gray-800 text-sm">Protokoll aktualisiert</p>
                        <p class="text-xs text-gray-600 truncate">Erste Pinsets bei Shiitake sichtbar</p>
                    </div>
                    <span class="text-xs text-gray-500 flex-shrink-0 ml-2">1d</span>
                </div>
            </div>
        </div>
    `;
}

function getZuchtprotokollContent() {
    return `
        <div class="mb-6">
            <button class="btn-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center">
                <i class="fas fa-plus mr-2"></i>
                Neues Zuchtprotokoll erstellen
            </button>
        </div>

        <!-- Protocols Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Austernpilz Protokoll -->
            <div class="card p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-green-100 p-2 rounded-lg">
                        <i class="fas fa-seedling text-green-600"></i>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                        Einfach
                    </span>
                </div>
                
                <h3 class="font-bold text-gray-800 text-lg mb-2">Austernpilz auf Stroh</h3>
                <p class="text-sm text-gray-600 mb-2">Pleurotus ostreatus</p>
                <p class="text-xs text-gray-500 mb-4">Strohpellets</p>
                
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Kolonisierung:</span>
                        <span class="font-medium">14 Tage</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Ertrag:</span>
                        <span class="font-medium">800g</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Erfolgsrate:</span>
                        <span class="font-medium">90%</span>
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100">
                    <button class="w-full btn-primary text-white py-2 px-4 rounded-lg text-sm hover:opacity-90">
                        Protokoll starten
                    </button>
                </div>
            </div>

            <!-- Shiitake Protokoll -->
            <div class="card p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-yellow-100 p-2 rounded-lg">
                        <i class="fas fa-seedling text-yellow-600"></i>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full text-yellow-600 bg-yellow-100">
                        Mittel
                    </span>
                </div>
                
                <h3 class="font-bold text-gray-800 text-lg mb-2">Shiitake auf Hartholz</h3>
                <p class="text-sm text-gray-600 mb-2">Lentinula edodes</p>
                <p class="text-xs text-gray-500 mb-4">Hartholzspäne</p>
                
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Kolonisierung:</span>
                        <span class="font-medium">45 Tage</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Ertrag:</span>
                        <span class="font-medium">600g</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Erfolgsrate:</span>
                        <span class="font-medium">75%</span>
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100">
                    <button class="w-full btn-primary text-white py-2 px-4 rounded-lg text-sm hover:opacity-90">
                        Protokoll starten
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getWikiContent() {
    return `
        <div class="mb-6">
            <div class="flex flex-wrap gap-2">
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Alle</button>
                <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Pilze</button>
                <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Substrate</button>
                <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Techniken</button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="card p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="bg-green-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-seedling text-green-600"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800">Austernpilz</h3>
                        <p class="text-sm text-gray-600">Pleurotus ostreatus</p>
                    </div>
                </div>
                <p class="text-sm text-gray-700 mb-4">Einfach zu kultivierender Pilz mit hoher Erfolgsrate. Wächst auf verschiedenen Substraten.</p>
                <div class="flex justify-between text-xs text-gray-500">
                    <span>Schwierigkeit: Einfach</span>
                    <span>Ertrag: Hoch</span>
                </div>
            </div>

            <div class="card p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="bg-yellow-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-seedling text-yellow-600"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800">Shiitake</h3>
                        <p class="text-sm text-gray-600">Lentinula edodes</p>
                    </div>
                </div>
                <p class="text-sm text-gray-700 mb-4">Beliebter Speisepilz mit medizinischen Eigenschaften. Benötigt Hartholz-Substrat.</p>
                <div class="flex justify-between text-xs text-gray-500">
                    <span>Schwierigkeit: Mittel</span>
                    <span>Ertrag: Mittel</span>
                </div>
            </div>

            <div class="card p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="bg-blue-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-leaf text-blue-600"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800">Strohpellets</h3>
                        <p class="text-sm text-gray-600">Substrat</p>
                    </div>
                </div>
                <p class="text-sm text-gray-700 mb-4">Kostengünstiges und effektives Substrat für Austernpilze. Einfach zu sterilisieren.</p>
                <div class="flex justify-between text-xs text-gray-500">
                    <span>Typ: Substrat</span>
                    <span>Kosten: Niedrig</span>
                </div>
            </div>
        </div>
    `;
}

function getInventarContent() {
    return `
        <div class="mb-6">
            <button class="btn-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center">
                <i class="fas fa-plus mr-2"></i>
                Neuen Artikel hinzufügen
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-seedling text-green-600 mr-2"></i>
                    Substrate
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-gray-800">Strohpellets</p>
                            <p class="text-sm text-gray-600">15kg Säcke</p>
                        </div>
                        <span class="font-bold text-green-600">8 Stück</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-gray-800">Hartholzspäne</p>
                            <p class="text-sm text-gray-600">10kg Säcke</p>
                        </div>
                        <span class="font-bold text-yellow-600">3 Stück</span>
                    </div>
                </div>
            </div>

            <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-flask text-blue-600 mr-2"></i>
                    Kulturen
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-gray-800">Austernpilz Flüssigkultur</p>
                            <p class="text-sm text-gray-600">20ml Spritzen</p>
                        </div>
                        <span class="font-bold text-green-600">5 Stück</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-gray-800">Shiitake Kultur</p>
                            <p class="text-sm text-gray-600">Agar-Platten</p>
                        </div>
                        <span class="font-bold text-red-600">1 Stück</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getKulturenContent() {
    return `
        <div class="mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button class="btn-primary text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center">
                    <i class="fas fa-plus mr-2"></i>
                    Neue Kultur
                </button>
                <button class="btn-secondary px-4 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center">
                    <i class="fas fa-microscope mr-2"></i>
                    Agar-Platte
                </button>
                <button class="btn-secondary px-4 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center">
                    <i class="fas fa-syringe mr-2"></i>
                    Spritze
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="card p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-green-100 p-2 rounded-lg">
                        <i class="fas fa-seedling text-green-600"></i>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                        Aktiv
                    </span>
                </div>
                <h3 class="font-bold text-gray-800 text-lg mb-2">Austernpilz LC</h3>
                <p class="text-sm text-gray-600 mb-4">Flüssigkultur in 500ml Glas</p>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Erstellt:</span>
                        <span class="font-medium">15.09.2024</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Generation:</span>
                        <span class="font-medium">G3</span>
                    </div>
                </div>
            </div>

            <div class="card p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-yellow-100 p-2 rounded-lg">
                        <i class="fas fa-microscope text-yellow-600"></i>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full text-yellow-600 bg-yellow-100">
                        Wachsend
                    </span>
                </div>
                <h3 class="font-bold text-gray-800 text-lg mb-2">Shiitake Agar</h3>
                <p class="text-sm text-gray-600 mb-4">MEA-Agar Petrischale</p>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Erstellt:</span>
                        <span class="font-medium">20.09.2024</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Generation:</span>
                        <span class="font-medium">G1</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getRechnerContent() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-balance-scale text-green-600 mr-2"></i>
                    Substrat-Rechner
                </h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Substrat-Typ</label>
                        <select class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option>Strohpellets</option>
                            <option>Hartholzspäne</option>
                            <option>Kaffeesatz</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Gewünschte Menge (kg)</label>
                        <input type="number" value="5" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <button class="w-full btn-primary text-white py-3 px-4 rounded-lg hover:opacity-90">
                        <i class="fas fa-calculator mr-2"></i>
                        Berechnen
                    </button>
                    
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-green-800 mb-2">Ergebnis:</h4>
                        <p class="text-sm text-green-700">5kg Strohpellets benötigen ca. 15L Wasser</p>
                        <p class="text-sm text-green-700">Ergibt ca. 20kg feuchtes Substrat</p>
                    </div>
                </div>
            </div>

            <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-tint text-blue-600 mr-2"></i>
                    Tinktur-Rechner
                </h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Pilz-Art</label>
                        <select class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Reishi</option>
                            <option>Löwenmähne</option>
                            <option>Cordyceps</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Pilzmenge (g)</label>
                        <input type="number" value="50" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Alkohol % (Ethanol)</label>
                        <input type="number" value="40" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    
                    <button class="w-full btn-secondary py-3 px-4 rounded-lg hover:opacity-90">
                        <i class="fas fa-calculator mr-2"></i>
                        Berechnen
                    </button>
                    
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-blue-800 mb-2">Ergebnis:</h4>
                        <p class="text-sm text-blue-700">50g getrocknete Pilze + 250ml 40% Ethanol</p>
                        <p class="text-sm text-blue-700">Ziehzeit: 2-4 Wochen</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getEinstellungenContent() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-user text-gray-600 mr-2"></i>
                    Benutzereinstellungen
                </h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input type="text" value="Pilz-Enthusiast" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" value="info@pilzzucht.de" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sprache</label>
                        <select class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option>Deutsch</option>
                            <option>English</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-bell text-yellow-600 mr-2"></i>
                    Benachrichtigungen
                </h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium text-gray-800">Ernte-Erinnerungen</p>
                            <p class="text-sm text-gray-600">Benachrichtigung bei Erntezeit</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium text-gray-800">Protokoll-Updates</p>
                            <p class="text-sm text-gray-600">Tägliche Erinnerungen</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍄 Mushroom Manager DOM loaded');
    
    // Setup desktop navigation
    const desktopNavItems = document.querySelectorAll('#desktopNavigation .nav-item');
    desktopNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.getAttribute('data-section');
            loadSection(section);
        });
    });

    // Setup mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.getAttribute('data-section');
            loadSection(section);
        });
    });
    
    // Load dashboard by default
    loadSection('dashboard');
    
    console.log('✅ Mushroom Manager initialized successfully!');
});