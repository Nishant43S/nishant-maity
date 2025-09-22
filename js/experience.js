
// Back Button Function
function goBack() {
    window.history.back();
}

/* Enhanced scroll-based timeline animation with proper line progression */
function animateOnScroll() {
    const items = document.querySelectorAll('.experience-item');
    const connectingLine = document.getElementById('connectingLine');
    const timelineDots = document.querySelectorAll('.timeline-dot');
            
    let maxVisibleIndex = -1;
    let scrollProgress = 0;
    
    items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible && !item.classList.contains('animate')) {
            const card = item.querySelector('.experience-card');
            setTimeout(() => {
                item.classList.add('animate');
                card.classList.add('animate');
            }, index * 200);
        }
        
        // Calculate which items are currently visible on screen
        if (rect.top < windowHeight * 0.6) {
            maxVisibleIndex = index;
            // Calculate smooth progress based on scroll position
            const itemProgress = Math.max(0, Math.min(1, (windowHeight * 0.6 - rect.top) / (windowHeight * 0.6)));
            scrollProgress = (index + itemProgress) / items.length;
        }
    });
            
    timelineDots.forEach((dot, index) => {
        if (index <= maxVisibleIndex || (index === timelineDots.length - 1 && maxVisibleIndex === items.length - 1)) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
            
    const progressPercent = Math.min(100, scrollProgress * 100);
    if (maxVisibleIndex === items.length - 1) {
        // When last card is visible, extend line to 100%
        connectingLine.style.background = `linear-gradient(180deg, 
            #2696d5 0%, 
            #5b2ac6 100%)`;
    } else {
        connectingLine.style.background = `linear-gradient(180deg, 
            #2696d5 0%, 
            #5b2ac6 ${progressPercent}%, 
            #3e4a61 ${progressPercent}%, 
            #3e4a61 100%)`;
    }
}

/* Added throttled scroll listener for better performance */
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(animateOnScroll);
        ticking = true;
        setTimeout(() => { ticking = false; }, 16);
    }
}

// Loading Animation
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        }, 500);
    }, 1000);
});

// Scroll Events
/* Using throttled scroll for smooth timeline animation */
window.addEventListener('scroll', requestTick);
window.addEventListener('load', animateOnScroll);

// Initial animation trigger
setTimeout(animateOnScroll, 1500);

// Smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Enhanced intersection observer for timeline progression
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const itemIndex = parseInt(entry.target.dataset.index);
            const timelineDot = document.querySelectorAll('.timeline-dot')[itemIndex];
            const card = entry.target.querySelector('.experience-card');
            const connectingLine = document.getElementById('connectingLine');
                    
            if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    card.classList.add('animate');
                }, itemIndex * 200);
            }
                    
            /* Update timeline line progression based on intersection */
            if (entry.isIntersecting) {
                timelineDot?.classList.add('active');
                // Calculate line progress based on visible items
                const visibleItems = document.querySelectorAll('.experience-item.animate').length;
                const totalItems = document.querySelectorAll('.experience-item').length;
                const lineProgress = (visibleItems / totalItems) * 100;
                
                // Apply gradient progression to the connecting line
                connectingLine.style.background = `linear-gradient(180deg, 
                    #2696d5 0%, 
                    #5b2ac6 ${lineProgress}%, 
                    #3e4a61 ${lineProgress}%, 
                    #3e4a61 100%)`;
                connectingLine.style.boxShadow = `0 0 20px rgba(38, 150, 213, ${lineProgress / 100 * 0.6})`;
            }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px'
        });

        document.querySelectorAll('.experience-item').forEach(item => {
            observer.observe(item);
        });
}

// Add glow effect to links
document.querySelectorAll('a, .experience-title').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.textShadow = '0 0 20px rgba(255, 107, 53, 0.8)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.textShadow = '0 0 10px rgba(255, 107, 53, 0.3)';
    });
});