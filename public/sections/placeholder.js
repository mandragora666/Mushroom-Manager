// Placeholder sections for Mushroom Manager
MushroomManager.prototype.loadPlaceholder = function(section) {
    const content = document.getElementById('content');
    
    const placeholders = {
        inventar: {
            icon: 'fas fa-boxes',
            title: 'Inventar-Management',
            description: 'Hier können Sie Ihren Bestand an Substraten, Nährböden und Geräten verwalten.',
            features: [
                'Substrat-Bestände verfolgen',
                'Nährboden-Vorrat verwalten',
                'Geräte und Werkzeuge katalogisieren',
                'Lieferanten-Informationen speichern',
                'Ablaufdaten überwachen'
            ]
        },
        kulturen: {
            icon: 'fas fa-flask',
            title: 'Kulturen-Verwaltung',
            description: 'Verwalten Sie Ihre aktiven Pilzkulturen und Mutterkulturen.',
            features: [
                'Mutterkultur-Stammdaten verwalten',
                'Übertragungshistorie verfolgen',
                'Kontamination dokumentieren',
                'Kultur-Performance analysieren',
                'Lagerungsbedingungen überwachen'
            ]
        },
        rechner: {
            icon: 'fas fa-calculator',
            title: 'Zucht-Rechner',
            description: 'Berechnungswerkzeuge für verschiedene Aspekte der Pilzzucht.',
            features: [
                'Substrat-Mischverhältnisse berechnen',
                'Ertragsprognosen erstellen',
                'Nährstoff-Berechnungen',
                'Erntemengen dokumentieren',
                'Wirtschaftlichkeits-Analysen'
            ]
        },
        einstellungen: {
            icon: 'fas fa-cog',
            title: 'App-Einstellungen',
            description: 'Konfigurieren Sie die Anwendung nach Ihren Bedürfnissen.',
            features: [
                'Benutzer-Profil verwalten',
                'Benachrichtigungen konfigurieren',
                'Datenexport/Import',
                'Backup-Einstellungen',
                'Theme und Sprache'
            ]
        }
    };
    
    const info = placeholders[section];
    if (!info) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-question-circle text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Sektion nicht gefunden</h3>
                <p class="text-gray-600">Diese Sektion ist noch nicht implementiert.</p>
            </div>
        `;
        return;
    }
    
    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="text-center py-12">
                <div class="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 mb-8">
                    <i class="${info.icon} text-6xl text-blue-600 mb-6"></i>
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">${info.title}</h2>
                    <p class="text-lg text-gray-600 mb-8">${info.description}</p>
                    
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <h3 class="text-xl font-semibold text-gray-900 mb-4">Geplante Features:</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                            ${info.features.map(feature => `
                                <div class="flex items-center">
                                    <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                    <span class="text-gray-700">${feature}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="mt-8">
                        <div class="bg-blue-100 rounded-lg p-4 mb-4">
                            <div class="flex items-center justify-center">
                                <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                                <span class="text-blue-800 font-medium">Diese Funktion ist in Entwicklung</span>
                            </div>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onclick="mushroomManager.switchSection('dashboard')" 
                                class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center">
                                <i class="fas fa-arrow-left mr-2"></i>
                                Zurück zum Dashboard
                            </button>
                            
                            <button onclick="mushroomManager.switchSection('zuchtprotokoll')" 
                                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                                <i class="fas fa-flask mr-2"></i>
                                Protokolle verwalten
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};