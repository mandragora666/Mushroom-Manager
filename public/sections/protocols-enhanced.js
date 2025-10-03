// Enhanced Protocols Section with flexible forms and photo upload
import { PhotoUploadComponent } from '../components/photo-upload.js';

MushroomManager.prototype.loadProtocolsEnhanced = async function() {
    const content = document.getElementById('content');
    
    try {
        const [protocols, mushroomSpecies, substrateRecipes, inoculationMethods] = await Promise.all([
            this.getProtocols(),
            supabase.getMushroomSpecies(),
            supabase.getSubstrateRecipes(),
            supabase.getInoculationMethods()
        ]);

        content.innerHTML = `
            <div class="space-y-6">
                <!-- Header with Create Button -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Zuchtprotokolle</h2>
                        <p class="text-gray-600">Verwalten Sie Ihre Zucht-Dokumentation</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button data-action="manage-species" class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                            <i class="fas fa-seedling mr-1"></i>
                            Pilzarten
                        </button>
                        <button data-action="manage-substrates" class="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex items-center text-sm">
                            <i class="fas fa-layer-group mr-1"></i>
                            Substrate
                        </button>
                        <button data-action="create-protocol-template" class="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center text-sm">
                            <i class="fas fa-file-alt mr-1"></i>
                            Template-Protokoll
                        </button>
                        <button data-action="create-protocol" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                            <i class="fas fa-plus mr-2"></i>
                            Einfaches Protokoll
                        </button>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <i class="fas fa-flask text-2xl text-green-600 mr-3"></i>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${protocols.length}</p>
                                <p class="text-sm text-gray-600">Protokolle gesamt</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <i class="fas fa-seedling text-2xl text-blue-600 mr-3"></i>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${mushroomSpecies.length}</p>
                                <p class="text-sm text-gray-600">Pilzarten</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <i class="fas fa-layer-group text-2xl text-purple-600 mr-3"></i>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${substrateRecipes.length}</p>
                                <p class="text-sm text-gray-600">Substratrezepte</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <i class="fas fa-tools text-2xl text-orange-600 mr-3"></i>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${inoculationMethods.length}</p>
                                <p class="text-sm text-gray-600">Inokulationsmethoden</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Protocols List -->
                <div class="grid gap-4">
                    ${this.renderProtocolsEnhanced(protocols)}
                </div>
                
                ${protocols.length === 0 ? this.renderEmptyProtocols() : ''}
            </div>
        `;
    } catch (error) {
        console.error('Error loading protocols:', error);
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Fehler beim Laden der Protokolle</h3>
                <p class="text-gray-600">${error.message}</p>
            </div>
        `;
    }
};

MushroomManager.prototype.renderProtocolsEnhanced = function(protocols) {
    if (!protocols || protocols.length === 0) {
        return this.renderEmptyProtocols();
    }

    return protocols.map(protocol => `
        <div class="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="p-6">
                <div class="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
                    <div class="flex-1">
                        <div class="flex items-center mb-3">
                            <h3 class="text-lg font-semibold text-gray-900 mr-3">${protocol.title}</h3>
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusColor(protocol.status)}">
                                ${this.getStatusText(protocol.status)}
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                                <span class="font-medium text-gray-700">Phase:</span>
                                <p class="text-gray-600">${this.getGrowthStageText(protocol.growth_stage)}</p>
                            </div>
                        </div>

                        ${protocol.images && protocol.images.length > 0 ? `
                            <div class="mt-4">
                                <span class="font-medium text-gray-700">Fotos (${protocol.images.length}):</span>
                                <div class="flex space-x-2 mt-2">
                                    ${protocol.images.slice(0, 3).map(img => `
                                        <img src="${img}" alt="Protocol photo" 
                                            class="w-12 h-12 rounded object-cover border cursor-pointer hover:opacity-75"
                                            onclick="mushroomManager.showImageModal('${img}')">
                                    `).join('')}
                                    ${protocol.images.length > 3 ? `
                                        <div class="w-12 h-12 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                                            +${protocol.images.length - 3}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}

                        ${protocol.notes ? `
                            <div class="mt-4">
                                <span class="font-medium text-gray-700">Notizen:</span>
                                <p class="text-gray-600 text-sm mt-1">${protocol.notes.substring(0, 150)}${protocol.notes.length > 150 ? '...' : ''}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button data-action="view-protocol" data-id="${protocol.id}" 
                            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                            <i class="fas fa-eye mr-1"></i>
                            Anzeigen
                        </button>
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

MushroomManager.prototype.showProtocolFormEnhanced = async function(protocolId = null) {
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

    // Load dynamic data
    try {
        const [mushroomSpecies, substrateRecipes, inoculationMethods, growthPhases] = await Promise.all([
            supabase.getMushroomSpecies(),
            supabase.getSubstrateRecipes(), 
            supabase.getInoculationMethods(),
            supabase.getGrowthPhases()
        ]);

        const isEdit = !!protocol;
        const title = isEdit ? 'Protokoll bearbeiten' : 'Neues Protokoll erstellen';

        content.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <div class="bg-white rounded-xl border border-gray-200">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h2 class="text-xl font-bold text-gray-900">${title}</h2>
                            <button onclick="mushroomManager.loadProtocolsEnhanced()" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <form data-form="protocol-enhanced" ${protocol ? `data-protocol-id="${protocol.id}"` : ''} class="p-6">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Left Column -->
                            <div class="space-y-6">
                                <!-- Basic Information -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Grundinformationen</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Protokoll-Titel *</label>
                                            <input type="text" name="title" required 
                                                value="${protocol?.title || ''}"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="z.B. Austernpilz Zucht #1">
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
                                    </div>
                                </div>

                                <!-- Mushroom Species -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Pilzart</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Pilzart auswählen *</label>
                                            <div class="flex space-x-2">
                                                <select name="mushroom_species_id" id="mushroom-species-select" required 
                                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                                    <option value="">Wählen Sie eine Pilzart</option>
                                                    ${mushroomSpecies.map(species => `
                                                        <option value="${species.id}" ${protocol?.mushroom_species_id === species.id ? 'selected' : ''}>
                                                            ${species.name} ${species.scientific_name ? `(${species.scientific_name})` : ''}
                                                        </option>
                                                    `).join('')}
                                                </select>
                                                <button type="button" data-action="add-mushroom-species" 
                                                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Substrate Recipe -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Substratrezept</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Rezept auswählen</label>
                                            <div class="flex space-x-2">
                                                <select name="substrate_recipe_id" id="substrate-recipe-select"
                                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                                    <option value="">Wählen Sie ein Substratrezept</option>
                                                    ${substrateRecipes.map(recipe => `
                                                        <option value="${recipe.id}" ${protocol?.substrate_recipe_id === recipe.id ? 'selected' : ''}>
                                                            ${recipe.name} (${recipe.total_weight}kg)
                                                        </option>
                                                    `).join('')}
                                                </select>
                                                <button type="button" data-action="add-substrate-recipe" 
                                                    class="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div id="substrate-recipe-details" class="hidden">
                                            <!-- Recipe details will be loaded here -->
                                        </div>
                                    </div>
                                </div>

                                <!-- Inoculation Method -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Inokulationsmethode</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Methode auswählen</label>
                                            <div class="flex space-x-2">
                                                <select name="inoculation_method_id" id="inoculation-method-select"
                                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                                    <option value="">Wählen Sie eine Inokulationsmethode</option>
                                                    ${inoculationMethods.map(method => `
                                                        <option value="${method.id}" ${protocol?.inoculation_method_id === method.id ? 'selected' : ''}>
                                                            ${method.name} (${method.method_type})
                                                        </option>
                                                    `).join('')}
                                                </select>
                                                <button type="button" data-action="add-inoculation-method" 
                                                    class="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-6">
                                <!-- Environmental Conditions -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Umgebungsbedingungen</h3>
                                    
                                    <div class="space-y-4">
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Min. Temperatur (°C)</label>
                                                <input type="number" name="temperature_min" step="0.1"
                                                    value="${protocol?.temperature_min || ''}"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="18">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Max. Temperatur (°C)</label>
                                                <input type="number" name="temperature_max" step="0.1"
                                                    value="${protocol?.temperature_max || ''}"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="22">
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Min. Luftfeuchtigkeit (%)</label>
                                                <input type="number" name="humidity_min" 
                                                    value="${protocol?.humidity_min || ''}"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="85">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Max. Luftfeuchtigkeit (%)</label>
                                                <input type="number" name="humidity_max"
                                                    value="${protocol?.humidity_max || ''}"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="95">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Current Status -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Aktueller Status</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Wachstumsphase</label>
                                            <select name="current_growth_phase_id" 
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                                <option value="">Phase auswählen</option>
                                                ${growthPhases.map(phase => `
                                                    <option value="${phase.id}" ${protocol?.current_growth_phase_id === phase.id ? 'selected' : ''}>
                                                        ${phase.phase_order}. ${phase.name}
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Protokollstatus</label>
                                            <select name="status" 
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                                <option value="active" ${protocol?.status === 'active' ? 'selected' : ''}>Aktiv</option>
                                                <option value="completed" ${protocol?.status === 'completed' ? 'selected' : ''}>Abgeschlossen</option>
                                                <option value="failed" ${protocol?.status === 'failed' ? 'selected' : ''}>Fehlgeschlagen</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <!-- Photo Upload -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Dokumentationsfotos</h3>
                                    <div id="photo-upload-container">
                                        <!-- Photo upload component will be rendered here -->
                                    </div>
                                </div>

                                <!-- Notes -->
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Notizen</h3>
                                    <textarea name="notes" rows="6" 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Zusätzliche Informationen, Beobachtungen, Besonderheiten, verwendete Ausrüstung...">${protocol?.notes || ''}</textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
                            <button type="button" onclick="mushroomManager.loadProtocolsEnhanced()" 
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

        // Initialize photo upload component
        const photoUploader = new PhotoUploadComponent({
            maxFiles: 10,
            bucket: 'protocol-photos'
        });
        photoUploader.render('photo-upload-container', protocol?.images || []);

        // Store reference for form submission
        window.currentPhotoUploader = photoUploader;

        // Setup dynamic form interactions
        this.setupEnhancedFormInteractions();

    } catch (error) {
        console.error('Error loading form data:', error);
        this.showError('Formular konnte nicht geladen werden: ' + error.message);
    }
};

MushroomManager.prototype.setupEnhancedFormInteractions = function() {
    // Substrate recipe selection handler
    const substrateSelect = document.getElementById('substrate-recipe-select');
    if (substrateSelect) {
        substrateSelect.addEventListener('change', async (e) => {
            const recipeId = e.target.value;
            if (recipeId) {
                try {
                    const recipe = await supabase.getSubstrateRecipeById(recipeId);
                    this.displaySubstrateRecipeDetails(recipe);
                } catch (error) {
                    console.error('Error loading substrate recipe:', error);
                }
            } else {
                document.getElementById('substrate-recipe-details').classList.add('hidden');
            }
        });
    }
};

MushroomManager.prototype.displaySubstrateRecipeDetails = function(recipe) {
    const detailsContainer = document.getElementById('substrate-recipe-details');
    if (!detailsContainer || !recipe) return;

    detailsContainer.innerHTML = `
        <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-3">${recipe.name}</h4>
            
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <span class="font-medium">Gesamtgewicht:</span> ${recipe.total_weight}kg
                </div>
                <div>
                    <span class="font-medium">pH-Wert:</span> ${recipe.ph_target || 'N/A'}
                </div>
                <div>
                    <span class="font-medium">Sterilisation:</span> ${recipe.sterilization_method || 'N/A'}
                </div>
                <div>
                    <span class="font-medium">Feuchtigkeit:</span> ${recipe.moisture_content || 'N/A'}%
                </div>
            </div>
            
            ${recipe.substrate_ingredients && recipe.substrate_ingredients.length > 0 ? `
                <div>
                    <span class="font-medium text-gray-900">Zutaten:</span>
                    <ul class="mt-2 space-y-1 text-sm">
                        ${recipe.substrate_ingredients.map(ingredient => `
                            <li class="flex justify-between">
                                <span>${ingredient.ingredient_name}</span>
                                <span class="text-gray-600">${ingredient.quantity}${ingredient.unit} (${ingredient.percentage || 0}%)</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${recipe.notes ? `
                <div class="mt-3">
                    <span class="font-medium text-gray-900">Hinweise:</span>
                    <p class="text-sm text-gray-600 mt-1">${recipe.notes}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    detailsContainer.classList.remove('hidden');
};

// Image modal functionality
MushroomManager.prototype.showImageModal = function(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.onclick = () => modal.remove();
    
    modal.innerHTML = `
        <div class="max-w-4xl max-h-full p-4">
            <img src="${imageSrc}" alt="Protocol photo" class="max-w-full max-h-full object-contain rounded-lg">
            <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
};