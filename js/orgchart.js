/**
 * 365 Evergreen Organizational Chart
 * Powered by Microsoft Graph API and Entra ID
 */

class OrgChartManager {
    constructor() {
        this.apiBaseUrl = '/api/orgchart';
        this.orgData = null;
        this.currentStyles = {
            fontFamily: 'Inter',
            fontSize: '14',
            fontWeight: '400',
            fontColor: '#374151',
            showPhotos: true
        };
        
        this.init();
    }

    /**
     * Initialize the organizational chart manager
     */
    init() {
        this.bindEvents();
        this.loadInitialStyles();
        this.loadOrgChart();
    }

    /**
     * Bind UI events
     */
    bindEvents() {
        // Properties panel controls
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.currentStyles.fontFamily = e.target.value;
            this.applyStyles();
        });

        document.getElementById('fontSize').addEventListener('change', (e) => {
            this.currentStyles.fontSize = e.target.value;
            this.applyStyles();
        });

        document.getElementById('fontWeight').addEventListener('change', (e) => {
            this.currentStyles.fontWeight = e.target.value;
            this.applyStyles();
        });

        document.getElementById('fontColor').addEventListener('change', (e) => {
            this.currentStyles.fontColor = e.target.value;
            document.getElementById('fontColorText').value = e.target.value;
            this.applyStyles();
        });

        document.getElementById('fontColorText').addEventListener('change', (e) => {
            const color = e.target.value;
            if (this.isValidColor(color)) {
                this.currentStyles.fontColor = color;
                document.getElementById('fontColor').value = color;
                this.applyStyles();
            }
        });

        document.getElementById('showPhotos').addEventListener('change', (e) => {
            this.currentStyles.showPhotos = e.target.checked;
            this.applyStyles();
        });

        // Action buttons
        document.getElementById('refreshChart').addEventListener('click', () => {
            this.loadOrgChart();
        });

        document.getElementById('testConnection').addEventListener('click', () => {
            this.testConnection();
        });
    }

    /**
     * Load initial styles from localStorage or defaults
     */
    loadInitialStyles() {
        const savedStyles = localStorage.getItem('orgchartStyles');
        if (savedStyles) {
            try {
                const styles = JSON.parse(savedStyles);
                this.currentStyles = { ...this.currentStyles, ...styles };
                
                // Update UI controls
                document.getElementById('fontFamily').value = this.currentStyles.fontFamily;
                document.getElementById('fontSize').value = this.currentStyles.fontSize;
                document.getElementById('fontWeight').value = this.currentStyles.fontWeight;
                document.getElementById('fontColor').value = this.currentStyles.fontColor;
                document.getElementById('fontColorText').value = this.currentStyles.fontColor;
                document.getElementById('showPhotos').checked = this.currentStyles.showPhotos;
            } catch (e) {
                console.warn('Failed to load saved styles:', e);
            }
        }
        
        this.applyStyles();
    }

    /**
     * Save current styles to localStorage
     */
    saveStyles() {
        localStorage.setItem('orgchartStyles', JSON.stringify(this.currentStyles));
    }

    /**
     * Apply current styles to the chart
     */
    applyStyles() {
        const chart = document.getElementById('orgChart');
        if (!chart) return;

        // Apply font styles
        chart.style.fontFamily = this.currentStyles.fontFamily;
        chart.style.fontSize = this.currentStyles.fontSize + 'px';
        chart.style.fontWeight = this.currentStyles.fontWeight;
        chart.style.color = this.currentStyles.fontColor;

        // Toggle photo visibility
        const photos = chart.querySelectorAll('.user-photo, .default-avatar');
        photos.forEach(photo => {
            photo.style.display = this.currentStyles.showPhotos ? 'block' : 'none';
        });

        // Adjust card layout when photos are hidden
        const userCards = chart.querySelectorAll('.user-card');
        userCards.forEach(card => {
            if (this.currentStyles.showPhotos) {
                card.classList.add('flex', 'items-center', 'space-x-3');
            } else {
                card.classList.remove('flex', 'items-center', 'space-x-3');
            }
        });

        this.saveStyles();
    }

    /**
     * Validate if a string is a valid color
     */
    isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    /**
     * Show loading state
     */
    showLoading(message = 'Loading organizational chart...') {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('loadingState').querySelector('p').textContent = message;
        document.getElementById('errorState').classList.add('hidden');
        document.getElementById('successState').classList.add('hidden');
        document.getElementById('orgChart').classList.add('hidden');
        document.getElementById('chartStats').classList.add('hidden');
    }

    /**
     * Show error state
     */
    showError(message) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
        document.getElementById('errorText').textContent = message;
        document.getElementById('successState').classList.add('hidden');
        document.getElementById('orgChart').classList.add('hidden');
        document.getElementById('chartStats').classList.add('hidden');
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        document.getElementById('successState').classList.remove('hidden');
        document.getElementById('successText').textContent = message;
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            document.getElementById('successState').classList.add('hidden');
        }, 3000);
    }

    /**
     * Show the organizational chart
     */
    showChart() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
        document.getElementById('orgChart').classList.remove('hidden');
        document.getElementById('chartStats').classList.remove('hidden');
    }

    /**
     * Load organizational chart data from API
     */
    async loadOrgChart() {
        try {
            this.showLoading('Loading organizational chart...');

            const response = await fetch(`${this.apiBaseUrl}?action=getOrgChart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to load organizational chart');
            }

            this.orgData = result.data;
            this.renderChart(this.orgData);
            this.updateStatistics(result.totalUsers);
            this.showChart();
            this.applyStyles();

        } catch (error) {
            console.error('Error loading organizational chart:', error);
            
            let errorMessage = 'Failed to load organizational chart. ';
            if (error.message.includes('fetch')) {
                errorMessage += 'Please check your network connection.';
            } else if (error.message.includes('Authentication')) {
                errorMessage += 'Authentication failed. Please check the service configuration.';
            } else {
                errorMessage += error.message;
            }
            
            this.showError(errorMessage);
        }
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            this.showLoading('Testing connection to Microsoft Graph...');

            const response = await fetch(`${this.apiBaseUrl}?action=testConnection`);
            const result = await response.json();

            if (result.success && result.connected) {
                this.showSuccess('Connection to Microsoft Graph is working correctly!');
            } else {
                this.showError('Connection test failed: ' + (result.message || 'Unknown error'));
            }

        } catch (error) {
            console.error('Connection test error:', error);
            this.showError('Connection test failed: ' + error.message);
        }
    }

    /**
     * Render the organizational chart
     */
    renderChart(orgData) {
        const chartContainer = document.getElementById('orgChart');
        chartContainer.innerHTML = '';

        if (!orgData || orgData.length === 0) {
            chartContainer.innerHTML = '<div class="text-center text-gray-500 py-8">No organizational data available</div>';
            return;
        }

        // Render each root node
        orgData.forEach(rootNode => {
            const nodeElement = this.renderOrgNode(rootNode, 0);
            chartContainer.appendChild(nodeElement);
        });
    }

    /**
     * Render a single organizational node
     */
    renderOrgNode(node, level) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'org-node';
        nodeDiv.style.marginLeft = (level * 40) + 'px';

        // Create user card
        const userCard = document.createElement('div');
        userCard.className = 'user-card p-4 mb-4 max-w-sm mx-auto flex items-center space-x-3';
        userCard.setAttribute('data-user-id', node.id);

        // Profile photo or avatar
        const photoContainer = document.createElement('div');
        photoContainer.className = 'flex-shrink-0';

        if (node.photoUrl) {
            const photo = document.createElement('img');
            photo.src = node.photoUrl;
            photo.alt = node.displayName;
            photo.className = 'user-photo';
            photo.onerror = () => {
                // If photo fails to load, show default avatar
                photoContainer.innerHTML = this.createDefaultAvatar(node.displayName);
            };
            photoContainer.appendChild(photo);
        } else {
            photoContainer.innerHTML = this.createDefaultAvatar(node.displayName);
        }

        // User details
        const details = document.createElement('div');
        details.className = 'flex-1 min-w-0';

        const name = document.createElement('div');
        name.className = 'font-semibold text-gray-900 truncate';
        name.textContent = node.displayName;

        const title = document.createElement('div');
        title.className = 'text-sm text-gray-600 truncate';
        title.textContent = node.jobTitle || 'No title';

        const department = document.createElement('div');
        department.className = 'text-xs text-gray-500 truncate';
        department.textContent = node.department || 'No department';

        details.appendChild(name);
        details.appendChild(title);
        details.appendChild(department);

        userCard.appendChild(photoContainer);
        userCard.appendChild(details);

        // Add click event for user details
        userCard.addEventListener('click', () => {
            this.showUserDetails(node);
        });

        nodeDiv.appendChild(userCard);

        // Render children if they exist
        if (node.children && node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'ml-8 border-l-2 border-gray-200 pl-4';

            node.children.forEach(child => {
                const childElement = this.renderOrgNode(child, level + 1);
                childrenContainer.appendChild(childElement);
            });

            nodeDiv.appendChild(childrenContainer);
        }

        return nodeDiv;
    }

    /**
     * Create default avatar with initials
     */
    createDefaultAvatar(displayName) {
        const initials = displayName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);

        return `<div class="default-avatar">${initials}</div>`;
    }

    /**
     * Show user details in a modal or popup
     */
    showUserDetails(user) {
        // For now, just log to console and show an alert
        // In a real implementation, you might show a modal with more details
        console.log('User details:', user);
        
        const details = [
            `Name: ${user.displayName}`,
            `Title: ${user.jobTitle || 'N/A'}`,
            `Department: ${user.department || 'N/A'}`,
            `Email: ${user.email || 'N/A'}`,
            `Direct Reports: ${user.children ? user.children.length : 0}`
        ].join('\n');

        alert(`User Details:\n\n${details}`);
    }

    /**
     * Update chart statistics
     */
    updateStatistics(totalUsers) {
        if (!this.orgData) return;

        // Count departments
        const departments = new Set();
        const countDepartments = (nodes) => {
            nodes.forEach(node => {
                if (node.department) {
                    departments.add(node.department);
                }
                if (node.children) {
                    countDepartments(node.children);
                }
            });
        };
        countDepartments(this.orgData);

        // Update UI
        document.getElementById('totalUsers').textContent = totalUsers || 0;
        document.getElementById('departments').textContent = departments.size;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
    }

    /**
     * Load user photos asynchronously
     */
    async loadUserPhotos() {
        if (!this.orgData) return;

        const loadPhotosForNodes = async (nodes) => {
            for (const node of nodes) {
                try {
                    const response = await fetch(`${this.apiBaseUrl}?action=getUserPhoto&userId=${node.id}`);
                    const result = await response.json();
                    
                    if (result.success && result.data.photoUrl) {
                        node.photoUrl = result.data.photoUrl;
                        
                        // Update the DOM if the user card exists
                        const userCard = document.querySelector(`[data-user-id="${node.id}"]`);
                        if (userCard) {
                            const photoContainer = userCard.querySelector('.flex-shrink-0');
                            if (photoContainer) {
                                const photo = document.createElement('img');
                                photo.src = node.photoUrl;
                                photo.alt = node.displayName;
                                photo.className = 'user-photo';
                                photoContainer.innerHTML = '';
                                photoContainer.appendChild(photo);
                            }
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to load photo for user ${node.id}:`, error);
                }

                // Load photos for children
                if (node.children) {
                    await loadPhotosForNodes(node.children);
                }
            }
        };

        await loadPhotosForNodes(this.orgData);
    }
}

// Initialize the organizational chart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.orgChartManager = new OrgChartManager();
    
    // Load photos after initial chart load
    setTimeout(() => {
        if (window.orgChartManager.orgData) {
            window.orgChartManager.loadUserPhotos();
        }
    }, 1000);
});

// Mobile menu toggle function (if needed)
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}