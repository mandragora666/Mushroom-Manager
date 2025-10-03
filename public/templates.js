// HTML Templates for Enhanced Mushroom Manager

// Dashboard Content
function getDashboardContent() {
    return `
        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <!-- Active Protocols -->
            <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
                <div class="text-3xl font-bold text-blue-600" id="activeProtocols">-</div>
                <div class="text-sm text-gray-500 mt-1">Aktive Protokolle</div>
            </div>
            
            <!-- Species Count -->
            <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
                <div class="text-3xl font-bold text-green-600" id="mushroomSpecies">-</div>
                <div class="text-sm text-gray-500 mt-1">Pilzarten</div>
            </div>
            
            <!-- Inventory Items -->
            <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
                <div class="text-3xl font-bold text-purple-600" id="inventoryItems">-</div>
                <div class="text-sm text-gray-500 mt-1">Inventar</div>
            </div>
            
            <!-- Active Cultures -->
            <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
                <div class="text-3xl font-bold text-orange-600" id="cultures">-</div>
                <div class="text-sm text-gray-500 mt-1">Kulturen</div>
            </div>
            
            <!-- Success Rate -->
            <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
                <div class="text-3xl font-bold text-emerald-600" id="successRate">-</div>
                <div class="text-sm text-gray-500 mt-1">Erfolgsrate</div>
            </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div class="flex items-center mb-4">
                <i class="fas fa-clock text-blue-500 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Letzte Aktivitäten</h3>
            </div>
            
            <div class="space-y-4" id="recentActivities">
                <div class="text-center py-4 text-gray-500">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p class="text-sm">Lade Aktivitäten...</p>
                </div>
            </div>
        </div>

        <!-- Current Conditions -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
            <div class="flex items-center mb-4">
                <i class="fas fa-thermometer-half text-orange-500 text-lg mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-800">Aktuelle Bedingungen</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600" id="dashTemp">-°C</div>
                    <div class="text-sm text-gray-500">Temperatur</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-500" id="dashHum">-%</div>
                    <div class="text-sm text-gray-500">Luftfeuchtigkeit</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600" id="dashCO2">-</div>
                    <div class="text-sm text-gray-500">CO2 ppm</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-red-500" id="dashVent">-x</div>
                    <div class="text-sm text-gray-500">Belüftung/h</div>
                </div>
            </div>
        </div>
    `;
}

// Protocol Content
function getProtokollContent() {
    return `
        <!-- Header with New Button -->
        <div class="mb-6">
            <button onclick="showNewProtocolForm()" class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-medium flex items-center justify-center hover:shadow-lg transition-all">
                <i class="fas fa-plus mr-3"></i>
                Neues Protokoll erstellen
            </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <div class="relative">
                <input type="text" placeholder="Protokolle suchen..." class="w-full p-4 pl-12 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500">
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
        </div>

        <!-- Protocol List -->
        <div class="space-y-4" id="protocolList">
            <div class="text-center py-8 text-gray-500">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Lade Protokolle...</p>
            </div>
        </div>

        ${getNewProtocolModal()}
    `;
}

// Wiki Content  
function getWikiContent() {
    return `
        <!-- Header with New Button -->
        <div class="mb-6">
            <button onclick="showNewWikiForm()" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl font-medium flex items-center justify-center hover:shadow-lg transition-all">
                <i class="fas fa-plus mr-3"></i>
                Neuen Wiki-Artikel erstellen
            </button>
        </div>

        <!-- Category Filter -->
        <div class="mb-6">
            <div class="flex flex-wrap gap-2">
                <button onclick="filterWiki('all')" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                    Alle
                </button>
                <button onclick="filterWiki('Basics')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                    Grundlagen
                </button>
                <button onclick="filterWiki('Techniques')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                    Techniken
                </button>
                <button onclick="filterWiki('Species')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                    Pilzarten
                </button>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <div class="relative">
                <input type="text" placeholder="Wiki durchsuchen..." class="w-full p-4 pl-12 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-green-500">
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
        </div>

        <!-- Wiki Article List -->
        <div class="space-y-4" id="wikiList">
            <div class="text-center py-8 text-gray-500">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p>Lade Wiki-Artikel...</p>
            </div>
        </div>

        ${getNewWikiModal()}
        ${getWikiViewModal()}
    `;
}

// New Protocol Modal
function getNewProtocolModal() {
    return `
        <div id="newProtocolModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Neues Protokoll</h2>
                        <button onclick="hideNewProtocolForm()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="newProtocolForm" onsubmit="submitNewProtocol(event)">
                        <div class="space-y-4">
                            <!-- Title -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
                                <input type="text" name="title" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="z.B. Shiitake Zucht Winter 2024">
                            </div>
                            
                            <!-- Species -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Pilzart *</label>
                                <select name="species" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Pilzart auswählen</option>
                                    <option value="Pleurotus ostreatus">Austernpilz (Pleurotus ostreatus)</option>
                                    <option value="Lentinula edodes">Shiitake (Lentinula edodes)</option>
                                    <option value="Pleurotus eryngii">King Oyster (Pleurotus eryngii)</option>
                                    <option value="Hericium erinaceus">Lion's Mane (Hericium erinaceus)</option>
                                    <option value="Agaricus bisporus">Champignon (Agaricus bisporus)</option>
                                </select>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <!-- Batch Name -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Batch-Name *</label>
                                    <input type="text" name="batch_name" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="z.B. SH-2024-001">
                                </div>
                                
                                <!-- Start Date -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Startdatum *</label>
                                    <input type="date" name="start_date" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>
                            
                            <!-- Expected Harvest -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Geplante Ernte</label>
                                <input type="date" name="expected_harvest_date" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <!-- Substrate -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Substrat</label>
                                    <input type="text" name="substrate_type" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="z.B. Strohpellets, Hartholzspäne">
                                </div>
                                
                                <!-- Inoculation Method -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Inokulationsmethode</label>
                                    <input type="text" name="inoculation_method" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="z.B. Flüssigkultur, Körnerbrut">
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <!-- Temperature -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Ziel-Temperatur (°C)</label>
                                    <input type="number" name="temperature_target" min="10" max="35" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="20">
                                </div>
                                
                                <!-- Humidity -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Ziel-Feuchtigkeit (%)</label>
                                    <input type="number" name="humidity_target" min="60" max="100" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="85">
                                </div>
                            </div>
                            
                            <!-- Notes -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Notizen</label>
                                <textarea name="notes" rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Zusätzliche Informationen, Beobachtungen..."></textarea>
                            </div>
                        </div>
                        
                        <div class="flex justify-end space-x-4 mt-6">
                            <button type="button" onclick="hideNewProtocolForm()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Abbrechen
                            </button>
                            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Protokoll erstellen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// New Wiki Modal
function getNewWikiModal() {
    return `
        <div id="newWikiModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Neuer Wiki-Artikel</h2>
                        <button onclick="hideNewWikiForm()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="newWikiForm" onsubmit="submitNewWiki(event)">
                        <div class="space-y-4">
                            <!-- Title -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
                                <input type="text" name="title" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="z.B. Austernpilz-Zucht für Anfänger">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <!-- Category -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kategorie *</label>
                                    <select name="category" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                        <option value="">Kategorie auswählen</option>
                                        <option value="Basics">Grundlagen</option>
                                        <option value="Techniques">Techniken</option>
                                        <option value="Species">Pilzarten</option>
                                        <option value="Equipment">Ausrüstung</option>
                                        <option value="Troubleshooting">Problemlösung</option>
                                    </select>
                                </div>
                                
                                <!-- Tags -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <input type="text" name="tags" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="tag1, tag2, tag3">
                                    <p class="text-xs text-gray-500 mt-1">Tags mit Komma trennen</p>
                                </div>
                            </div>
                            
                            <!-- Excerpt -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Kurzbeschreibung</label>
                                <textarea name="excerpt" rows="2" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Kurze Zusammenfassung des Artikels..."></textarea>
                            </div>
                            
                            <!-- Content -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Inhalt * (Markdown unterstützt)</label>
                                <textarea name="content" rows="12" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm" placeholder="# Titel

## Einführung
Hier steht der Inhalt...

## Wichtige Punkte
- Punkt 1
- Punkt 2

**Fett gedruckter Text**
*Kursiver Text*"></textarea>
                                <p class="text-xs text-gray-500 mt-1">Verwenden Sie Markdown für Formatierung (# für Überschriften, **fett**, *kursiv*, - für Listen)</p>
                            </div>
                            
                            <!-- Published -->
                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" name="is_published" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
                                    <span class="ml-2 text-sm text-gray-700">Artikel sofort veröffentlichen</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="flex justify-end space-x-4 mt-6">
                            <button type="button" onclick="hideNewWikiForm()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Abbrechen
                            </button>
                            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Artikel erstellen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// Wiki View Modal
function getWikiViewModal() {
    return `
        <div id="wikiViewModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 id="wikiViewTitle" class="text-2xl font-bold text-gray-900">Artikel</h2>
                            <span id="wikiViewCategory" class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-2"></span>
                        </div>
                        <button onclick="document.getElementById('wikiViewModal').classList.add('hidden')" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div id="wikiViewContent" class="prose max-w-none">
                        <!-- Article content will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Placeholder content for other sections
function getInventarContent() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-boxes text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Inventar-Verwaltung</h3>
            <p class="text-gray-500">Funktionalität wird in einer zukünftigen Version hinzugefügt</p>
        </div>
    `;
}

function getKulturenContent() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-flask text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Kulturen-Verwaltung</h3>
            <p class="text-gray-500">Funktionalität wird in einer zukünftigen Version hinzugefügt</p>
        </div>
    `;
}

function getRechnerContent() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-calculator text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Berechnungs-Tools</h3>
            <p class="text-gray-500">Funktionalität wird in einer zukünftigen Version hinzugefügt</p>
        </div>
    `;
}

function getEinstellungenContent() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-cog text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Einstellungen</h3>
            <p class="text-gray-500">Funktionalität wird in einer zukünftigen Version hinzugefügt</p>
        </div>
    `;
}