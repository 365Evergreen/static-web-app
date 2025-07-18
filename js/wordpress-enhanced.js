// Enhanced WordPress Integration Configuration
const WordPressConfig = {
    // Primary configuration - choose one method
    method: 'direct', // 'direct' or 'proxy'
    
    // Direct API configuration
    direct: {
        siteUrl: 'https://your-wordpress-site.com', // 👈 Update this!
        apiPath: '/wp-json/wp/v2'
    },
    
    // Proxy API configuration (uses your Azure Function)
    proxy: {
        baseUrl: '/api/wordpress', // Your Azure Function endpoint
        addCorsHeaders: true
    },
    
    // Cache settings
    cache: {
        enabled: true,
        duration: 5 * 60 * 1000 // 5 minutes in milliseconds
    },
    
    // Display settings
    display: {
        postsPerPage: 6,
        excerptLength: 150,
        dateFormat: 'en-AU',
        showAuthor: true,
        showReadingTime: true,
        showCategories: true
    },
    
    // Category color mapping
    categoryColors: {
        'Microsoft 365': { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'bg-blue-600' },
        'Power Platform': { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'bg-purple-600' },
        'Business Strategy': { bg: 'bg-green-100', text: 'text-green-600', icon: 'bg-green-600' },
        'Azure': { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'bg-blue-600' },
        'Office 365': { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'bg-blue-600' },
        'Power BI': { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'bg-yellow-600' },
        'SharePoint': { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: 'bg-indigo-600' },
        'Teams': { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'bg-purple-600' }
    },
    
    // Fallback configuration
    fallback: {
        showStaticContent: true,
        errorMessage: 'Unable to load blog posts at this time. Please check back later.'
    }
};

// Enhanced WordPress API Class with Caching and Error Handling
class EnhancedWordPressAPI extends WordPressAPI {
    constructor(config = WordPressConfig) {
        const siteUrl = config.method === 'proxy' ? window.location.origin : config.direct.siteUrl;
        super(siteUrl);
        
        this.config = config;
        this.cache = new Map();
        this.isProxy = config.method === 'proxy';
        
        if (this.isProxy) {
            this.apiBase = config.proxy.baseUrl;
        }
    }

    /**
     * Enhanced fetch with caching and error handling
     */
    async fetchWithCache(url, cacheKey) {
        // Check cache first
        if (this.config.cache.enabled && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.cache.duration) {
                console.log(`📦 Cache hit for: ${cacheKey}`);
                return cached.data;
            }
        }

        try {
            console.log(`🌐 Fetching: ${url}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            if (this.config.cache.enabled) {
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
            }
            
            return data;
            
        } catch (error) {
            console.error(`❌ Fetch error for ${url}:`, error);
            
            // Return cached data if available, even if expired
            if (this.cache.has(cacheKey)) {
                console.log(`📦 Using expired cache for: ${cacheKey}`);
                return this.cache.get(cacheKey).data;
            }
            
            throw error;
        }
    }

    /**
     * Override getPosts with enhanced functionality
     */
    async getPosts(options = {}) {
        const params = new URLSearchParams({
            per_page: options.per_page || this.config.display.postsPerPage,
            page: options.page || 1,
            _embed: 'true',
            ...options
        });

        const endpoint = this.isProxy ? 'posts' : 'posts';
        const url = `${this.apiBase}/${endpoint}?${params}`;
        const cacheKey = `posts_${params.toString()}`;

        try {
            const posts = await this.fetchWithCache(url, cacheKey);
            return this.formatPosts(posts);
        } catch (error) {
            console.error('Error fetching WordPress posts:', error);
            throw error;
        }
    }

    /**
     * Get site info
     */
    async getSiteInfo() {
        const endpoint = this.isProxy ? '' : '';
        const url = this.isProxy ? `${this.apiBase}/` : `${this.siteUrl}/wp-json`;
        const cacheKey = 'site_info';

        try {
            return await this.fetchWithCache(url, cacheKey);
        } catch (error) {
            console.warn('Could not fetch site info:', error);
            return { name: '365 Evergreen Blog' };
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ WordPress API cache cleared');
    }
}

// Enhanced Blog Integration with Better Error Handling
class EnhancedBlogIntegration extends BlogIntegration {
    constructor(config = WordPressConfig) {
        // Don't call super constructor, we'll initialize differently
        this.wp = new EnhancedWordPressAPI(config);
        this.config = config;
        this.loading = false;
        this.currentPage = 1;
        this.hasMorePosts = true;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    /**
     * Initialize with better error handling and fallbacks
     */
    async init() {
        try {
            console.log('🚀 Initializing WordPress blog integration...');
            
            // Show loading state
            this.showLoadingState();
            
            // Test WordPress connection first
            await this.testWordPressConnection();
            
            // Load content
            await Promise.all([
                this.loadFeaturedPost(),
                this.loadRecentPosts()
            ]);
            
            this.setupEventListeners();
            console.log('✅ WordPress blog integration initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize blog integration:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Test WordPress connection
     */
    async testWordPressConnection() {
        try {
            await this.wp.getSiteInfo();
            console.log('✅ WordPress connection successful');
        } catch (error) {
            console.error('❌ WordPress connection failed:', error);
            throw new Error('Cannot connect to WordPress site. Please check the configuration.');
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const featuredSection = document.getElementById('featured-article');
        const recentSection = document.getElementById('recent-articles');
        
        if (featuredSection) {
            featuredSection.innerHTML = `
                <div class="text-center py-12">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading featured article from WordPress...</p>
                </div>
            `;
        }
        
        if (recentSection) {
            recentSection.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading recent articles...</p>
                </div>
            `;
        }
    }

    /**
     * Handle initialization errors with fallback content
     */
    handleInitializationError(error) {
        const featuredSection = document.getElementById('featured-article');
        const recentSection = document.getElementById('recent-articles');
        
        if (this.config.fallback.showStaticContent) {
            // Show static fallback content
            this.showStaticFallback();
        } else {
            // Show error message
            const errorHtml = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Blog Temporarily Unavailable</h3>
                    <p class="text-gray-600 mb-4">${this.config.fallback.errorMessage}</p>
                    <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
                </div>
            `;
            
            if (featuredSection) featuredSection.innerHTML = errorHtml;
            if (recentSection) recentSection.innerHTML = errorHtml;
        }
    }

    /**
     * Show static fallback content
     */
    showStaticFallback() {
        // This would render the original static content from your HTML
        // You could move the original static HTML to a template and render it here
        console.log('📄 Showing static fallback content');
        
        // For now, we'll just show a message encouraging users to visit the WordPress site directly
        const fallbackHtml = `
            <div class="text-center py-12">
                <h3 class="text-lg font-semibold mb-4">Latest Blog Posts</h3>
                <p class="text-gray-600 mb-6">
                    Our latest insights are available on our main blog site.
                </p>
                <a href="${this.config.direct.siteUrl}/blog" target="_blank" rel="noopener" class="btn btn-primary">
                    Visit Our Blog →
                </a>
            </div>
        `;
        
        const featuredSection = document.getElementById('featured-article');
        const recentSection = document.getElementById('recent-articles');
        
        if (featuredSection) featuredSection.innerHTML = fallbackHtml;
        if (recentSection) recentSection.innerHTML = fallbackHtml;
    }

    /**
     * Enhanced post card creation with better error handling
     */
    createPostCard(post) {
        try {
            return super.createPostCard(post);
        } catch (error) {
            console.error('Error creating post card:', error);
            
            // Return a minimal error card
            const article = document.createElement('article');
            article.className = 'bg-white rounded-lg shadow-sm overflow-hidden';
            article.innerHTML = `
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-3">Post Unavailable</h3>
                    <p class="text-gray-600">This post could not be loaded.</p>
                </div>
            `;
            return article;
        }
    }
}

// Initialize with configuration
if (typeof window !== 'undefined') {
    window.WordPressConfig = WordPressConfig;
    window.EnhancedWordPressAPI = EnhancedWordPressAPI;
    window.EnhancedBlogIntegration = EnhancedBlogIntegration;
}
