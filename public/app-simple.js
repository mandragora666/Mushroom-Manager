// 🍄 Mushroom Manager - Simplified Version (No API Calls)
console.log('🍄 Starting Mushroom Manager (Simple Version)...');

class SimpleMushroomManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        console.log('✅ Initializing Simple Mushroom Manager');
        this.setupNavigation();
        this.loadSection('dashboard');
    }

    setupNavigation() {
        // Desktop navigation
        const desktopNavItems = document.querySelectorAll('#desktopNavigation .nav-item');
        desktopNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.loadSection(section);
                this.setActiveDesktopNav(e.currentTarget);
            });
        });

        // Mobile navigation
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.loadSection(section);
                this.setActiveMobileNav(e.currentTarget);
            });
        });
    }

    setActiveDesktopNav(activeItem) {
        document.querySelectorAll('#desktopNavigation .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    setActiveMobileNav(activeItem) {
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active', 'text-green-600');
            item.classList.add('text-gray-600');
        });
        activeItem.classList.remove('text-gray-600');
        activeItem.classList.add('active', 'text-green-600');
    }

    loadSection(section) {
        console.log('📄 Loading section:', section);
        this.currentSection = section;
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
                contentHtml = this.getDashboardContent();
                break;
            case 'zuchtprotokoll':
                title = 'Zuchtprotokoll';
                description = 'Dokumentation Ihrer Pilzzucht-Projekte';
                contentHtml = this.getZuchtprotokollContent();
                break;
            case 'wiki':
                title = 'Wiki & Substrate';
                description = 'Pilzsorten und Substratrezepte Datenbank';
                contentHtml = this.getWikiContent();
                break;
            case 'inventar':
                title = 'Inventarverwaltung';
                description = 'Materialien und Lagerbestand verwalten';
                contentHtml = this.getInventarContent();
                break;
            case 'kulturen':
                title = 'Kulturen';
                description = 'Agar, Flüssigkulturen und Sporensspritzen';
                contentHtml = this.getKulturenContent();
                break;
            case 'rechner':
                title = 'Rechner';
                description = 'Substrat- und Tinkturberechnung';
                contentHtml = this.getRechnerContent();
                break;
            case 'einstellungen':
                title = 'Einstellungen';
                description = 'App-Konfiguration und Benutzereinstellungen';
                contentHtml = this.getEinstellungenContent();
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
    }

    // ===== DASHBOARD (With API Integration) =====
    getDashboardContent() {
        // Load dashboard with live data
        this.loadDashboardData();
        
        return \`
            <!-- Quick Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <div class="card p-4 lg:p-6 cursor-pointer" onclick="app.loadSection('zuchtprotokoll')">
                    <div class="flex items-center justify-between mb-3 lg:mb-4">
                        <div class="bg-green-100 p-2 lg:p-3 rounded-lg">
                            <i class="fas fa-clipboard-list text-green-600 text-lg lg:text-xl"></i>
                        </div>
                        <span id="activeProtocols" class="text-xl lg:text-2xl font-bold text-gray-800">12</span>
                    </div>
                    <h3 class="font-semibold text-gray-800 text-sm lg:text-base">Aktive Protokolle</h3>
                    <p class="text-xs lg:text-sm text-gray-600">Laufende Zuchtprojekte</p>
                </div>

                <div class="card p-4 lg:p-6 cursor-pointer" onclick="app.loadSection('wiki')">
                    <div class="flex items-center justify-between mb-3 lg:mb-4">
                        <div class="bg-purple-100 p-2 lg:p-3 rounded-lg">
                            <i class="fas fa-seedling text-purple-600 text-lg lg:text-xl"></i>
                        </div>
                        <span id="mushroomSpecies" class="text-xl lg:text-2xl font-bold text-gray-800">28</span>
                    </div>
                    <h3 class="font-semibold text-gray-800 text-sm lg:text-base">Pilzsorten</h3>
                    <p class="text-xs lg:text-sm text-gray-600">In der Wiki-Datenbank</p>
                </div>

                <div class="card p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
                    <div class="flex items-center justify-between mb-3 lg:mb-4">
                        <div class="bg-blue-100 p-2 lg:p-3 rounded-lg">
                            <i class="fas fa-chart-line text-blue-600 text-lg lg:text-xl"></i>
                        </div>
                        <span id="successRate" class="text-xl lg:text-2xl font-bold text-gray-800">85%</span>
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
                            onclick="app.loadSection('zuchtprotokoll')">
                        <i class="fas fa-clipboard-list mr-2"></i>
                        Neues Protokoll
                    </button>
                    <button class="btn-secondary w-full py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                            onclick="app.loadSection('wiki')">
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
        \`;
    }

    // Load dashboard data from API
    async loadDashboardData() {
        try {
            console.log('📊 Loading dashboard data from API...');
            
            // Fetch dashboard stats
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
            // Fallback data is already in the HTML
        }
    }

    // ===== ZUCHTPROTOKOLL =====
    getZuchtprotokollContent() {
        return \`
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

                <!-- Champignon Protokoll -->
                <div class="card p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-yellow-100 p-2 rounded-lg">
                            <i class="fas fa-seedling text-yellow-600"></i>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full text-yellow-600 bg-yellow-100">
                            Mittel
                        </span>
                    </div>
                    
                    <h3 class="font-bold text-gray-800 text-lg mb-2">Champignon traditionell</h3>
                    <p class="text-sm text-gray-600 mb-2">Agaricus bisporus</p>
                    <p class="text-xs text-gray-500 mb-4">Pferdemist-Kompost</p>
                    
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Kolonisierung:</span>
                            <span class="font-medium">21 Tage</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Ertrag:</span>
                            <span class="font-medium">1200g</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Erfolgsrate:</span>
                            <span class="font-medium">80%</span>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <button class="w-full btn-primary text-white py-2 px-4 rounded-lg text-sm hover:opacity-90">
                            Protokoll starten
                        </button>
                    </div>
                </div>
            </div>
        \`;
    }

    // ===== WIKI =====
    getWikiContent() {
        return \`
            <!-- Categories Tabs -->
            <div class="mb-6">
                <div class="flex flex-wrap gap-2">
                    <button class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
                        Alle Artikel
                    </button>
                    <button class="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                        Kultivierung
                    </button>
                    <button class="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                        Substrate
                    </button>
                    <button class="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                        Troubleshooting
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Wiki Articles -->
                <div class="lg:col-span-2">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-book-open text-green-600 mr-2"></i>
                        Wiki-Artikel
                    </h2>
                    
                    <div class="space-y-4">
                        <!-- Sterilisation Article -->
                        <div class="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <div class="flex items-start justify-between mb-3">
                                <h3 class="font-bold text-gray-800 text-lg">Sterilisation von Substraten</h3>
                                <i class="fas fa-star text-yellow-500"></i>
                            </div>
                            <p class="text-gray-600 text-sm mb-3">Lerne, wie du Substrate richtig sterilisierst für erfolgreiche Pilzzucht.</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span class="px-2 py-1 bg-gray-100 rounded-full">Substrate</span>
                                <span>156 Aufrufe</span>
                            </div>
                        </div>

                        <!-- pH-Wert Article -->
                        <div class="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <div class="flex items-start justify-between mb-3">
                                <h3 class="font-bold text-gray-800 text-lg">pH-Wert bei Pilzsubstraten</h3>
                            </div>
                            <p class="text-gray-600 text-sm mb-3">Der pH-Wert ist entscheidend für erfolgreiche Pilzzucht.</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span class="px-2 py-1 bg-gray-100 rounded-full">Kultivierung</span>
                                <span>89 Aufrufe</span>
                            </div>
                        </div>

                        <!-- Kontamination Article -->
                        <div class="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <div class="flex items-start justify-between mb-3">
                                <h3 class="font-bold text-gray-800 text-lg">Kontamination erkennen</h3>
                                <i class="fas fa-star text-yellow-500"></i>
                            </div>
                            <p class="text-gray-600 text-sm mb-3">Lerne, Kontaminationen früh zu erkennen und zu vermeiden.</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span class="px-2 py-1 bg-gray-100 rounded-full">Troubleshooting</span>
                                <span>234 Aufrufe</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mushroom Species -->
                <div class="lg:col-span-1">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-seedling text-green-600 mr-2"></i>
                        Pilzsorten
                    </h2>
                    
                    <div class="space-y-3">
                        <!-- Austernpilz -->
                        <div class="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-semibold text-gray-800">Austernpilz</h4>
                                <span class="px-2 py-1 text-xs rounded-full text-green-600 bg-green-100">
                                    Einfach
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 italic mb-2">Pleurotus ostreatus</p>
                            <p class="text-xs text-gray-500">Sehr anfängerfreundlicher Pilz mit hoher Erfolgsquote...</p>
                        </div>

                        <!-- Shiitake -->
                        <div class="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-semibold text-gray-800">Shiitake</h4>
                                <span class="px-2 py-1 text-xs rounded-full text-yellow-600 bg-yellow-100">
                                    Mittel
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 italic mb-2">Lentinula edodes</p>
                            <p class="text-xs text-gray-500">Beliebter Speisepilz mit medizinischen Eigenschaften...</p>
                        </div>

                        <!-- Reishi -->
                        <div class="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-semibold text-gray-800">Reishi</h4>
                                <span class="px-2 py-1 text-xs rounded-full text-red-600 bg-red-100">
                                    Schwer
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 italic mb-2">Ganoderma lucidum</p>
                            <p class="text-xs text-gray-500">Heilpilz mit langer Wachstumszeit...</p>
                        </div>
                    </div>
                </div>
            </div>
        \`;
    }

    // ===== OTHER SECTIONS =====
    getInventarContent() {
        return \`
            <div class="text-center py-12">
                <div class="bg-blue-100 p-6 rounded-lg inline-block mb-4">
                    <i class="fas fa-boxes text-blue-600 text-3xl"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Inventarverwaltung</h2>
                <p class="text-gray-600 mb-6">Diese Funktion ist in Entwicklung und wird bald verfügbar sein.</p>
            </div>
        \`;
    }

    getKulturenContent() {
        return \`
            <div class="text-center py-12">
                <div class="bg-purple-100 p-6 rounded-lg inline-block mb-4">
                    <i class="fas fa-flask text-purple-600 text-3xl"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Kulturen-Management</h2>
                <p class="text-gray-600 mb-6">Verwalten Sie Ihre Agar-Platten, Flüssigkulturen und Sporensspritzen.</p>
            </div>
        \`;
    }

    getRechnerContent() {
        return \`
            <div class="text-center py-12">
                <div class="bg-orange-100 p-6 rounded-lg inline-block mb-4">
                    <i class="fas fa-calculator text-orange-600 text-3xl"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Rechner & Tools</h2>
                <p class="text-gray-600 mb-6">Berechnen Sie Substratmengen, Nährlösungen und Tinkturdosierungen.</p>
            </div>
        \`;
    }

    getEinstellungenContent() {
        return \`
            <div class="space-y-6">
                <div class="card p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">
                        <i class="fas fa-user-cog text-gray-600 mr-2"></i>
                        Benutzereinstellungen
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Sprache</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option>Deutsch</option>
                                <option>English</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Zeitzone</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option>Europa/Berlin</option>
                                <option>UTC</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="card p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">
                        <i class="fas fa-info-circle text-gray-600 mr-2"></i>
                        Über Mushroom Manager
                    </h3>
                    <div class="text-sm text-gray-600 space-y-2">
                        <p><strong>Version:</strong> 1.0.0</p>
                        <p><strong>Entwickelt mit:</strong> Hono + Cloudflare Pages</p>
                        <p><strong>Datenbank:</strong> Cloudflare D1</p>
                        <p><strong>Status:</strong> ✅ Funktionsfähig</p>
                    </div>
                </div>
            </div>
        \`;
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍄 Starting Simple Mushroom Manager...');
    try {
        app = new SimpleMushroomManager();
        // Global app reference for onclick handlers
        window.app = app;
        console.log('✅ Simple Mushroom Manager initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Simple Mushroom Manager:', error);
    }
});