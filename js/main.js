// Common JavaScript functionality for all pages

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const menu = document.querySelector('.mobile-menu');
                if (menu && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                }
            }
        });
    });
}

// Header scroll effect
function initializeHeaderScrollEffect() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }
        }
    });
}

// Animate elements on scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if ((currentPage === 'index.html' || currentPage === '') && href === 'index.html') {
            link.classList.add('active');
        } else if (href === currentPage) {
            link.classList.add('active');
        } else if (href.startsWith('#') && currentPage === 'index.html') {
            // For anchor links on home page
            if (href === '#services' || href === '#about' || href === '#contact') {
                // These will be handled by the home page specific logic
            }
        }
    });
}

// Initialize all common functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScrolling();
    initializeHeaderScrollEffect();
    initializeScrollAnimations();
    setActiveNavLink();
});

// Contact Form Handler (for pages that have the contact form)
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formMessage = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            loadingSpinner.classList.remove('hidden');
            formMessage.classList.add('hidden');

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success
                    formMessage.className = 'p-4 rounded-lg bg-green-100 text-green-800 border border-green-200';
                    formMessage.textContent = result.message || 'Thank you! Your message has been sent successfully.';
                    form.reset();
                } else {
                    // Error
                    formMessage.className = 'p-4 rounded-lg bg-red-100 text-red-800 border border-red-200';
                    formMessage.textContent = result.error || 'There was an error sending your message. Please try again.';
                }
            } catch (error) {
                // Network error
                formMessage.className = 'p-4 rounded-lg bg-red-100 text-red-800 border border-red-200';
                formMessage.textContent = 'There was a network error. Please check your connection and try again.';
                console.error('Contact form error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
                loadingSpinner.classList.add('hidden');
                formMessage.classList.remove('hidden');
            }
        });
    }
}

// Initialize contact form if present
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});
