// Dashboard Section for Mushroom Manager
MushroomManager.prototype.loadDashboard = async function() {
    const content = document.getElementById('content');
    
    try {
        // Fetch dashboard stats
        const stats = await this.apiCall('/api/dashboard/stats');
        const activities = await this.apiCall('/api/dashboard/activities');

        content.innerHTML = `
            <div class="space-y-6">
                <!-- Quick Stats Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg mr-3">
                                <i class="fas fa-flask text-green-600"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${stats.activeProtocols}</p>
                                <p class="text-sm text-gray-600">Aktive Protokolle</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg mr-3">
                                <i class="fas fa-seedling text-blue-600"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${stats.totalProtocols}</p>
                                <p class="text-sm text-gray-600">Gesamt Protokolle</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg mr-3">
                                <i class="fas fa-book-open text-purple-600"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${stats.mushroomSpecies}</p>
                                <p class="text-sm text-gray-600">Wiki-Artikel</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                        <div class="flex items-center">
                            <div class="bg-orange-100 p-3 rounded-lg mr-3">
                                <i class="fas fa-chart-line text-orange-600"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${stats.averageSuccessRate}%</p>
                                <p class="text-sm text-gray-600">Erfolgsrate</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Dashboard Content -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Recent Activities -->
                    <div class="bg-white rounded-xl border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900">Letzte Aktivitäten</h3>
                                <button class="text-green-600 hover:text-green-700 text-sm font-medium">
                                    Alle anzeigen
                                </button>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="space-y-4">
                                ${this.renderActivities(activities)}
                            </div>
                        </div>
                    </div>

                    <!-- Environmental Conditions -->
                    <div class="bg-white rounded-xl border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">Umgebungsbedingungen</h3>
                        </div>
                        <div class="p-6">
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-thermometer-half text-red-500 mr-3"></i>
                                        <span class="font-medium">Temperatur</span>
                                    </div>
                                    <span class="text-lg font-bold">${stats.temperature}°C</span>
                                </div>

                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-tint text-blue-500 mr-3"></i>
                                        <span class="font-medium">Luftfeuchtigkeit</span>
                                    </div>
                                    <span class="text-lg font-bold">${stats.humidity}%</span>
                                </div>

                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-wind text-gray-500 mr-3"></i>
                                        <span class="font-medium">CO₂</span>
                                    </div>
                                    <span class="text-lg font-bold">${stats.co2} ppm</span>
                                </div>

                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-fan text-green-500 mr-3"></i>
                                        <span class="font-medium">Belüftung</span>
                                    </div>
                                    <span class="text-lg font-bold">${stats.ventilation}/h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white rounded-xl border border-gray-200">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Schnellaktionen</h3>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button data-action="create-protocol" class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <i class="fas fa-plus-circle text-2xl text-green-600 mb-2"></i>
                                <span class="text-sm font-medium text-green-700">Neues Protokoll</span>
                            </button>

                            <button data-action="create-wiki-article" class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <i class="fas fa-book-open text-2xl text-blue-600 mb-2"></i>
                                <span class="text-sm font-medium text-blue-700">Wiki-Artikel</span>
                            </button>

                            <button onclick="mushroomManager.switchSection('inventar')" class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <i class="fas fa-boxes text-2xl text-purple-600 mb-2"></i>
                                <span class="text-sm font-medium text-purple-700">Inventar</span>
                            </button>

                            <button onclick="mushroomManager.switchSection('rechner')" class="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                <i class="fas fa-calculator text-2xl text-orange-600 mb-2"></i>
                                <span class="text-sm font-medium text-orange-700">Rechner</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Data Source Info -->
                <div class="text-center text-sm text-gray-500">
                    Datenquelle: ${stats.dataSource === 'supabase' ? '🟢 Supabase (Live-Daten)' : '🟡 Mock-Daten'}
                </div>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Fehler beim Laden des Dashboards</h3>
                <p class="text-gray-600">${error.message}</p>
                <button onclick="mushroomManager.loadSection('dashboard')" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Erneut versuchen
                </button>
            </div>
        `;
    }
};

MushroomManager.prototype.renderActivities = function(activities) {
    if (!activities || activities.length === 0) {
        return `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-inbox text-3xl mb-2"></i>
                <p>Noch keine Aktivitäten vorhanden</p>
            </div>
        `;
    }

    return activities.slice(0, 5).map(activity => `
        <div class="flex items-start space-x-3">
            <div class="bg-green-100 p-2 rounded-lg">
                <i class="${activity.icon || 'fas fa-circle'} text-green-600"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">${activity.title || activity.description}</p>
                <p class="text-sm text-gray-600">${activity.content || activity.batch_name || ''}</p>
                <p class="text-xs text-gray-500 mt-1">${this.formatDateTime(activity.time || activity.created_at)}</p>
            </div>
        </div>
    `).join('');
};