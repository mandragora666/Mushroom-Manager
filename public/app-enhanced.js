// 🍄 Mushroom Manager - Enhanced with Real Database Functionality
console.log('🍄 Starting Mushroom Manager (Enhanced)...');

// API Base URL
const API_BASE = '';

// Global state
let currentSection = 'dashboard';
let protocols = [];
let wikiArticles = [];

// Utility functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(API_BASE + endpoint, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Fehler: ' + error.message, 'error');
        throw error;
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white max-w-sm`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
}

function formatRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'heute';
    if (diffDays === 1) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    return `${Math.floor(diffDays / 30)}m`;
}

// Global navigation function
function loadSection(section) {
    console.log('📄 Loading section:', section);
    currentSection = section;
    
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
            loadDashboardData();
            break;
        case 'zuchtprotokoll':
            title = 'Protokolle';
            description = 'Ihre Zucht-Protokolle verwalten';
            contentHtml = getProtokollContent();
            loadProtocols();
            break;
        case 'wiki':
            title = 'Wiki';
            description = 'Pilzsorten-Datenbank';
            contentHtml = getWikiContent();
            loadWikiArticles();
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
            title = 'Unbekannt';
            description = '';
            contentHtml = '<p>Sektion nicht gefunden</p>';
    }

    // Update titles
    if (pageTitle) pageTitle.textContent = title;
    if (pageDescription) pageDescription.textContent = description;
    if (pageTitleMobile) pageTitleMobile.textContent = title;
    if (pageDescriptionMobile) pageDescriptionMobile.textContent = description;

    // Update content
    content.innerHTML = contentHtml;
    
    // Update navigation active states
    updateNavigation(section);
}

// Dashboard functions
async function loadDashboardData() {
    try {
        const stats = await apiRequest('/api/dashboard/stats');
        const activities = await apiRequest('/api/dashboard/activities');
        
        // Update dashboard stats
        document.getElementById('dashTemp').textContent = stats.temperature + '°C';
        document.getElementById('dashHum').textContent = stats.humidity + '%';
        document.getElementById('dashCO2').textContent = stats.co2;
        document.getElementById('dashVent').textContent = stats.ventilation + 'x';
        
        document.getElementById('activeProtocols').textContent = stats.activeProtocols;
        document.getElementById('mushroomSpecies').textContent = stats.mushroomSpecies;
        document.getElementById('inventoryItems').textContent = stats.inventoryItems;
        document.getElementById('cultures').textContent = stats.cultures;
        document.getElementById('successRate').textContent = stats.averageSuccessRate + '%';
        
        // Update recent activities
        updateRecentActivities(activities);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function updateRecentActivities(activities) {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    container.innerHTML = activities.map(activity => `
        <div class="flex items-center">
            <div class="bg-green-100 p-2 rounded-lg mr-4">
                <i class="fas fa-hand-paper text-green-600"></i>
            </div>
            <div class="flex-1">
                <p class="font-medium text-gray-900">${activity.title}</p>
                <p class="text-sm text-gray-500">${activity.content}</p>
            </div>
            <span class="text-sm text-gray-400">${formatRelativeTime(activity.created_at)}</span>
        </div>
    `).join('');
}

// Protocol functions
async function loadProtocols() {
    try {
        protocols = await apiRequest('/api/protocols');
        updateProtocolList();
    } catch (error) {
        console.error('Failed to load protocols:', error);
    }
}

function updateProtocolList() {
    const container = document.getElementById('protocolList');
    if (!container || !protocols) return;
    
    if (protocols.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-clipboard-list text-4xl mb-4"></i>
                <p>Noch keine Protokolle vorhanden</p>
                <p class="text-sm">Erstellen Sie Ihr erstes Zuchtprotokoll</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = protocols.map(protocol => `
        <div class="bg-white rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">${protocol.title}</h3>
                <span class="bg-${getStatusColor(protocol.status)}-100 text-${getStatusColor(protocol.status)}-800 px-3 py-1 rounded-full text-sm font-medium">
                    ${getStatusText(protocol.status)}
                </span>
            </div>
            
            <p class="text-gray-600 mb-2">${protocol.species}</p>
            <p class="text-sm text-gray-500 mb-4">ID: ${protocol.batch_name} • Erstellt: ${formatDate(protocol.created_at)}</p>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-500">Substrat</p>
                    <p class="font-medium">${protocol.substrate_type || 'Nicht angegeben'}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Ziel-Temp.</p>
                    <p class="font-medium">${protocol.temperature_target}°C</p>
                </div>
            </div>
            
            <div class="flex justify-between items-center">
                <button onclick="viewProtocol('${protocol.id}')" class="text-blue-600 font-medium">
                    Details anzeigen
                </button>
                <div class="flex space-x-2">
                    <button onclick="editProtocol('${protocol.id}')" class="text-gray-600 hover:text-blue-600">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProtocol('${protocol.id}')" class="text-gray-600 hover:text-red-600">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    switch (status) {
        case 'active': return 'green';
        case 'completed': return 'blue';
        case 'failed': return 'red';
        case 'planning': return 'yellow';
        default: return 'gray';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'active': return 'Aktiv';
        case 'completed': return 'Abgeschlossen';
        case 'failed': return 'Fehlgeschlagen';
        case 'planning': return 'Planung';
        default: return status;
    }
}

function showNewProtocolForm() {
    const modal = document.getElementById('newProtocolModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideNewProtocolForm() {
    const modal = document.getElementById('newProtocolModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        // Reset form
        document.getElementById('newProtocolForm').reset();
    }
}

async function submitNewProtocol(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const protocolData = {
        title: formData.get('title'),
        species: formData.get('species'),
        batch_name: formData.get('batch_name'),
        start_date: formData.get('start_date'),
        expected_harvest_date: formData.get('expected_harvest_date'),
        substrate_type: formData.get('substrate_type'),
        inoculation_method: formData.get('inoculation_method'),
        temperature_target: formData.get('temperature_target'),
        humidity_target: formData.get('humidity_target'),
        notes: formData.get('notes')
    };
    
    try {
        const newProtocol = await apiRequest('/api/protocols', 'POST', protocolData);
        protocols.unshift(newProtocol);
        updateProtocolList();
        hideNewProtocolForm();
        showNotification('Protokoll erfolgreich erstellt!');
    } catch (error) {
        console.error('Failed to create protocol:', error);
    }
}

async function deleteProtocol(id) {
    if (!confirm('Sind Sie sicher, dass Sie dieses Protokoll löschen möchten?')) {
        return;
    }
    
    try {
        await apiRequest(`/api/protocols/${id}`, 'DELETE');
        protocols = protocols.filter(p => p.id !== id);
        updateProtocolList();
        showNotification('Protokoll gelöscht');
    } catch (error) {
        console.error('Failed to delete protocol:', error);
    }
}

// Wiki functions
async function loadWikiArticles() {
    try {
        wikiArticles = await apiRequest('/api/wiki');
        updateWikiList();
    } catch (error) {
        console.error('Failed to load wiki articles:', error);
    }
}

function updateWikiList() {
    const container = document.getElementById('wikiList');
    if (!container || !wikiArticles) return;
    
    if (wikiArticles.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-book-open text-4xl mb-4"></i>
                <p>Noch keine Wiki-Artikel vorhanden</p>
                <p class="text-sm">Erstellen Sie Ihren ersten Artikel</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = wikiArticles.map(article => `
        <div class="bg-white rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">${article.title}</h3>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ${article.category}
                </span>
            </div>
            
            <p class="text-gray-600 mb-4">${article.excerpt}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span><i class="fas fa-eye mr-1"></i> ${article.view_count} Aufrufe</span>
                <span>${formatDate(article.created_at)}</span>
            </div>
            
            ${article.tags && article.tags.length > 0 ? `
                <div class="flex flex-wrap gap-2 mb-4">
                    ${article.tags.map(tag => `
                        <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">${tag}</span>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="flex justify-between items-center">
                <button onclick="viewWikiArticle('${article.id}')" class="text-blue-600 font-medium">
                    Artikel lesen
                </button>
                <div class="flex space-x-2">
                    <button onclick="editWikiArticle('${article.id}')" class="text-gray-600 hover:text-blue-600">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteWikiArticle('${article.id}')" class="text-gray-600 hover:text-red-600">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showNewWikiForm() {
    const modal = document.getElementById('newWikiModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideNewWikiForm() {
    const modal = document.getElementById('newWikiModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        document.getElementById('newWikiForm').reset();
    }
}

async function submitNewWiki(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const wikiData = {
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        excerpt: formData.get('excerpt'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        is_published: formData.get('is_published') === 'on'
    };
    
    try {
        const newArticle = await apiRequest('/api/wiki', 'POST', wikiData);
        wikiArticles.unshift(newArticle);
        updateWikiList();
        hideNewWikiForm();
        showNotification('Wiki-Artikel erfolgreich erstellt!');
    } catch (error) {
        console.error('Failed to create wiki article:', error);
    }
}

function viewWikiArticle(id) {
    const article = wikiArticles.find(a => a.id === id);
    if (!article) return;
    
    // Show article in modal or navigate to detail page
    const modal = document.getElementById('wikiViewModal');
    if (modal) {
        document.getElementById('wikiViewTitle').textContent = article.title;
        document.getElementById('wikiViewCategory').textContent = article.category;
        document.getElementById('wikiViewContent').innerHTML = formatMarkdown(article.content);
        modal.classList.remove('hidden');
    }
}

function formatMarkdown(content) {
    // Simple markdown to HTML conversion
    return content
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/gim, '<br>');
}

// Content generation functions (continuing with existing structure but enhanced)