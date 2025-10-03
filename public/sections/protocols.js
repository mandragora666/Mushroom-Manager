// Protocols Section for Mushroom Manager
MushroomManager.prototype.loadProtocols = async function() {
    const content = document.getElementById('content');
    
    try {
        const protocols = await this.getProtocols();

        content.innerHTML = `
            <div class="space-y-6">
                <!-- Header with Create Button -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Zuchtprotokolle</h2>
                        <p class="text-gray-600">Verwalten Sie Ihre Zucht-Dokumentation</p>
                    </div>
                    <button data-action="create-protocol" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Neues Protokoll
                    </button>
                </div>

                <!-- Protocols List -->
                <div class="grid gap-4">
                    ${this.renderProtocols(protocols)}
                </div>
                
                ${protocols.length === 0 ? this.renderEmptyProtocols() : ''}
            </div>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Fehler beim Laden der Protokolle</h3>
                <p class="text-gray-600">${error.message}</p>
            </div>
        `;
    }
};

MushroomManager.prototype.renderProtocols = function(protocols) {
    return protocols.map(protocol => `
        <div class="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="p-6">
                <div class="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <h3 class="text-lg font-semibold text-gray-900 mr-3">${protocol.title}</h3>
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusColor(protocol.status)}">
                                ${this.getStatusText(protocol.status)}
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-gray-700">Art:</span>
                                <p class="text-gray-600">${protocol.mushroom_species}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">Batch:</span>
                                <p class="text-gray-600">${protocol.batch_name}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">Startdatum:</span>
                                <p class="text-gray-600">${this.formatDate(protocol.start_date)}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">Substrat:</span>
                                <p class="text-gray-600">${protocol.substrate_type || 'Nicht angegeben'}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">Temperatur:</span>
                                <p class="text-gray-600">${protocol.temperature_range || 'Nicht angegeben'}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">Phase:</span>
                                <p class="text-gray-600">${this.getGrowthStageText(protocol.growth_stage)}</p>
                            </div>
                        </div>

                        ${protocol.notes ? `
                            <div class="mt-4">
                                <span class="font-medium text-gray-700">Notizen:</span>
                                <p class="text-gray-600 text-sm mt-1">${protocol.notes}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button data-action="edit-protocol" data-id="${protocol.id}" 
                            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            <i class="fas fa-edit mr-1"></i>
                            Bearbeiten
                        </button>
                        <button data-action="delete-protocol" data-id="${protocol.id}"
                            class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                            <i class="fas fa-trash mr-1"></i>
                            Löschen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

MushroomManager.prototype.renderEmptyProtocols = function() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-flask text-4xl text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Noch keine Protokolle</h3>
            <p class="text-gray-600 mb-4">Erstellen Sie Ihr erstes Zuchtprotokoll</p>
            <button data-action="create-protocol" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                <i class="fas fa-plus mr-2"></i>
                Erstes Protokoll erstellen
            </button>
        </div>
    `;
};

MushroomManager.prototype.showProtocolForm = async function(protocolId = null) {
    const content = document.getElementById('content');
    
    let protocol = null;
    if (protocolId) {
        try {
            protocol = await this.getProtocol(protocolId);
        } catch (error) {
            this.showError('Protokoll konnte nicht geladen werden: ' + error.message);
            return;
        }
    }

    const isEdit = !!protocol;
    const title = isEdit ? 'Protokoll bearbeiten' : 'Neues Protokoll erstellen';

    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900">${title}</h2>
                        <button onclick="mushroomManager.loadSection('zuchtprotokoll')" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <form data-form="protocol" ${protocol ? `data-protocol-id="${protocol.id}"` : ''} class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Basic Information -->
                        <div class="md:col-span-2">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Grundinformationen</h3>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Protokoll-Titel *</label>
                            <input type="text" name="title" required 
                                value="${protocol?.title || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="z.B. Austernpilz Zucht #1">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Pilzart *</label>
                            <select name="mushroom_species" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">Pilzart auswählen</option>
                                <option value="Pleurotus ostreatus" ${protocol?.mushroom_species === 'Pleurotus ostreatus' ? 'selected' : ''}>Austernpilz (Pleurotus ostreatus)</option>
                                <option value="Lentinula edodes" ${protocol?.mushroom_species === 'Lentinula edodes' ? 'selected' : ''}>Shiitake (Lentinula edodes)</option>
                                <option value="Agaricus bisporus" ${protocol?.mushroom_species === 'Agaricus bisporus' ? 'selected' : ''}>Champignon (Agaricus bisporus)</option>
                                <option value="Pleurotus eryngii" ${protocol?.mushroom_species === 'Pleurotus eryngii' ? 'selected' : ''}>Kräuterseitling (Pleurotus eryngii)</option>
                                <option value="Hericium erinaceus" ${protocol?.mushroom_species === 'Hericium erinaceus' ? 'selected' : ''}>Igelstachelbart (Hericium erinaceus)</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Batch-Name *</label>
                            <input type="text" name="batch_name" required 
                                value="${protocol?.batch_name || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="z.B. AP-2024-001">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Startdatum *</label>
                            <input type="date" name="start_date" required 
                                value="${protocol?.start_date || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        </div>

                        <!-- Cultivation Details -->
                        <div class="md:col-span-2">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 mt-6">Zuchtdetails</h3>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Substrat-Art</label>
                            <select name="substrate_type" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">Substrat auswählen</option>
                                <option value="Weizenstroh" ${protocol?.substrate_type === 'Weizenstroh' ? 'selected' : ''}>Weizenstroh</option>
                                <option value="Kaffeesatz" ${protocol?.substrate_type === 'Kaffeesatz' ? 'selected' : ''}>Kaffeesatz</option>
                                <option value="Sägespäne" ${protocol?.substrate_type === 'Sägespäne' ? 'selected' : ''}>Sägespäne</option>
                                <option value="Buchenholzspäne" ${protocol?.substrate_type === 'Buchenholzspäne' ? 'selected' : ''}>Buchenholzspäne</option>
                                <option value="Pferdemist" ${protocol?.substrate_type === 'Pferdemist' ? 'selected' : ''}>Pferdemist</option>
                                <option value="Strohpellets" ${protocol?.substrate_type === 'Strohpellets' ? 'selected' : ''}>Strohpellets</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Inokulationsmethode</label>
                            <select name="inoculation_method" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">Methode auswählen</option>
                                <option value="Flüssigkultur" ${protocol?.inoculation_method === 'Flüssigkultur' ? 'selected' : ''}>Flüssigkultur</option>
                                <option value="Körnerbrut" ${protocol?.inoculation_method === 'Körnerbrut' ? 'selected' : ''}>Körnerbrut</option>
                                <option value="Impfdübel" ${protocol?.inoculation_method === 'Impfdübel' ? 'selected' : ''}>Impfdübel</option>
                                <option value="Fertigkultur" ${protocol?.inoculation_method === 'Fertigkultur' ? 'selected' : ''}>Fertigkultur</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Temperaturbereich</label>
                            <input type="text" name="temperature_range" 
                                value="${protocol?.temperature_range || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="z.B. 18-22°C">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Luftfeuchtigkeitsbereich</label>
                            <input type="text" name="humidity_range" 
                                value="${protocol?.humidity_range || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="z.B. 85-95%">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Wachstumsphase</label>
                            <select name="growth_stage" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="inoculation" ${protocol?.growth_stage === 'inoculation' ? 'selected' : ''}>Inokulation</option>
                                <option value="incubation" ${protocol?.growth_stage === 'incubation' ? 'selected' : ''}>Inkubation</option>
                                <option value="pinning" ${protocol?.growth_stage === 'pinning' ? 'selected' : ''}>Pinning</option>
                                <option value="fruiting" ${protocol?.growth_stage === 'fruiting' ? 'selected' : ''}>Fruktifikation</option>
                                <option value="harvest" ${protocol?.growth_stage === 'harvest' ? 'selected' : ''}>Ernte</option>
                                <option value="completed" ${protocol?.growth_stage === 'completed' ? 'selected' : ''}>Abgeschlossen</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select name="status" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="active" ${protocol?.status === 'active' ? 'selected' : ''}>Aktiv</option>
                                <option value="completed" ${protocol?.status === 'completed' ? 'selected' : ''}>Abgeschlossen</option>
                                <option value="failed" ${protocol?.status === 'failed' ? 'selected' : ''}>Fehlgeschlagen</option>
                            </select>
                        </div>

                        <!-- Notes -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notizen</label>
                            <textarea name="notes" rows="4" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Zusätzliche Informationen, Beobachtungen oder Hinweise...">${protocol?.notes || ''}</textarea>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <button type="button" onclick="mushroomManager.loadSection('zuchtprotokoll')" 
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            Abbrechen
                        </button>
                        <button type="submit" 
                            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                            <i class="fas fa-save mr-2"></i>
                            ${isEdit ? 'Aktualisieren' : 'Erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
};

// Helper methods for protocols
MushroomManager.prototype.getStatusColor = function(status) {
    const colors = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800', 
        failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

MushroomManager.prototype.getStatusText = function(status) {
    const texts = {
        active: 'Aktiv',
        completed: 'Abgeschlossen',
        failed: 'Fehlgeschlagen'
    };
    return texts[status] || status;
};

MushroomManager.prototype.getGrowthStageText = function(stage) {
    const stages = {
        inoculation: 'Inokulation',
        incubation: 'Inkubation', 
        pinning: 'Pinning',
        fruiting: 'Fruktifikation',
        harvest: 'Ernte',
        completed: 'Abgeschlossen'
    };
    return stages[stage] || stage;
};