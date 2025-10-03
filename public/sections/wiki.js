// Wiki Section for Mushroom Manager
MushroomManager.prototype.loadWiki = async function() {
    const content = document.getElementById('content');
    
    try {
        const [articles, categories] = await Promise.all([
            this.getWikiArticles(),
            this.getWikiCategories()
        ]);

        content.innerHTML = `
            <div class="space-y-6">
                <!-- Header with Create Button -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Wiki</h2>
                        <p class="text-gray-600">Pilzzucht-Wissensdatenbank</p>
                    </div>
                    <button data-action="create-wiki-article" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Neuer Artikel
                    </button>
                </div>

                <!-- Categories Filter -->
                <div class="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Kategorien</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <button onclick="mushroomManager.filterWikiByCategory(null)" 
                            class="category-filter active flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <i class="fas fa-list text-xl text-gray-600 mb-2"></i>
                            <span class="text-sm font-medium">Alle</span>
                            <span class="text-xs text-gray-500">${articles.length}</span>
                        </button>
                        ${this.renderWikiCategories(categories, articles)}
                    </div>
                </div>

                <!-- Articles List -->
                <div id="wiki-articles" class="grid gap-4">
                    ${this.renderWikiArticles(articles)}
                </div>
                
                ${articles.length === 0 ? this.renderEmptyWiki() : ''}
            </div>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Fehler beim Laden des Wikis</h3>
                <p class="text-gray-600">${error.message}</p>
            </div>
        `;
    }
};

MushroomManager.prototype.renderWikiCategories = function(categories, articles) {
    return categories.map(category => {
        const articleCount = articles.filter(article => article.category === category.name).length;
        return `
            <button onclick="mushroomManager.filterWikiByCategory('${category.name}')" 
                class="category-filter flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <i class="${category.icon} text-xl mb-2" style="color: ${category.color}"></i>
                <span class="text-sm font-medium">${category.name}</span>
                <span class="text-xs text-gray-500">${articleCount}</span>
            </button>
        `;
    }).join('');
};

MushroomManager.prototype.renderWikiArticles = function(articles) {
    return articles.map(article => `
        <div class="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <h3 class="text-lg font-semibold text-gray-900 mr-3">${article.title}</h3>
                            <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                ${article.category}
                            </span>
                        </div>
                        
                        ${article.summary ? `
                            <p class="text-gray-600 mb-4">${article.summary}</p>
                        ` : ''}
                        
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${article.tags ? article.tags.map(tag => `
                                <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">#${tag}</span>
                            `).join('') : ''}
                        </div>
                        
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="fas fa-user mr-2"></i>
                            <span class="mr-4">${article.author || 'Admin'}</span>
                            <i class="fas fa-calendar mr-2"></i>
                            <span class="mr-4">${this.formatDate(article.created_at)}</span>
                            <i class="fas fa-eye mr-2"></i>
                            <span>${article.view_count || 0} Aufrufe</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-col space-y-2 ml-4">
                        <button onclick="mushroomManager.viewWikiArticle('${article.slug}')"
                            class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                            <i class="fas fa-eye mr-1"></i>
                            Anzeigen
                        </button>
                        <button data-action="edit-wiki-article" data-id="${article.slug}"
                            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            <i class="fas fa-edit mr-1"></i>
                            Bearbeiten
                        </button>
                        <button data-action="delete-wiki-article" data-id="${article.slug}"
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

MushroomManager.prototype.renderEmptyWiki = function() {
    return `
        <div class="text-center py-12">
            <i class="fas fa-book-open text-4xl text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Noch keine Wiki-Artikel</h3>
            <p class="text-gray-600 mb-4">Erstellen Sie Ihren ersten Wissensbeitrag</p>
            <button data-action="create-wiki-article" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                <i class="fas fa-plus mr-2"></i>
                Ersten Artikel erstellen
            </button>
        </div>
    `;
};

MushroomManager.prototype.filterWikiByCategory = async function(categoryName) {
    try {
        // Update active filter
        document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
        event.target.closest('.category-filter').classList.add('active');
        
        // Fetch filtered articles
        const articles = await this.getWikiArticles(categoryName);
        
        // Update articles display
        const articlesContainer = document.getElementById('wiki-articles');
        articlesContainer.innerHTML = this.renderWikiArticles(articles);
        
    } catch (error) {
        this.showError('Fehler beim Filtern: ' + error.message);
    }
};

MushroomManager.prototype.viewWikiArticle = async function(slug) {
    const content = document.getElementById('content');
    
    try {
        const article = await this.getWikiArticle(slug);
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl border border-gray-200">
                    <!-- Article Header -->
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between mb-4">
                            <button onclick="mushroomManager.loadSection('wiki')" 
                                class="text-blue-600 hover:text-blue-700 flex items-center">
                                <i class="fas fa-arrow-left mr-2"></i>
                                Zurück zum Wiki
                            </button>
                            <div class="flex space-x-2">
                                <button data-action="edit-wiki-article" data-id="${article.slug}"
                                    class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                    <i class="fas fa-edit mr-1"></i>
                                    Bearbeiten
                                </button>
                            </div>
                        </div>
                        
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">${article.title}</h1>
                        
                        <div class="flex items-center text-sm text-gray-600 space-x-4">
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">${article.category}</span>
                            <span><i class="fas fa-user mr-1"></i>${article.author}</span>
                            <span><i class="fas fa-calendar mr-1"></i>${this.formatDate(article.created_at)}</span>
                            <span><i class="fas fa-eye mr-1"></i>${article.view_count} Aufrufe</span>
                        </div>
                        
                        ${article.tags && article.tags.length > 0 ? `
                            <div class="flex flex-wrap gap-2 mt-4">
                                ${article.tags.map(tag => `
                                    <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">#${tag}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Article Content -->
                    <div class="p-6">
                        <div class="prose prose-lg max-w-none">
                            ${this.renderMarkdown(article.content)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Artikel nicht gefunden</h3>
                <p class="text-gray-600">${error.message}</p>
                <button onclick="mushroomManager.loadSection('wiki')" 
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Zurück zum Wiki
                </button>
            </div>
        `;
    }
};

MushroomManager.prototype.showWikiForm = async function(articleSlug = null) {
    const content = document.getElementById('content');
    
    let article = null;
    let categories = [];
    
    try {
        categories = await this.getWikiCategories();
        
        if (articleSlug) {
            article = await this.getWikiArticle(articleSlug);
        }
    } catch (error) {
        this.showError('Daten konnten nicht geladen werden: ' + error.message);
        return;
    }

    const isEdit = !!article;
    const title = isEdit ? 'Artikel bearbeiten' : 'Neuen Artikel erstellen';

    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900">${title}</h2>
                        <button onclick="mushroomManager.loadSection('wiki')" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <form data-form="wiki" ${article ? `data-article-slug="${article.slug}"` : ''} class="p-6">
                    <div class="space-y-6">
                        <!-- Basic Information -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Artikel-Informationen</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
                                    <input type="text" name="title" required 
                                        value="${article?.title || ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="z.B. Austernpilz (Pleurotus ostreatus)">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kategorie *</label>
                                    <select name="category" required 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Kategorie auswählen</option>
                                        ${categories.map(category => `
                                            <option value="${category.name}" ${article?.category === category.name ? 'selected' : ''}>
                                                ${category.name}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select name="status" 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="published" ${article?.status === 'published' ? 'selected' : ''}>Veröffentlicht</option>
                                        <option value="draft" ${article?.status === 'draft' ? 'selected' : ''}>Entwurf</option>
                                        <option value="archived" ${article?.status === 'archived' ? 'selected' : ''}>Archiviert</option>
                                    </select>
                                </div>
                                
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Zusammenfassung</label>
                                    <textarea name="summary" rows="2" 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Kurze Beschreibung des Artikel-Inhalts...">${article?.summary || ''}</textarea>
                                </div>
                                
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <input type="text" name="tags" 
                                        value="${article?.tags ? article.tags.join(', ') : ''}"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tags durch Komma getrennt, z.B. anfänger, pilzart, einfach">
                                    <p class="text-xs text-gray-500 mt-1">Tags helfen beim Filtern und Suchen von Artikeln</p>
                                </div>
                            </div>
                        </div>

                        <!-- Content Editor -->
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold text-gray-900">Artikel-Inhalt</h3>
                                <div class="text-sm text-gray-600">
                                    <i class="fab fa-markdown mr-1"></i>
                                    Markdown unterstützt
                                </div>
                            </div>
                            
                            <div class="border border-gray-300 rounded-lg">
                                <!-- Markdown Toolbar -->
                                <div class="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
                                    <button type="button" onclick="mushroomManager.insertMarkdown('**', '**', 'Fetter Text')" 
                                        class="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Fett">
                                        <i class="fas fa-bold"></i>
                                    </button>
                                    <button type="button" onclick="mushroomManager.insertMarkdown('*', '*', 'Kursiver Text')" 
                                        class="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Kursiv">
                                        <i class="fas fa-italic"></i>
                                    </button>
                                    <button type="button" onclick="mushroomManager.insertMarkdown('## ', '', 'Überschrift')" 
                                        class="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Überschrift">
                                        <i class="fas fa-heading"></i>
                                    </button>
                                    <button type="button" onclick="mushroomManager.insertMarkdown('- ', '', 'Listenpunkt')" 
                                        class="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Liste">
                                        <i class="fas fa-list-ul"></i>
                                    </button>
                                    <button type="button" onclick="mushroomManager.insertMarkdown('[', '](url)', 'Link-Text')" 
                                        class="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Link">
                                        <i class="fas fa-link"></i>
                                    </button>
                                </div>
                                
                                <textarea id="content-editor" name="content" rows="15" 
                                    class="w-full px-3 py-2 border-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Artikel-Inhalt in Markdown-Format...">${article?.content || ''}</textarea>
                            </div>
                            
                            <div class="mt-2 text-xs text-gray-500">
                                <strong>Markdown-Tipps:</strong> 
                                # Überschrift 1, ## Überschrift 2, **fett**, *kursiv*, - Listenpunkt, [Link](URL)
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <button type="button" onclick="mushroomManager.loadSection('wiki')" 
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            Abbrechen
                        </button>
                        <button type="submit" 
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                            <i class="fas fa-save mr-2"></i>
                            ${isEdit ? 'Aktualisieren' : 'Veröffentlichen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
};

// Markdown and utility methods
MushroomManager.prototype.renderMarkdown = function(markdown) {
    if (!markdown) return '';
    
    // Simple markdown rendering (you might want to use a library like marked.js for production)
    return markdown
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/^(?!<[h|l])(.+)$/gim, '<p class="mb-4">$1</p>')
        .replace(/<li class="ml-4">(.*?)<\/li>/gs, '<ul class="list-disc list-inside mb-4"><li class="ml-4">$1</li></ul>');
};

MushroomManager.prototype.insertMarkdown = function(before, after, placeholder) {
    const textarea = document.getElementById('content-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;
    
    const replacement = before + selectedText + after;
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    
    // Set cursor position
    const newPos = start + before.length + selectedText.length;
    textarea.setSelectionRange(newPos, newPos);
    textarea.focus();
};