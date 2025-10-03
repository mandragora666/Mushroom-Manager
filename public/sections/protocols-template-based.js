// Template-based Protocol Section - Based on user's Word document structure
// Enhanced version that matches the detailed protocol template

MushroomManager.prototype.showProtocolFormTemplateBased = async function(protocolId = null) {
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

    // Load dynamic data with fallback
    let mushroomSpecies = [];
    let substrateRecipes = [];
    let inoculationMethods = [];
    let growthPhases = [];

    try {
        [mushroomSpecies, substrateRecipes, inoculationMethods, growthPhases] = await Promise.all([
            window.supabase.getMushroomSpecies(),
            window.supabase.getSubstrateRecipes(), 
            window.supabase.getInoculationMethods(),
            window.supabase.getGrowthPhases()
        ]);
    } catch (error) {
        console.warn('Could not load enhanced data, using fallbacks:', error);
        // Fallback data will be handled by the supabase client
    }

    const isEdit = !!protocol;
    const title = isEdit ? 'Protokoll bearbeiten' : 'Neues Zuchtprotokoll erstellen';

    content.innerHTML = `
        <div class="max-w-5xl mx-auto">
            <div class="bg-white rounded-xl border border-gray-200">
                <!-- Header -->
                <div class="p-6 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900">${title}</h2>
                        <div class="flex space-x-2">
                            <button type="button" data-action="template-view" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                                <i class="fas fa-eye mr-1"></i>
                                Template-Ansicht
                            </button>
                            <button onclick="mushroomManager.loadSection('zuchtprotokoll')" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <form data-form="protocol-template" ${protocol ? `data-protocol-id="${protocol.id}"` : ''} class="p-6 space-y-8">
                    
                    <!-- Substratblock Information -->
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            <i class="fas fa-layer-group mr-2"></i>
                            Substratblock Bezeichnung
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Protokoll-Titel *</label>
                                <input type="text" name="title" required 
                                    value="${protocol?.title || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="z.B. Kräuterseitling - Pleurotus eryngii var.">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Substratblock ID *</label>
                                <input type="text" name="batch_name" required 
                                    value="${protocol?.batch_name || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="z.B. xx01">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Züchter / Händler</label>
                                <input type="text" name="breeder" 
                                    value="${protocol?.breeder || 'Ulrich Krüger'}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Züchter Name">
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Art / Herkunft</label>
                            <div class="flex space-x-2">
                                <select name="mushroom_species_id" id="mushroom-species-select" required 
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                    <option value="">Pilzart auswählen</option>
                                    ${mushroomSpecies.map(species => `
                                        <option value="${species.id}" ${protocol?.mushroom_species_id === species.id ? 'selected' : ''}>
                                            ${species.name} - ${species.scientific_name || 'N/A'}
                                        </option>
                                    `).join('')}
                                </select>
                                <button type="button" data-action="add-mushroom-species" 
                                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Link zu Herkunft</label>
                            <input type="url" name="source_link" 
                                value="${protocol?.source_link || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="https://...">
                        </div>
                    </div>

                    <!-- Myzel Wachstumsphase -->
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            <i class="fas fa-seedling mr-2"></i>
                            Myzel Wachstumsphase
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Myzel beimpft am</label>
                                <input type="date" name="inoculation_date" 
                                    value="${protocol?.start_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Agar durchwachsen</label>
                                <input type="date" name="agar_colonization_date" 
                                    value="${protocol?.agar_colonization_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Agar Durchwachsphase Temperatur</label>
                                <div class="flex space-x-2">
                                    <input type="number" name="agar_temperature" step="0.1"
                                        value="${protocol?.agar_temperature || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="22">
                                    <span class="flex items-center text-gray-500">°C</span>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Agar Zusammensetzung</label>
                                <input type="text" name="agar_composition" 
                                    value="${protocol?.agar_composition || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="z.B. Malzextrakt-Agar">
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notizen / Anmerkungen</label>
                            <textarea name="mycel_notes" rows="2" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Beobachtungen zur Myzelentwicklung...">${protocol?.mycel_notes || ''}</textarea>
                        </div>
                    </div>

                    <!-- Körnerbrut Wachstumsphase -->
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            <i class="fas fa-grain mr-2"></i>
                            Körnerbrut Wachstumsphase
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Körnerbrut angesetzt</label>
                                <input type="date" name="grain_spawn_date" 
                                    value="${protocol?.grain_spawn_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Körnerbrut durchwachsen</label>
                                <input type="date" name="grain_colonized_date" 
                                    value="${protocol?.grain_colonized_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <input type="text" name="grain_status" 
                                    value="${protocol?.grain_status || 'Durchwachsen XX Tagen'}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Durchwachsen XX Tagen">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Durchwachsphase Temperatur</label>
                                <div class="flex space-x-2">
                                    <input type="number" name="grain_temperature" step="0.1"
                                        value="${protocol?.grain_temperature || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="22">
                                    <span class="flex items-center text-gray-500">°C</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notizen / Anmerkungen</label>
                            <textarea name="grain_notes" rows="2" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Beobachtungen zur Körnerbrut...">${protocol?.grain_notes || ''}</textarea>
                        </div>
                    </div>

                    <!-- Erträge -->
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            <i class="fas fa-harvest mr-2"></i>
                            Erträge
                        </h3>
                        
                        <!-- Flush 1 -->
                        <div class="space-y-4">
                            <div class="border border-gray-200 rounded-lg p-4">
                                <h4 class="font-medium text-gray-900 mb-3">Ertrag 1. Flush</h4>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Erntezeitpunkt</label>
                                        <input type="date" name="harvest1_date" 
                                            value="${protocol?.harvest1_date || ''}"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Ertrag</label>
                                        <div class="flex space-x-2">
                                            <input type="number" name="harvest1_amount" step="0.1"
                                                value="${protocol?.harvest1_amount || ''}"
                                                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="0">
                                            <select name="harvest1_unit" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                                <option value="g" ${protocol?.harvest1_unit === 'g' ? 'selected' : ''}>g</option>
                                                <option value="kg" ${protocol?.harvest1_unit === 'kg' ? 'selected' : ''}>kg</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Dauer (XX Tagen)</label>
                                        <input type="number" name="harvest1_duration" 
                                            value="${protocol?.harvest1_duration || ''}"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="14">
                                    </div>
                                </div>
                                
                                <div class="mt-4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">BE (Biologische Effizienz) %</label>
                                            <input type="number" name="harvest1_be" step="0.1"
                                                value="${protocol?.harvest1_be || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="75">
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Notizen / Anmerkungen</label>
                                        <textarea name="harvest1_notes" rows="2" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="Beobachtungen zum ersten Flush...">${protocol?.harvest1_notes || ''}</textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Flush 2 & 3 (collapsed by default) -->
                            <div class="border border-gray-200 rounded-lg">
                                <button type="button" onclick="this.parentElement.querySelector('.flush-details').classList.toggle('hidden')" 
                                    class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50">
                                    <span class="font-medium text-gray-900">Weitere Flushes (2. & 3.)</span>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                
                                <div class="flush-details hidden p-4 border-t border-gray-200 space-y-4">
                                    <!-- Flush 2 -->
                                    <div class="bg-white border border-gray-100 rounded p-3">
                                        <h5 class="font-medium text-gray-800 mb-3">Ertrag 2. Flush</h5>
                                        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                                            <input type="date" name="harvest2_date" placeholder="Datum" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                            <input type="number" name="harvest2_amount" step="0.1" placeholder="Ertrag (g)" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                            <input type="number" name="harvest2_be" step="0.1" placeholder="BE %" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                            <input type="number" name="harvest2_duration" placeholder="Dauer (Tage)" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                        </div>
                                    </div>
                                    
                                    <!-- Flush 3 -->
                                    <div class="bg-white border border-gray-100 rounded p-3">
                                        <h5 class="font-medium text-gray-800 mb-3">Ertrag 3. Flush</h5>
                                        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                                            <input type="date" name="harvest3_date" placeholder="Datum" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                            <input type="number" name="harvest3_amount" step="0.1" placeholder="Ertrag (g)" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                            <input type="number" name="harvest3_be" step="0.1" placeholder="BE %" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                            <input type="number" name="harvest3_duration" placeholder="Dauer (Tage)" 
                                                class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Substrat Wachstumsphase -->
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            <i class="fas fa-layer-group mr-2"></i>
                            Substrat Wachstumsphase
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Substrat angesetzt</label>
                                <input type="date" name="substrate_date" 
                                    value="${protocol?.substrate_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Substrat durchwachsen</label>
                                <input type="date" name="substrate_colonized_date" 
                                    value="${protocol?.substrate_colonized_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <input type="text" name="substrate_status" 
                                    value="${protocol?.substrate_status || 'Durchwachsen XX Tagen'}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Durchwachsphase Temperatur</label>
                                <div class="flex space-x-2">
                                    <input type="number" name="substrate_temperature" step="0.1"
                                        value="${protocol?.substrate_temperature || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                    <span class="flex items-center text-gray-500">°C</span>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Verwendetes Substrat</label>
                                <select name="substrate_recipe_id" id="substrate-recipe-select"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                    <option value="">Substratrezept auswählen</option>
                                    ${substrateRecipes.map(recipe => `
                                        <option value="${recipe.id}" ${protocol?.substrate_recipe_id === recipe.id ? 'selected' : ''}>
                                            ${recipe.name}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Substrat Zusammensetzung (pro Block)</label>
                                <textarea name="substrate_composition" rows="3" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="500g Sojapellets, 500g Buchenpellets, 1.5 L Wasser">${protocol?.substrate_composition || ''}</textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Substratgröße</label>
                                <input type="text" name="substrate_size" 
                                    value="${protocol?.substrate_size || '2.5 kg Blöcke'}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notizen / Anmerkungen</label>
                            <textarea name="substrate_notes" rows="2" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Beobachtungen zum Substrat...">${protocol?.substrate_notes || ''}</textarea>
                        </div>
                    </div>

                    <!-- Fruchtungsphase -->
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            <i class="fas fa-apple-alt mr-2"></i>
                            Fruchtungsphase
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Fruchtung eingeleitet</label>
                                <input type="date" name="fruiting_initiated_date" 
                                    value="${protocol?.fruiting_initiated_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Kälteschock</label>
                                <input type="text" name="cold_shock" 
                                    value="${protocol?.cold_shock || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="z.B. 24h bei 5°C">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Öffnen des Beutels</label>
                                <input type="date" name="bag_opening_date" 
                                    value="${protocol?.bag_opening_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Erste Pinsets sichtbar</label>
                                <input type="date" name="first_pins_date" 
                                    value="${protocol?.first_pins_date || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                        </div>
                        
                        <!-- Fruchtungsparameter -->
                        <div class="mt-6">
                            <h4 class="font-medium text-gray-900 mb-3">Fruchtungsparameter</h4>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Temperatur</label>
                                    <input type="text" name="fruiting_temperature" 
                                        value="${protocol?.fruiting_temperature || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="°C">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Luftfeuchtigkeit</label>
                                    <input type="text" name="fruiting_humidity" 
                                        value="${protocol?.fruiting_humidity || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="0 %">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">CO2 Gehalt</label>
                                    <input type="text" name="co2_level" 
                                        value="${protocol?.co2_level || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="0 ppm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Luftaustausch</label>
                                    <input type="text" name="air_exchange" 
                                        value="${protocol?.air_exchange || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="alle 10 Minuten">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Beleuchtung p. Tag</label>
                                    <input type="text" name="lighting_schedule" 
                                        value="${protocol?.lighting_schedule || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="0800 - 1800 Uhr">
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notizen / Anmerkungen</label>
                            <textarea name="fruiting_notes" rows="2" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Beobachtungen zur Fruchtungsphase...">${protocol?.fruiting_notes || ''}</textarea>
                        </div>
                    </div>

                    <!-- Foto Dokumentation -->
                    <div class="bg-indigo-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            <i class="fas fa-camera mr-2"></i>
                            Foto-Dokumentation
                        </h3>
                        <div id="photo-upload-container-template">
                            <!-- Photo upload component will be rendered here -->
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                        <button type="button" onclick="mushroomManager.loadSection('zuchtprotokoll')" 
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            Abbrechen
                        </button>
                        <button type="button" data-action="save-draft" 
                            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            <i class="fas fa-save mr-2"></i>
                            Als Entwurf speichern
                        </button>
                        <button type="submit" 
                            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                            <i class="fas fa-check mr-2"></i>
                            ${isEdit ? 'Aktualisieren' : 'Protokoll erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Initialize photo upload component
    try {
        // Dynamically import the PhotoUploadComponent
        const { PhotoUploadComponent } = await import('../components/photo-upload.js');
        const photoUploader = new PhotoUploadComponent({
            maxFiles: 15,
            bucket: 'protocol-photos'
        });
        photoUploader.render('photo-upload-container-template', protocol?.images || []);
        window.currentPhotoUploader = photoUploader;
    } catch (error) {
        console.warn('Photo upload component not available:', error);
    }
};

// Override the create protocol action to use the template-based form
MushroomManager.prototype.showProtocolFormTemplate = function(protocolId = null) {
    this.showProtocolFormTemplateBased(protocolId);
};