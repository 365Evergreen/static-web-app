// WordPress REST API Integration
class WordPressAPI {
    constructor(siteUrl) {
        this.siteUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash
        this.apiBase = `${this.siteUrl}/wp-json/wp/v2`;
    }

    /**
     * Fetch posts from WordPress
     * @param {Object} options - Query options
     * @param {number} options.per_page - Number of posts per page (default: 10)
     * @param {number} options.page - Page number (default: 1)
     * @param {string} options.search - Search term
     * @param {number[]} options.categories - Category IDs
     * @param {number[]} options.tags - Tag IDs
     * @param {string} options.orderby - Order by field (date, title, etc.)
     * @param {string} options.order - Order direction (asc, desc)
     */
    async getPosts(options = {}) {
        const params = new URLSearchParams({
            per_page: options.per_page || 10,
            page: options.page || 1,
            _embed: 'true', // Include featured images and author info
            ...options
        });

        try {
            const response = await fetch(`${this.apiBase}/posts?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const posts = await response.json();
            return this.formatPosts(posts);
        } catch (error) {
            console.error('Error fetching WordPress posts:', error);
            throw error;
        }
    }

    /**
     * Get a single post by ID or slug
     */
    async getPost(identifier) {
        try {
            const endpoint = isNaN(identifier) 
                ? `${this.apiBase}/posts?slug=${identifier}`
                : `${this.apiBase}/posts/${identifier}`;
            
            const response = await fetch(`${endpoint}?_embed=true`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const post = Array.isArray(data) ? data[0] : data;
            
            return post ? this.formatPost(post) : null;
        } catch (error) {
            console.error('Error fetching WordPress post:', error);
            throw error;
        }
    }

    /**
     * Get categories
     */
    async getCategories() {
        try {
            const response = await fetch(`${this.apiBase}/categories?per_page=100`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    /**
     * Format posts for display
     */
    formatPosts(posts) {
        return posts.map(post => this.formatPost(post));
    }

    /**
     * Format a single post
     */
    formatPost(post) {
        return {
            id: post.id,
            title: this.decodeHtml(post.title.rendered),
            excerpt: this.decodeHtml(post.excerpt.rendered),
            content: post.content.rendered,
            date: new Date(post.date),
            formattedDate: this.formatDate(new Date(post.date)),
            slug: post.slug,
            link: post.link,
            author: this.getAuthorInfo(post),
            featuredImage: this.getFeaturedImage(post),
            categories: this.getCategories(post),
            tags: this.getTags(post),
            readingTime: this.calculateReadingTime(post.content.rendered)
        };
    }

    /**
     * Get author information
     */
    getAuthorInfo(post) {
        if (post._embedded && post._embedded.author && post._embedded.author[0]) {
            const author = post._embedded.author[0];
            return {
                id: author.id,
                name: author.name,
                avatar: author.avatar_urls ? author.avatar_urls[96] : null,
                description: author.description
            };
        }
        return { name: 'Admin' };
    }

    /**
     * Get featured image
     */
    getFeaturedImage(post) {
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
            const media = post._embedded['wp:featuredmedia'][0];
            return {
                url: media.source_url,
                alt: media.alt_text || '',
                caption: media.caption ? media.caption.rendered : '',
                sizes: media.media_details ? media.media_details.sizes : null
            };
        }
        return null;
    }

    /**
     * Get post categories
     */
    getCategories(post) {
        if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]) {
            return post._embedded['wp:term'][0].map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug
            }));
        }
        return [];
    }

    /**
     * Get post tags
     */
    getTags(post) {
        if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][1]) {
            return post._embedded['wp:term'][1].map(tag => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug
            }));
        }
        return [];
    }

    /**
     * Calculate reading time
     */
    calculateReadingTime(content) {
        const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / 200); // Average reading speed
        return `${minutes} min read`;
    }

    /**
     * Format date
     */
    formatDate(date) {
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Decode HTML entities
     */
    decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    /**
     * Strip HTML tags from excerpt
     */
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
}

// WordPress Blog Integration for 365 Evergreen
class BlogIntegration {
    constructor(wordpressSiteUrl) {
        this.wp = new WordPressAPI(wordpressSiteUrl);
        this.loading = false;
        this.currentPage = 1;
        this.hasMorePosts = true;
    }

    /**
     * Initialize the blog integration
     */
    async init() {
        try {
            await this.loadFeaturedPost();
            await this.loadRecentPosts();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize blog integration:', error);
            this.showError('Unable to load blog posts at this time.');
        }
    }

    /**
     * Load featured post
     */
    async loadFeaturedPost() {
        try {
            const posts = await this.wp.getPosts({ per_page: 1 });
            if (posts.length > 0) {
                this.renderFeaturedPost(posts[0]);
            }
        } catch (error) {
            console.error('Error loading featured post:', error);
        }
    }

    /**
     * Load recent posts
     */
    async loadRecentPosts() {
        this.loading = true;
        this.showLoadingSpinner();

        try {
            const posts = await this.wp.getPosts({ 
                per_page: 6, 
                page: this.currentPage,
                offset: 1 // Skip the featured post
            });
            
            this.renderRecentPosts(posts);
            this.hasMorePosts = posts.length === 6;
        } catch (error) {
            console.error('Error loading recent posts:', error);
            this.showError('Unable to load recent posts.');
        } finally {
            this.loading = false;
            this.hideLoadingSpinner();
        }
    }

    /**
     * Render featured post
     */
    renderFeaturedPost(post) {
        const featuredSection = document.getElementById('featured-article');
        if (!featuredSection) return;

        const imageUrl = post.featuredImage ? post.featuredImage.url : '';
        const categories = post.categories.map(cat => cat.name).join(', ');

        featuredSection.innerHTML = `
            <div class="mb-12">
                <h2 class="text-3xl font-bold mb-8">Featured Article</h2>
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="md:flex">
                        <div class="md:w-1/2 ${imageUrl ? 'relative' : 'bg-gradient-to-br from-blue-500 to-purple-600'} p-8 text-white">
                            ${imageUrl ? `
                                <img src="${imageUrl}" alt="${post.featuredImage.alt}" class="absolute inset-0 w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80"></div>
                                <div class="relative z-10">
                            ` : ''}
                            <span class="bg-white/20 text-white px-3 py-1 rounded-full text-sm">Featured</span>
                            <h3 class="text-2xl font-bold mt-4 mb-4">
                                ${post.title}
                            </h3>
                            <p class="mb-6">
                                ${this.wp.stripHtml(post.excerpt)}
                            </p>
                            <a href="${post.link}" target="_blank" rel="noopener" class="inline-flex items-center text-white hover:underline">
                                Read More
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                            ${imageUrl ? '</div>' : ''}
                        </div>
                        <div class="md:w-1/2 p-8">
                            <div class="mb-4">
                                <span class="text-gray-500 text-sm">${post.formattedDate} • ${post.readingTime}</span>
                                ${categories ? `<span class="text-blue-600 text-sm ml-2">${categories}</span>` : ''}
                            </div>
                            <div class="space-y-4 text-gray-600">
                                ${this.wp.stripHtml(post.excerpt)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render recent posts
     */
    renderRecentPosts(posts) {
        const recentSection = document.getElementById('recent-articles');
        if (!recentSection) return;

        const postsGrid = recentSection.querySelector('.posts-grid') || recentSection;
        
        posts.forEach(post => {
            const postElement = this.createPostCard(post);
            postsGrid.appendChild(postElement);
        });
    }

    /**
     * Create a post card element
     */
    createPostCard(post) {
        const article = document.createElement('article');
        article.className = 'bg-white rounded-lg shadow-sm overflow-hidden';

        const category = post.categories[0];
        const categoryColor = this.getCategoryColor(category?.name);
        const imageUrl = post.featuredImage ? post.featuredImage.url : '';

        article.innerHTML = `
            <div class="${categoryColor.bg} h-48 ${imageUrl ? 'relative' : 'flex items-center justify-center'}">
                ${imageUrl ? `
                    <img src="${imageUrl}" alt="${post.featuredImage.alt}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 ${categoryColor.overlay}"></div>
                    <div class="absolute bottom-4 left-4">
                        <span class="${categoryColor.text} font-semibold">${category?.name || 'Blog'}</span>
                    </div>
                ` : `
                    <div class="text-center">
                        <div class="w-16 h-16 ${categoryColor.icon} rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <span class="${categoryColor.text} font-semibold">${category?.name || 'Blog'}</span>
                    </div>
                `}
            </div>
            <div class="p-6">
                <span class="${categoryColor.text} text-sm font-medium">${category?.name || 'Blog'}</span>
                <h3 class="text-xl font-semibold mt-2 mb-3">
                    ${post.title}
                </h3>
                <p class="text-gray-600 mb-4">
                    ${this.wp.stripHtml(post.excerpt).substring(0, 150)}...
                </p>
                <div class="flex items-center justify-between">
                    <span class="text-gray-500 text-sm">${post.formattedDate}</span>
                    <a href="${post.link}" target="_blank" rel="noopener" class="text-blue-600 hover:underline">Read More</a>
                </div>
            </div>
        `;

        return article;
    }

    /**
     * Get category colors
     */
    getCategoryColor(categoryName) {
        const colors = {
            'Microsoft 365': {
                bg: 'bg-blue-100',
                text: 'text-blue-600',
                icon: 'bg-blue-600',
                overlay: 'bg-blue-600/20'
            },
            'Power Platform': {
                bg: 'bg-purple-100',
                text: 'text-purple-600',
                icon: 'bg-purple-600',
                overlay: 'bg-purple-600/20'
            },
            'Business Strategy': {
                bg: 'bg-green-100',
                text: 'text-green-600',
                icon: 'bg-green-600',
                overlay: 'bg-green-600/20'
            },
            'Azure': {
                bg: 'bg-blue-100',
                text: 'text-blue-600',
                icon: 'bg-blue-600',
                overlay: 'bg-blue-600/20'
            }
        };

        return colors[categoryName] || {
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            icon: 'bg-gray-600',
            overlay: 'bg-gray-600/20'
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }
    }

    /**
     * Load more posts
     */
    async loadMorePosts() {
        if (this.loading || !this.hasMorePosts) return;

        this.currentPage++;
        await this.loadRecentPosts();

        if (!this.hasMorePosts) {
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    /**
     * Show loading spinner
     */
    showLoadingSpinner() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = `
                <div class="loading-spinner mr-2"></div>
                Loading...
            `;
        }
    }

    /**
     * Hide loading spinner
     */
    hideLoadingSpinner() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn && this.hasMorePosts) {
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = 'Load More Articles';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${message}
            <p class="text-sm mt-2">Please check your WordPress site configuration and try again.</p>
        `;

        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WordPressAPI, BlogIntegration };
}
