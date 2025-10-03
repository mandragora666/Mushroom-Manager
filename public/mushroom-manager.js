// Mushroom Manager - Enhanced Frontend with CRUD Operations
class MushroomManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.apiBase = '';  // Use relative URLs for Vercel compatibility
        this.init();
    }

    async init() {
        this.setupNavigation();
        this.setupEventListeners();
        await this.loadSection('dashboard');
    }

    // API Helper Methods
    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Call failed:', error);
            throw error;
        }
    }

    // PROTOCOLS API
    async getProtocols() {
        return this.apiCall('/api/protocols');
    }

    async getProtocol(id) {
        return this.apiCall(`/api/protocols/${id}`);
    }

    async createProtocol(data) {
        return this.apiCall('/api/protocols', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateProtocol(id, data) {
        return this.apiCall(`/api/protocols/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteProtocol(id) {
        return this.apiCall(`/api/protocols/${id}`, {
            method: 'DELETE'
        });
    }

    // WIKI API
    async getWikiArticles(category = null) {
        const url = category ? `/api/wiki?category=${encodeURIComponent(category)}` : '/api/wiki';
        return this.apiCall(url);
    }

    async getWikiArticle(slug) {
        return this.apiCall(`/api/wiki/${slug}`);
    }

    async createWikiArticle(data) {
        return this.apiCall('/api/wiki', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateWikiArticle(slug, data) {
        return this.apiCall(`/api/wiki/${slug}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteWikiArticle(slug) {
        return this.apiCall(`/api/wiki/${slug}`, {
            method: 'DELETE'
        });
    }

    async getWikiCategories() {
        return this.apiCall('/api/wiki/categories');
    }

    // Navigation Setup
    setupNavigation() {
        // Desktop Navigation
        const desktopNavItems = document.querySelectorAll('#desktopNavigation .nav-item');
        desktopNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Mobile Navigation
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }

    setupEventListeners() {
        // Global event listeners for dynamic content
        document.addEventListener('click', (e) => {
            // Handle dynamic button clicks
            if (e.target.matches('[data-action]')) {
                e.preventDefault();
                const action = e.target.dataset.action;
                const id = e.target.dataset.id;
                this.handleAction(action, id, e.target);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('[data-form]')) {
                e.preventDefault();
                const formType = e.target.dataset.form;
                this.handleFormSubmit(formType, e.target);
            }
        });
    }

    async handleAction(action, id, element) {
        try {
            switch (action) {
                case 'create-protocol':
                    await this.showProtocolForm();
                    break;
                case 'edit-protocol':
                    await this.showProtocolForm(id);
                    break;
                case 'delete-protocol':
                    if (confirm('Protokoll wirklich löschen?')) {
                        await this.deleteProtocol(id);
                        await this.loadSection('zuchtprotokoll');
                        this.showSuccess('Protokoll gelöscht!');
                    }
                    break;
                case 'create-wiki-article':
                    await this.showWikiForm();
                    break;
                case 'edit-wiki-article':
                    await this.showWikiForm(id);
                    break;
                case 'delete-wiki-article':
                    if (confirm('Wiki-Artikel wirklich löschen?')) {
                        await this.deleteWikiArticle(id);
                        await this.loadSection('wiki');
                        this.showSuccess('Wiki-Artikel gelöscht!');
                    }
                    break;
                default:
                    console.log('Unknown action:', action);
            }
        } catch (error) {
            this.showError('Aktion fehlgeschlagen: ' + error.message);
        }
    }

    async handleFormSubmit(formType, form) {
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Convert array fields
            if (data.tags) {
                data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }

            switch (formType) {
                case 'protocol':
                    const protocolId = form.dataset.protocolId;
                    if (protocolId) {
                        await this.updateProtocol(protocolId, data);
                        this.showSuccess('Protokoll aktualisiert!');
                    } else {
                        await this.createProtocol(data);
                        this.showSuccess('Protokoll erstellt!');
                    }
                    await this.loadSection('zuchtprotokoll');
                    break;
                
                case 'wiki':
                    const articleSlug = form.dataset.articleSlug;
                    if (articleSlug) {
                        await this.updateWikiArticle(articleSlug, data);
                        this.showSuccess('Wiki-Artikel aktualisiert!');
                    } else {
                        await this.createWikiArticle(data);
                        this.showSuccess('Wiki-Artikel erstellt!');
                    }
                    await this.loadSection('wiki');
                    break;
            }
        } catch (error) {
            this.showError('Speichern fehlgeschlagen: ' + error.message);
        }
    }

    switchSection(section) {
        // Update active navigation
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Update mobile nav colors
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            const icon = item.querySelector('i');
            const span = item.querySelector('span');
            if (item.dataset.section === section) {
                icon.className = icon.className.replace('text-gray-400', 'text-blue-600');
                span.className = span.className.replace('text-gray-400', 'text-blue-600');
            } else {
                icon.className = icon.className.replace('text-blue-600', 'text-gray-400');
                span.className = span.className.replace('text-blue-600', 'text-gray-400');
            }
        });

        this.loadSection(section);
    }

    async loadSection(section) {
        this.currentSection = section;
        
        // Update page titles
        const titles = {
            dashboard: { title: 'Dashboard', desc: 'Übersicht Ihrer Pilzzucht-Aktivitäten' },
            zuchtprotokoll: { title: 'Zuchtprotokolle', desc: 'Verwalten Sie Ihre Zucht-Dokumentation' },
            wiki: { title: 'Wiki', desc: 'Pilzzucht-Wissensdatenbank' },
            inventar: { title: 'Inventar', desc: 'Material- und Bestandsverwaltung' },
            kulturen: { title: 'Kulturen', desc: 'Aktive Kulturen verwalten' },
            rechner: { title: 'Rechner', desc: 'Berechnungswerkzeuge für die Pilzzucht' },
            einstellungen: { title: 'Einstellungen', desc: 'App-Konfiguration' }
        };

        const info = titles[section] || titles.dashboard;
        document.getElementById('pageTitle').textContent = info.title;
        document.getElementById('pageDescription').textContent = info.desc;
        document.getElementById('pageTitleMobile').textContent = info.title;
        document.getElementById('pageDescriptionMobile').textContent = info.desc;

        // Load section content
        const content = document.getElementById('content');
        content.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p class="mt-4 text-gray-600">Lade...</p></div>';

        try {
            switch (section) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'zuchtprotokoll':
                    await this.loadProtocols();
                    break;
                case 'wiki':
                    await this.loadWiki();
                    break;
                default:
                    this.loadPlaceholder(section);
            }
        } catch (error) {
            content.innerHTML = `<div class="text-center py-8 text-red-600">Fehler beim Laden: ${error.message}</div>`;
        }
    }

    // Utility Methods
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    formatDate(dateString) {
        if (!dateString) return 'Nicht gesetzt';
        return new Date(dateString).toLocaleDateString('de-DE');
    }

    formatDateTime(dateString) {
        if (!dateString) return 'Nicht gesetzt';
        return new Date(dateString).toLocaleString('de-DE');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mushroomManager = new MushroomManager();
});