/**
 * Photo Upload Component
 * Handles file uploads to Supabase Storage
 */
class PhotoUploadComponent {
    constructor(options = {}) {
        this.options = {
            maxFiles: 5,
            maxFileSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
            bucket: 'protocol-photos',
            showPreview: true,
            ...options
        };
        
        this.uploadedFiles = [];
        this.element = null;
    }

    render(containerId, existingImages = []) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container nicht gefunden:', containerId);
            return;
        }

        this.uploadedFiles = existingImages.map(url => ({ url, uploaded: true }));

        container.innerHTML = `
            <div class="photo-upload-container">
                <div class="upload-area" id="upload-area-${containerId}">
                    <div class="upload-zone" id="upload-zone-${containerId}">
                        <i class="fas fa-camera text-4xl text-gray-400 mb-4"></i>
                        <p class="text-lg font-medium text-gray-700 mb-2">Fotos hinzufügen</p>
                        <p class="text-sm text-gray-500 mb-4">
                            Ziehe Dateien hierher oder klicke zum Auswählen
                        </p>
                        <p class="text-xs text-gray-400">
                            Max. ${this.options.maxFiles} Dateien, je bis zu ${Math.round(this.options.maxFileSize / 1024 / 1024)}MB
                        </p>
                        <input 
                            type="file" 
                            id="file-input-${containerId}" 
                            multiple 
                            accept="image/*" 
                            class="hidden"
                        >
                    </div>
                </div>
                
                <div class="preview-container mt-4" id="preview-container-${containerId}">
                    ${this.renderPreviews()}
                </div>
                
                <div class="upload-progress mt-4 hidden" id="upload-progress-${containerId}">
                    <div class="bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%" id="progress-bar-${containerId}"></div>
                    </div>
                    <p class="text-sm text-gray-600 mt-1" id="progress-text-${containerId}">Uploading...</p>
                </div>
            </div>
        `;

        this.attachEventListeners(containerId);
        this.element = container;
        
        return this;
    }

    renderPreviews() {
        if (!this.uploadedFiles.length) return '';

        return `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${this.uploadedFiles.map((file, index) => `
                    <div class="relative group">
                        <img 
                            src="${file.url}" 
                            alt="Preview ${index + 1}"
                            class="w-full h-24 object-cover rounded-lg border border-gray-200"
                        >
                        <button 
                            type="button"
                            onclick="this.closest('.photo-upload-container').photoUploader.removeFile(${index})"
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <i class="fas fa-times"></i>
                        </button>
                        ${!file.uploaded ? `
                            <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                <i class="fas fa-spinner fa-spin text-white"></i>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners(containerId) {
        const uploadZone = document.getElementById(`upload-zone-${containerId}`);
        const fileInput = document.getElementById(`file-input-${containerId}`);
        
        // Store reference to this instance
        document.getElementById(`preview-container-${containerId}`).closest('.photo-upload-container').photoUploader = this;

        // Click to upload
        uploadZone.addEventListener('click', () => {
            if (this.uploadedFiles.length < this.options.maxFiles) {
                fileInput.click();
            }
        });

        // File selection
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(Array.from(e.target.files), containerId);
        });

        // Drag & Drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('border-blue-500', 'bg-blue-50');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('border-blue-500', 'bg-blue-50');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('border-blue-500', 'bg-blue-50');
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files, containerId);
        });
    }

    async handleFiles(files, containerId) {
        // Filter and validate files
        const validFiles = files.filter(file => {
            if (!this.options.allowedTypes.includes(file.type)) {
                this.showError(`${file.name}: Dateityp nicht unterstützt`);
                return false;
            }
            if (file.size > this.options.maxFileSize) {
                this.showError(`${file.name}: Datei zu groß (max. ${Math.round(this.options.maxFileSize / 1024 / 1024)}MB)`);
                return false;
            }
            return true;
        });

        // Check file limit
        if (this.uploadedFiles.length + validFiles.length > this.options.maxFiles) {
            this.showError(`Maximal ${this.options.maxFiles} Dateien erlaubt`);
            return;
        }

        // Upload files
        for (const file of validFiles) {
            await this.uploadFile(file, containerId);
        }
    }

    async uploadFile(file, containerId) {
        const progressContainer = document.getElementById(`upload-progress-${containerId}`);
        const progressBar = document.getElementById(`progress-bar-${containerId}`);
        const progressText = document.getElementById(`progress-text-${containerId}`);

        try {
            // Show progress
            progressContainer.classList.remove('hidden');
            progressText.textContent = `Uploading ${file.name}...`;

            // Create preview immediately
            const tempUrl = URL.createObjectURL(file);
            this.uploadedFiles.push({ url: tempUrl, uploaded: false, file });
            this.updatePreviews(containerId);

            // Prepare form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', this.options.bucket);

            // Upload file
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            progressBar.style.width = '100%';

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json();
            
            // Update file entry with actual URL
            const fileIndex = this.uploadedFiles.findIndex(f => f.file === file);
            if (fileIndex !== -1) {
                URL.revokeObjectURL(tempUrl); // Clean up temp URL
                this.uploadedFiles[fileIndex] = { url: result.publicUrl, uploaded: true };
                this.updatePreviews(containerId);
            }

            progressText.textContent = 'Upload erfolgreich!';
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                progressBar.style.width = '0%';
            }, 1500);

        } catch (error) {
            console.error('Upload error:', error);
            this.showError(`Upload fehlgeschlagen: ${error.message}`);
            
            // Remove failed upload from list
            this.uploadedFiles = this.uploadedFiles.filter(f => f.file !== file);
            this.updatePreviews(containerId);
            
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
        }
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.updatePreviews();
    }

    updatePreviews(containerId) {
        const container = document.getElementById(`preview-container-${containerId || this.getContainerId()}`);
        if (container) {
            container.innerHTML = this.renderPreviews();
        }
    }

    getContainerId() {
        // Helper to get container ID when called from button
        const container = this.element?.querySelector('.photo-upload-container');
        return container?.id || '';
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.upload-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'upload-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2';
            this.element?.appendChild(errorDiv);
        }
        
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv?.remove();
        }, 5000);
    }

    getUploadedUrls() {
        return this.uploadedFiles
            .filter(file => file.uploaded)
            .map(file => file.url);
    }

    clear() {
        this.uploadedFiles = [];
        if (this.element) {
            const containerId = this.element.querySelector('.upload-area').id.replace('upload-area-', '');
            this.updatePreviews(containerId);
        }
    }
}

// CSS Styles (add to your main CSS file or include here)
const uploadStyles = `
<style>
.upload-zone {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    background: #fafafa;
}

.upload-zone:hover {
    border-color: #3b82f6;
    background: #eff6ff;
}

.upload-zone.border-blue-500 {
    border-color: #3b82f6;
    background: #eff6ff;
}

.photo-upload-container .preview-container img {
    transition: all 0.3s ease;
}

.photo-upload-container .preview-container img:hover {
    transform: scale(1.05);
}
</style>
`;

// Inject styles if not already present
if (!document.querySelector('#photo-upload-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'photo-upload-styles';
    styleElement.innerHTML = uploadStyles;
    document.head.appendChild(styleElement);
}

// Make PhotoUploadComponent globally available
window.PhotoUploadComponent = PhotoUploadComponent;