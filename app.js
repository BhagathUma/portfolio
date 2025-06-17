// Portfolio Website JavaScript
// Author: Bhagath U
// Purple Theme with Glassmorphism Effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initNavigation();
    initScrollEffects();
    initContactForm();
    initBackToTop();
    initScrollAnimations();
    initDownloadResume();
    initAboutAnimations();
});

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const toggleIcon = document.querySelector('.theme-toggle-icon');
    
    // Check if theme preference is stored
    const savedTheme = localStorage.getItem('theme');
    
    // Set default theme to dark if no saved preference
    if (!savedTheme) {
        htmlElement.setAttribute('data-theme', 'dark');
        toggleIcon.textContent = '☀️'; // Sun icon for dark mode (to switch to light)
    } else {
        htmlElement.setAttribute('data-theme', savedTheme);
        toggleIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙'; // Update icon based on current theme
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update HTML attribute
        htmlElement.setAttribute('data-theme', newTheme);
        
        // Update toggle icon
        toggleIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Save preference
        try {
            localStorage.setItem('theme', newTheme);
        } catch (error) {
            console.log('Local storage not available:', error);
        }
        
        // Add animation effect for smooth transition
        htmlElement.classList.add('theme-transition');
        setTimeout(() => {
            htmlElement.classList.remove('theme-transition');
        }, 500);
    });
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects (navbar and active navigation)
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const aboutSection = document.getElementById('about');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY;
        
        // Add scrolled class to navbar
        if (scrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Fix for about section overlap - ensure proper z-index when scrolling
        if (aboutSection) {
            const aboutTop = aboutSection.offsetTop - 100;
            const aboutBottom = aboutTop + aboutSection.offsetHeight;
            
            if (scrollPos >= aboutTop && scrollPos <= aboutBottom) {
                // Already handled with CSS z-index now
                // This is just for any additional scroll-specific adjustments if needed
            }
        }

        // Update active navigation link
        updateActiveNavLink(sections, navLinks, scrollPos);
    });

    // Initial check for active navigation
    updateActiveNavLink(sections, navLinks, window.pageYOffset);
}

// Update active navigation link based on scroll position
function updateActiveNavLink(sections, navLinks, scrollPos) {
    let currentSection = '';
    const offset = 100; // Offset for better accuracy
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    // Update navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// About section animations
function initAboutAnimations() {
    const aboutSection = document.querySelector('.about');
    const animatedElements = document.querySelectorAll('.fade-in-text, .slide-in-stat, .social-link-glass');
    
    // Intersection Observer for about section animations
    const aboutObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger animations when about section comes into view
                animatedElements.forEach(element => {
                    element.style.animationPlayState = 'running';
                });
                aboutObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    // Initially pause animations
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
    });
}

// Contact form validation and handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Error message elements
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous errors
        clearErrors();
        
        // Validate form
        let isValid = true;
        
        // Name validation
        if (!validateName(nameInput.value.trim())) {
            showError(nameError, 'Please enter a valid name (at least 2 characters)');
            isValid = false;
        }
        
        // Email validation
        if (!validateEmail(emailInput.value.trim())) {
            showError(emailError, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Subject validation
        if (!validateSubject(subjectInput.value.trim())) {
            showError(subjectError, 'Please enter a subject (at least 5 characters)');
            isValid = false;
        }
        
        // Message validation
        if (!validateMessage(messageInput.value.trim())) {
            showError(messageError, 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        if (isValid) {
            // Form is valid, show success message
            showSuccessMessage();
            form.reset();
        }
    });

    // Real-time validation
    nameInput.addEventListener('blur', function() {
        validateFieldRealTime(this, nameError, validateName, 'Please enter a valid name (at least 2 characters)');
    });

    emailInput.addEventListener('blur', function() {
        validateFieldRealTime(this, emailError, validateEmail, 'Please enter a valid email address');
    });

    subjectInput.addEventListener('blur', function() {
        validateFieldRealTime(this, subjectError, validateSubject, 'Please enter a subject (at least 5 characters)');
    });

    messageInput.addEventListener('blur', function() {
        validateFieldRealTime(this, messageError, validateMessage, 'Please enter a message (at least 10 characters)');
    });

    // Clear errors on focus
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('focus', function() {
            const errorElement = document.getElementById(this.id + '-error');
            if (errorElement) {
                errorElement.textContent = '';
                this.classList.remove('error');
            }
        });
    });
}

// Validation functions
function validateName(name) {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateSubject(subject) {
    return subject.length >= 5;
}

function validateMessage(message) {
    return message.length >= 10;
}

// Real-time validation helper
function validateFieldRealTime(input, errorElement, validationFunc, errorMessage) {
    const value = input.value.trim();
    if (value && !validationFunc(value)) {
        showError(errorElement, errorMessage);
        input.classList.add('error');
    } else if (value) {
        errorElement.textContent = '';
        input.classList.remove('error');
    }
}

// Error handling functions
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.color = '#EF4444';
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

function showSuccessMessage() {
    // Create success message with glassmorphism styling
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    
    // Get current theme for proper styling
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const glassBackground = currentTheme === 'dark' 
        ? 'rgba(30, 41, 59, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)';
    
    successDiv.style.cssText = `
        background: ${glassBackground};
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: var(--color-primary);
        padding: 16px 24px;
        border-radius: 12px;
        border: 1px solid rgba(139, 92, 246, 0.3);
        margin-bottom: 16px;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
        transition: all 0.3s ease;
    `;
    successDiv.textContent = 'Thank you for your message! I\'ll get back to you soon.';
    
    // Insert success message
    const form = document.getElementById('contact-form');
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }
    }, 5000);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Back to top button functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .project-card, .skill-category, .timeline-item, .cert-item');
    
    // Add fade-in class to elements
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for project cards
                if (entry.target.classList.contains('project-card')) {
                    const projectCards = document.querySelectorAll('.project-card');
                    const index = Array.from(projectCards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                // Add staggered animation for skill categories
                if (entry.target.classList.contains('skill-category')) {
                    const skillCategories = document.querySelectorAll('.skill-category');
                    const index = Array.from(skillCategories).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Download resume functionality
function initDownloadResume() {
    const downloadBtn = document.getElementById('download-resume');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show download message with glassmorphism styling
            showDownloadMessage();
        });
    }
}

function showDownloadMessage() {
    // Create download message with glassmorphism styling
    const messageDiv = document.createElement('div');
    messageDiv.className = 'download-message';
    
    // Get current theme for proper styling
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const glassBackground = currentTheme === 'dark' 
        ? 'rgba(30, 41, 59, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)';
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${glassBackground};
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: var(--color-text);
        padding: 32px 40px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
        z-index: 1001;
        text-align: center;
        max-width: 400px;
        width: 90%;
    `;
    
    messageDiv.innerHTML = `
        <h3 style="margin-bottom: 16px; color: var(--color-primary); font-size: 20px; font-weight: 600;">Resume Download</h3>
        <p style="margin-bottom: 24px; color: var(--color-text-secondary); line-height: 1.5;">Thank you for your interest! Please contact me directly to request my latest resume.</p>
        <button onclick="this.parentElement.remove(); document.querySelector('.backdrop').remove();" style="
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Close</button>
    `;
    
    // Add backdrop with glassmorphism
    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 1000;
    `;
    
    backdrop.addEventListener('click', function() {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
        if (document.body.contains(backdrop)) {
            document.body.removeChild(backdrop);
        }
    });
    
    // Add to page
    document.body.appendChild(backdrop);
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translate(-50%, -60%)';
            backdrop.style.opacity = '0';
            
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
                if (document.body.contains(backdrop)) {
                    document.body.removeChild(backdrop);
                }
            }, 300);
        }
    }, 8000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Debounce scroll events
const debouncedScrollHandler = debounce(function() {
    // Any expensive scroll operations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu and modals
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
        
        // Close any open modals
        const modals = document.querySelectorAll('.download-message, .backdrop');
        modals.forEach(modal => {
            if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }
});