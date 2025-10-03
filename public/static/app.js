// 🍄 Mushroom Manager - Production JavaScript
class MushroomManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        this.setupNavigation();
        await this.loadSection('dashboard');
    }

    setupNavigation() {
        // Desktop navigation
        const desktopNavItems = document.querySelectorAll('#desktopNavigation .nav-item');
        desktopNavItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                await this.loadSection(section);
                this.setActiveDesktopNav(e.currentTarget);
            });
        });

        // Mobile navigation
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                await this.loadSection(section);
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

    async loadSection(section) {
        this.currentSection = section;
        const content = document.getElementById('content');
        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');
        const pageTitleMobile = document.getElementById('pageTitleMobile');
        const pageDescriptionMobile = document.getElementById('pageDescriptionMobile');

        // Show loading
        content.innerHTML = \`
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Lade \${this.getSectionTitle(section)}...</p>
            </div>
        \`;

        let title, description, contentHtml;

        try {
            switch(section) {
                case 'dashboard':
                    title = 'Dashboard';
                    description = 'Übersicht Ihrer Pilzzucht-Aktivitäten';
                    contentHtml = await this.getDashboardContent();
                    break;
                case 'zuchtprotokoll':
                    title = 'Zuchtprotokoll';
                    description = 'Dokumentation Ihrer Pilzzucht-Projekte';
                    contentHtml = await this.getZuchtprotokollContent();
                    break;
                case 'wiki':
                    title = 'Wiki & Substrate';
                    description = 'Pilzsorten und Substratrezepte Datenbank';
                    contentHtml = await this.getWikiContent();
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

        } catch (error) {
            console.error('Error loading section:', error);
            content.innerHTML = \`
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                    <p class="text-red-600 font-medium">Fehler beim Laden der Sektion</p>
                    <p class="text-gray-600 text-sm mt-2">Bitte versuchen Sie es später erneut</p>
                </div>
            \`;
        }
    }

    getSectionTitle(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'zuchtprotokoll': 'Zuchtprotokoll',
            'wiki': 'Wiki',
            'inventar': 'Inventar',
            'kulturen': 'Kulturen',
            'rechner': 'Rechner',
            'einstellungen': 'Einstellungen'
        };
        return titles[section] || section;
    }

    // ===== DASHBOARD =====
    async getDashboardContent() {
        try {
            // Fetch dashboard data from API
            const [statsResponse, activitiesResponse] = await Promise.all([
                axios.get('/api/dashboard/stats'),
                axios.get('/api/dashboard/activities')
            ]);

            const stats = statsResponse.data;
            const activities = activitiesResponse.data;

            return \`
                <!-- Quick Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <div class="card p-4 lg:p-6 cursor-pointer" onclick="app.loadSection('zuchtprotokoll')">
                        <div class="flex items-center justify-between mb-3 lg:mb-4">
                            <div class="bg-green-100 p-2 lg:p-3 rounded-lg">
                                <i class="fas fa-clipboard-list text-green-600 text-lg lg:text-xl"></i>
                            </div>
                            <span class="text-xl lg:text-2xl font-bold text-gray-800">\${stats.activeProtocols}</span>
                        </div>
                        <h3 class="font-semibold text-gray-800 text-sm lg:text-base">Aktive Protokolle</h3>
                        <p class="text-xs lg:text-sm text-gray-600">Laufende Zuchtprojekte</p>
                    </div>

                    <div class="card p-4 lg:p-6 cursor-pointer" onclick="app.loadSection('wiki')">
                        <div class="flex items-center justify-between mb-3 lg:mb-4">
                            <div class="bg-purple-100 p-2 lg:p-3 rounded-lg">
                                <i class="fas fa-seedling text-purple-600 text-lg lg:text-xl"></i>
                            </div>
                            <span class="text-xl lg:text-2xl font-bold text-gray-800">\${stats.mushroomSpecies}</span>
                        </div>
                        <h3 class="font-semibold text-gray-800 text-sm lg:text-base">Pilzsorten</h3>
                        <p class="text-xs lg:text-sm text-gray-600">In der Wiki-Datenbank</p>
                    </div>

                    <div class="card p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
                        <div class="flex items-center justify-between mb-3 lg:mb-4">
                            <div class="bg-blue-100 p-2 lg:p-3 rounded-lg">
                                <i class="fas fa-chart-line text-blue-600 text-lg lg:text-xl"></i>
                            </div>
                            <span class="text-xl lg:text-2xl font-bold text-gray-800">\${stats.averageSuccessRate}%</span>
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
                        \${activities.length > 0 ? activities.map(activity => \`
                            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div class="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                                    <i class="fas fa-plus text-green-600 text-sm"></i>
                                </div>
                                <div class="flex-grow min-w-0">
                                    <p class="font-medium text-gray-800 text-sm">\${activity.title}</p>
                                    <p class="text-xs text-gray-600 truncate">\${activity.content || activity.batch_name}</p>
                                </div>
                                <span class="text-xs text-gray-500 flex-shrink-0 ml-2">\${this.formatRelativeTime(activity.created_at)}</span>
                            </div>
                        \`).join('') : \`
                            <div class="text-center py-8 text-gray-500">
                                <i class="fas fa-inbox text-3xl mb-2"></i>
                                <p>Noch keine Aktivitäten vorhanden</p>
                            </div>
                        \`}
                    </div>
                </div>
            \`;

        } catch (error) {
            console.error('Dashboard error:', error);
            return this.getFallbackDashboard();
        }
    }

    getFallbackDashboard() {
        return \`
            <!-- Fallback Dashboard Content -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                <div class="card p-4 lg:p-6">
                    <div class="text-center">
                        <div class="bg-green-100 p-3 rounded-lg inline-block mb-3">
                            <i class="fas fa-clipboard-list text-green-600 text-xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-800">Willkommen!</h3>
                        <p class="text-sm text-gray-600">Starten Sie Ihr erstes Zuchtprojekt</p>
                    </div>
                </div>
            </div>
        \`;
    }

    // ===== ZUCHTPROTOKOLL =====
    async getZuchtprotokollContent() {
        try {
            const response = await axios.get('/api/protocols');
            const protocols = response.data;

            return \`
                <div class="mb-6">
                    <button class="btn-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Neues Zuchtprotokoll erstellen
                    </button>
                </div>

                <!-- Protocols Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    \${protocols.length > 0 ? protocols.map(protocol => \`
                        <div class="card p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-center justify-between mb-4">
                                <div class="bg-green-100 p-2 rounded-lg">
                                    <i class="fas fa-seedling text-green-600"></i>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium rounded-full \${this.getDifficultyColor(protocol.difficulty)} bg-opacity-20">
                                    \${this.getDifficultyText(protocol.difficulty)}
                                </span>
                            </div>
                            
                            <h3 class="font-bold text-gray-800 text-lg mb-2">\${protocol.name}</h3>
                            <p class="text-sm text-gray-600 mb-2">\${protocol.species_name || 'Unbekannte Art'}</p>
                            <p class="text-xs text-gray-500 mb-4">\${protocol.substrate_name || 'Kein Substrat'}</p>
                            
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Kolonisierung:</span>
                                    <span class="font-medium">\${protocol.colonization_time_days || 0} Tage</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Ertrag:</span>
                                    <span class="font-medium">\${protocol.expected_yield_grams || 0}g</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Erfolgsrate:</span>
                                    <span class="font-medium">\${protocol.success_rate || 0}%</span>
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-gray-100">
                                <button class="w-full btn-primary text-white py-2 px-4 rounded-lg text-sm hover:opacity-90">
                                    Protokoll starten
                                </button>
                            </div>
                        </div>
                    \`).join('') : \`
                        <div class="col-span-full text-center py-12">
                            <div class="bg-gray-100 p-6 rounded-lg inline-block mb-4">
                                <i class="fas fa-clipboard-list text-gray-400 text-3xl"></i>
                            </div>
                            <h3 class="text-lg font-medium text-gray-800 mb-2">Keine Protokolle vorhanden</h3>
                            <p class="text-gray-600 mb-4">Erstellen Sie Ihr erstes Zuchtprotokoll</p>
                            <button class="btn-primary text-white px-6 py-3 rounded-lg">
                                <i class="fas fa-plus mr-2"></i>
                                Erstes Protokoll erstellen
                            </button>
                        </div>
                    \`}
                </div>
            \`;
        } catch (error) {
            console.error('Protocols error:', error);
            return '<p class="text-center text-red-600">Fehler beim Laden der Protokolle</p>';
        }
    }

    // ===== WIKI =====
    async getWikiContent() {
        try {
            const [articlesResponse, speciesResponse] = await Promise.all([
                axios.get('/api/wiki/articles'),
                axios.get('/api/species')
            ]);

            const articles = articlesResponse.data;
            const species = speciesResponse.data;

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
                            \${articles.length > 0 ? articles.map(article => \`
                                <div class="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                    <div class="flex items-start justify-between mb-3">
                                        <h3 class="font-bold text-gray-800 text-lg">\${article.title}</h3>
                                        \${article.featured ? '<i class="fas fa-star text-yellow-500"></i>' : ''}
                                    </div>
                                    <p class="text-gray-600 text-sm mb-3">\${article.excerpt || 'Kein Auszug verfügbar'}</p>
                                    <div class="flex items-center justify-between text-xs text-gray-500">
                                        <span class="px-2 py-1 bg-gray-100 rounded-full">\${article.category || 'Allgemein'}</span>
                                        <span>\${article.view_count || 0} Aufrufe</span>
                                    </div>
                                </div>
                            \`).join('') : \`
                                <div class="text-center py-8">
                                    <i class="fas fa-book-open text-gray-300 text-4xl mb-4"></i>
                                    <p class="text-gray-600">Keine Wiki-Artikel gefunden</p>
                                </div>
                            \`}
                        </div>
                    </div>

                    <!-- Mushroom Species -->
                    <div class="lg:col-span-1">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-seedling text-green-600 mr-2"></i>
                            Pilzsorten
                        </h2>
                        
                        <div class="space-y-3">
                            \${species.length > 0 ? species.map(specie => \`
                                <div class="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                                    <div class="flex items-center justify-between mb-2">
                                        <h4 class="font-semibold text-gray-800">\${specie.name}</h4>
                                        <span class="px-2 py-1 text-xs rounded-full \${this.getDifficultyColor(specie.difficulty_level)} bg-opacity-20">
                                            \${this.getDifficultyText(specie.difficulty_level)}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600 italic mb-2">\${specie.scientific_name || ''}</p>
                                    <p class="text-xs text-gray-500">\${(specie.description || '').substring(0, 100)}...</p>
                                </div>
                            \`).join('') : \`
                                <div class="text-center py-8">
                                    <i class="fas fa-seedling text-gray-300 text-3xl mb-4"></i>
                                    <p class="text-gray-600 text-sm">Keine Pilzsorten gefunden</p>
                                </div>
                            \`}
                        </div>
                    </div>
                </div>
            \`;
        } catch (error) {
            console.error('Wiki error:', error);
            return '<p class="text-center text-red-600">Fehler beim Laden des Wiki</p>';
        }
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
                <button class="btn-primary text-white px-6 py-3 rounded-lg">
                    <i class="fas fa-bell mr-2"></i>
                    Benachrichtigung aktivieren
                </button>
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
                <button class="btn-primary text-white px-6 py-3 rounded-lg">
                    <i class="fas fa-bell mr-2"></i>
                    Benachrichtigung aktivieren
                </button>
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
                <button class="btn-primary text-white px-6 py-3 rounded-lg">
                    <i class="fas fa-bell mr-2"></i>
                    Benachrichtigung aktivieren
                </button>
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
                        <i class="fas fa-bell text-gray-600 mr-2"></i>
                        Benachrichtigungen
                    </h3>
                    <div class="space-y-3">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-3" checked>
                            <span class="text-sm text-gray-700">E-Mail Benachrichtigungen</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-3">
                            <span class="text-sm text-gray-700">Push-Benachrichtigungen</span>
                        </label>
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
                    </div>
                </div>
            </div>
        \`;
    }

    // ===== HELPER FUNCTIONS =====
    getDifficultyColor(difficulty) {
        switch(difficulty) {
            case 'easy': return 'text-green-600';
            case 'medium': return 'text-yellow-600';
            case 'hard': return 'text-red-600';
            default: return 'text-gray-600';
        }
    }

    getDifficultyText(difficulty) {
        switch(difficulty) {
            case 'easy': return 'Einfach';
            case 'medium': return 'Mittel';
            case 'hard': return 'Schwer';
            default: return 'Unbekannt';
        }
    }

    formatRelativeTime(dateString) {
        if (!dateString) return 'Unbekannt';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return \`\${diffMins}m\`;
        if (diffHours < 24) return \`\${diffHours}h\`;
        return \`\${diffDays}d\`;
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MushroomManager();
});

// Global app reference for onclick handlers
window.app = app;