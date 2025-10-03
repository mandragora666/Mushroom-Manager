// 🍄 Mushroom Manager - Original Mockup Design
console.log('🍄 Starting Mushroom Manager (Original Mockup)...');

// Global navigation function
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
            title = 'Protokolle';
            description = 'Ihre Zucht-Protokolle verwalten';
            contentHtml = getProtokollContent();
            break;
        case 'wiki':
            title = 'Wiki';
            description = 'Pilzsorten-Datenbank';
            contentHtml = getWikiContent();
            break;
        case 'inventar':
            title = 'Inventar';
            description = 'Lagerbestand verwalten';
            contentHtml = getInventarContent();
            break;
        case 'kulturen':
            title = 'Kulturen';
            description = 'Kulturen verwalten';
            contentHtml = getKulturenContent();
            break;
        case 'rechner':
            title = 'Rechner';
            description = 'Berechnungen';
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
        item.classList.remove('active');
        item.querySelectorAll('i, span').forEach(el => {
            el.classList.remove('text-blue-600');
            el.classList.add('text-gray-400');
        });
        
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
            item.querySelectorAll('i, span').forEach(el => {
                el.classList.remove('text-gray-400');
                el.classList.add('text-blue-600');
            });
        }
    });
}

// Dashboard Content
function getDashboardContent() {
    return `
        <!-- Statistik-Karten -->
        <div class="grid grid-cols-2 gap-4 mb-6">
            <!-- Protokolle -->
            <div class="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="loadSection('zuchtprotokoll')">
                <div class="flex items-center mb-3">
                    <div class="bg-blue-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-clipboard-list text-blue-600"></i>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900" id="statsProtocols">2</div>
                        <div class="text-sm text-gray-600">Protokolle</div>
                    </div>
                </div>
            </div>
            
            <!-- Wiki Einträge -->
            <div class="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="loadSection('wiki')">
                <div class="flex items-center mb-3">
                    <div class="bg-green-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-book-open text-green-600"></i>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900" id="statsWiki">5</div>
                        <div class="text-sm text-gray-600">Wiki Einträge</div>
                    </div>
                </div>
            </div>
            
            <!-- Inventar -->
            <div class="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="loadSection('inventar')">
                <div class="flex items-center mb-3">
                    <div class="bg-purple-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-boxes text-purple-600"></i>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900" id="statsInventory">12</div>
                        <div class="text-sm text-gray-600">Artikel</div>
                    </div>
                </div>
            </div>
            
            <!-- Kulturen -->
            <div class="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="loadSection('kulturen')">
                <div class="flex items-center mb-3">
                    <div class="bg-orange-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-flask text-orange-600"></i>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900" id="statsCultures">8</div>
                        <div class="text-sm text-gray-600">Kulturen</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Schnellaktionen -->
        <div class="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div class="flex items-center mb-4">
                <i class="fas fa-plus text-green-600 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Schnellaktionen</h3>
            </div>
            
            <div class="space-y-3">
                <button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-medium flex items-center justify-center hover:shadow-lg transition-all"
                        onclick="loadSection('zuchtprotokoll')">
                    <i class="fas fa-clipboard-list mr-3"></i>
                    Neues Protokoll
                </button>
                
                <button class="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white p-4 rounded-xl font-medium flex items-center justify-center hover:shadow-lg transition-all"
                        onclick="loadSection('wiki')">
                    <i class="fas fa-book-open mr-3"></i>
                    Wiki-Eintrag
                </button>
            </div>
        </div>

        <!-- Letzte Aktivitäten -->
        <div class="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div class="flex items-center mb-4">
                <i class="fas fa-history text-gray-500 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Letzte Aktivitäten</h3>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center">
                    <div class="bg-green-100 p-2 rounded-lg mr-4">
                        <i class="fas fa-plus text-green-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-900">Neues Zuchtprotokoll erstellt</p>
                        <p class="text-sm text-gray-500">Black Pearl - Pleurotus ostreatus</p>
                    </div>
                    <span class="text-sm text-gray-400">2h</span>
                </div>
                
                <div class="flex items-center">
                    <div class="bg-blue-100 p-2 rounded-lg mr-4">
                        <i class="fas fa-edit text-blue-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-900">Protokoll aktualisiert</p>
                        <p class="text-sm text-gray-500">Erste Pinsets bei Shiitake sichtbar</p>
                    </div>
                    <span class="text-sm text-gray-400">1d</span>
                </div>
            </div>
        </div>

        <!-- Aktuelle Bedingungen -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
            <div class="flex items-center mb-4">
                <i class="fas fa-thermometer-half text-orange-500 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Aktuelle Bedingungen</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600" id="dashTemp">22°C</div>
                    <div class="text-sm text-gray-500">Temperatur</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-500" id="dashHum">85%</div>
                    <div class="text-sm text-gray-500">Luftfeuchtigkeit</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600" id="dashCO2">650</div>
                    <div class="text-sm text-gray-500">CO2 ppm</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-red-500" id="dashVent">6x</div>
                    <div class="text-sm text-gray-500">Belüftung/h</div>
                </div>
            </div>
        </div>
    `;
}

// Protokoll Content
function getProtokollContent() {
    return `
        <!-- Header with New Button -->
        <div class="mb-6">
            <button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-medium flex items-center justify-center hover:shadow-lg transition-all">
                <i class="fas fa-plus mr-3"></i>
                Neues Protokoll
            </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <div class="relative">
                <input type="text" placeholder="Suchen..." class="w-full p-4 pl-12 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500">
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
        </div>

        <!-- Protocol Cards -->
        <div class="space-y-4">
            <!-- Black Pearl Protocol -->
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-900">Black Pearl</h3>
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Fruchtung
                    </span>
                </div>
                
                <p class="text-gray-600 mb-2">Pleurotus ostreatus - Hybrid</p>
                <p class="text-sm text-gray-500 mb-4">ID: BP03 • Erstellt: 15.01.2025</p>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500">Züchter</p>
                        <p class="font-medium">Ullrich Krüger</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Substrat</p>
                        <p class="font-medium">Masters Mix</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500">Blockgröße</p>
                        <p class="font-medium">2,5 kg</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">BE</p>
                        <p class="font-medium text-green-600">106%</p>
                    </div>
                </div>
                
                <!-- Progress -->
                <div class="mb-4">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-600">Fruchtungsphase</span>
                        <span class="text-gray-500">Tag 14/20</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 70%"></div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button class="flex items-center text-gray-600">
                            <i class="fas fa-camera mr-2"></i>
                            <span class="text-sm">8</span>
                        </button>
                        <button class="flex items-center text-gray-600">
                            <i class="fas fa-calendar mr-2"></i>
                            <span class="text-sm">Heute</span>
                        </button>
                        <button class="flex items-center text-blue-600">
                            <i class="fas fa-qrcode mr-2"></i>
                            <span class="text-sm">QR</span>
                        </button>
                    </div>
                    <button class="flex items-center text-gray-600">
                        <i class="fas fa-download mr-2"></i>
                        <span class="text-sm">Export</span>
                    </button>
                </div>
            </div>
            
            <!-- Shiitake Protocol -->
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-900">Shiitake Premium</h3>
                    <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        Körnerbrut
                    </span>
                </div>
                
                <p class="text-gray-600 mb-2">Lentinula edodes</p>
                <p class="text-sm text-gray-500 mb-4">ID: SH12 • Erstellt: 10.01.2025</p>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500">Züchter</p>
                        <p class="font-medium">Eigenzucht</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Substrat</p>
                        <p class="font-medium">Buche/Eiche</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500">Blockgröße</p>
                        <p class="font-medium">1,5 kg</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Tag</p>
                        <p class="font-medium">8/15</p>
                    </div>
                </div>
                
                <!-- Progress -->
                <div class="mb-4">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-600">Durchwachsphase</span>
                        <span class="text-gray-500">Tag 8/15</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: 53%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Wiki Content
function getWikiContent() {
    return `
        <!-- Header -->
        <div class="mb-6">
            <button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-medium flex items-center justify-center hover:shadow-lg transition-all">
                <i class="fas fa-plus mr-3"></i>
                Neue Pilzart
            </button>
        </div>

        <!-- View Toggle -->
        <div class="flex mb-6">
            <button class="flex items-center px-4 py-2 bg-gray-900 text-white rounded-l-xl text-sm font-medium">
                <i class="fas fa-th mr-2"></i>
                Karten
            </button>
            <button class="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-r-xl text-sm font-medium">
                <i class="fas fa-list mr-2"></i>
                Liste
            </button>
        </div>

        <!-- Mushroom Cards -->
        <div class="space-y-6">
            <!-- Pleurotus ostreatus -->
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="bg-green-100 p-3 rounded-xl mr-4">
                            <i class="fas fa-seedling text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Pleurotus ostreatus</h3>
                            <p class="text-gray-600">Austernpilz</p>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium text-center">
                            Winter
                        </span>
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium text-center">
                            Einfach
                        </span>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <p class="text-gray-500">Temperatur:</p>
                        <p class="font-medium">15-20°C</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Luftfeuchtigkeit:</p>
                        <p class="font-medium">85-95%</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Substrat:</p>
                        <p class="font-medium">Masters Mix</p>
                    </div>
                    <div class="flex items-center">
                        <p class="text-gray-500 mr-2">Kälteschock:</p>
                        <i class="fas fa-check text-green-600"></i>
                        <p class="font-medium ml-1">Ja</p>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-star text-yellow-500 mr-1"></i>
                        <span class="text-sm font-medium">95% Erfolg</span>
                    </div>
                    <button class="text-blue-600 text-sm font-medium flex items-center">
                        Details
                        <i class="fas fa-chevron-right ml-1"></i>
                    </button>
                </div>
            </div>
            
            <!-- Lentinula edodes -->
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="bg-yellow-100 p-3 rounded-xl mr-4">
                            <i class="fas fa-tree text-yellow-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Lentinula edodes</h3>
                            <p class="text-gray-600">Shiitake</p>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium text-center">
                            Herbst
                        </span>
                        <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium text-center">
                            Mittel
                        </span>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <p class="text-gray-500">Temperatur:</p>
                        <p class="font-medium">12-18°C</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Luftfeuchtigkeit:</p>
                        <p class="font-medium">80-90%</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Substrat:</p>
                        <p class="font-medium">Buche/Eiche</p>
                    </div>
                    <div class="flex items-center">
                        <p class="text-gray-500 mr-2">Scratching:</p>
                        <i class="fas fa-check text-green-600"></i>
                        <p class="font-medium ml-1">Ja</p>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-star text-yellow-500 mr-1"></i>
                        <span class="text-sm font-medium">78% Erfolg</span>
                    </div>
                    <button class="text-blue-600 text-sm font-medium flex items-center">
                        Details
                        <i class="fas fa-chevron-right ml-1"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Inventar Content
function getInventarContent() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-boxes text-gray-400 text-4xl mb-4"></i>
            <h3 class="text-lg font-medium text-gray-600 mb-2">Inventar</h3>
            <p class="text-gray-500">Hier können Sie Ihr Inventar verwalten</p>
        </div>
    `;
}

// Kulturen Content
function getKulturenContent() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-flask text-gray-400 text-4xl mb-4"></i>
            <h3 class="text-lg font-medium text-gray-600 mb-2">Kulturen</h3>
            <p class="text-gray-500">Hier können Sie Ihre Kulturen verwalten</p>
        </div>
    `;
}

// Rechner Content
function getRechnerContent() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-calculator text-gray-400 text-4xl mb-4"></i>
            <h3 class="text-lg font-medium text-gray-600 mb-2">Rechner</h3>
            <p class="text-gray-500">Hier finden Sie nützliche Berechnungen</p>
        </div>
    `;
}

// Einstellungen Content
function getEinstellungenContent() {
    return `
        <!-- Benutzereinstellungen -->
        <div class="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div class="flex items-center mb-4">
                <i class="fas fa-user text-gray-600 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Benutzereinstellungen</h3>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" value="Pilzzüchter Demo" 
                           class="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                    <input type="email" value="demo@mushroom-manager.com" 
                           class="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
        </div>

        <!-- Design & Theme -->
        <div class="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div class="flex items-center mb-4">
                <i class="fas fa-palette text-gray-600 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Design & Theme</h3>
            </div>
            
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium text-gray-900">Dark Mode</p>
                    <p class="text-sm text-gray-500">Zur Dark Theme Version wechseln</p>
                </div>
                <button class="bg-gray-800 text-white px-6 py-3 rounded-xl font-medium">
                    Dark Theme testen
                </button>
            </div>
        </div>

        <!-- Daten Export -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
            <div class="flex items-center mb-4">
                <i class="fas fa-download text-gray-600 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Daten Export</h3>
            </div>
            
            <div class="space-y-3">
                <button class="w-full bg-blue-600 text-white p-4 rounded-xl font-medium flex items-center justify-center">
                    <i class="fas fa-file-pdf mr-3"></i>
                    PDF exportieren
                </button>
                
                <button class="w-full bg-green-600 text-white p-4 rounded-xl font-medium flex items-center justify-center">
                    <i class="fas fa-file-csv mr-3"></i>
                    CSV exportieren
                </button>
            </div>
        </div>
    `;
}

// Load dashboard data from API
async function loadDashboardData() {
    try {
        console.log('📊 Loading dashboard data from API...');
        
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
            const stats = await response.json();
            console.log('✅ Dashboard stats loaded:', stats);
            
            // Update Statistik-Karten
            const statsProtocols = document.getElementById('statsProtocols');
            const statsWiki = document.getElementById('statsWiki');
            const statsInventory = document.getElementById('statsInventory');
            const statsCultures = document.getElementById('statsCultures');
            
            if (statsProtocols) statsProtocols.textContent = stats.activeProtocols || 2;
            if (statsWiki) statsWiki.textContent = stats.mushroomSpecies || 5;
            if (statsInventory) statsInventory.textContent = stats.inventoryItems || 12;
            if (statsCultures) statsCultures.textContent = stats.cultures || 8;
            
            // Update Umwelt-Bedingungen
            const dashTemp = document.getElementById('dashTemp');
            const dashHum = document.getElementById('dashHum');
            const dashCO2 = document.getElementById('dashCO2');
            const dashVent = document.getElementById('dashVent');
            
            if (dashTemp) dashTemp.textContent = (stats.temperature || 22) + '°C';
            if (dashHum) dashHum.textContent = (stats.humidity || 85) + '%';
            if (dashCO2) dashCO2.textContent = stats.co2 || 650;
            if (dashVent) dashVent.textContent = (stats.ventilation || 6) + 'x';
            
        } else {
            console.warn('⚠️ Failed to load dashboard stats, using fallback data');
        }
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
    }
}

// Setup navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍄 Mushroom Manager Mockup DOM loaded');
    
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
    
    console.log('✅ Mushroom Manager Mockup initialized successfully!');
});