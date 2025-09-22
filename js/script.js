// Loading Screen Animation
        document.addEventListener('DOMContentLoaded', function() {
            const loadingScreen = document.getElementById('loadingScreen');
            const mainContent = document.getElementById('mainContent');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            const cursiveText = document.getElementById('cursive-text');

            // Cursive text animation
            let len;
            try {
                len = cursiveText.getComputedTextLength();
            } catch(e) {
                const bbox = cursiveText.getBBox();
                len = (bbox.width + bbox.height) * 1.15;
            }

            cursiveText.style.setProperty('--len', len);
            cursiveText.style.strokeDasharray = len;
            cursiveText.style.strokeDashoffset = len;

            const min = 1.6;
            const max = 4.2;
            const duration = Math.max(min, Math.min(max, (len / 220)));
            cursiveText.style.setProperty('--duration', duration + 's');

            requestAnimationFrame(() => {
                cursiveText.classList.add('animate');
                
                const totalMs = (duration * 1000) + 50;
                setTimeout(() => {
                    cursiveText.classList.add('reveal');
                }, totalMs);
            });

            // Progress bar animation
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                
                progressBar.style.width = progress + '%';
                progressText.textContent = `Loading... ${Math.floor(progress)}%`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        mainContent.classList.add('visible');
                        initializeAnimations();
                    }, 500);
                }
            }, 100);
        });

        // Initialize animations after loading
        function initializeAnimations() {
            // Typewriter effect
            const typewriter = document.getElementById('typewriter');
            const texts = ['Gen AI Developer', 'ML Developer', 'Web Developer', 'Data Scientist'];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            function typeEffect() {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    typewriter.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typewriter.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }

                let typeSpeed = isDeleting ? 50 : 100;

                if (!isDeleting && charIndex === currentText.length) {
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typeSpeed = 500;
                }

                setTimeout(typeEffect, typeSpeed);
            }

            typeEffect();

            // Nishant flickering effect
            const nishantText = document.getElementById('nishantText');
            setInterval(() => {
                if (Math.random() > 0.7) {
                    nishantText.classList.add('flicker');
                    setTimeout(() => {
                        nishantText.classList.remove('flicker');
                    }, 200);
                }
            }, 2000);
        }

        // Mouse tail effect
        (() => {
            const canvas = document.getElementById('mouse-tail');
            const ctx = canvas.getContext('2d');

            function resize() {
                const dpr = Math.max(1, window.devicePixelRatio || 1);
                canvas.width = Math.round(canvas.clientWidth * dpr);
                canvas.height = Math.round(canvas.clientHeight * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            window.addEventListener('resize', resize, {passive: true});
            resize();

            const TAIL_COLOR = '#2ecc40';
            const MAX_SEGMENTS = 80;
            const SEGMENT_LIFE = 0.45;
            const MIN_MOVE = 3;
            const LINE_WIDTH = 2;
            const VELOCITY_SCALE = 0.02;

            const segments = [];
            let lastPos = null;

            function onPointerMove(e) {
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left;
                const y = (e.clientY ?? (e.touches && e.touches[0].clientY)) - rect.top;
                const now = performance.now() / 1000;

                if (lastPos) {
                    const dx = x - lastPos.x;
                    const dy = y - lastPos.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist >= MIN_MOVE) {
                        const angle = Math.atan2(dy, dx);
                        const len = Math.min(30, Math.max(6, dist * (1 + VELOCITY_SCALE * dist)));

                        const x1 = x - dx * 0.15;
                        const y1 = y - dy * 0.15;
                        const x2 = x1 - Math.cos(angle) * len;
                        const y2 = y1 - Math.sin(angle) * len;

                        segments.push({
                            x1, y1, x2, y2,
                            born: now,
                            life: SEGMENT_LIFE
                        });

                        if (segments.length > MAX_SEGMENTS) segments.shift();
                    }
                }
                lastPos = { x, y, t: now };
            }

            function onPointerLeave() {
                lastPos = null;
            }

            window.addEventListener('pointermove', onPointerMove, {passive: true});
            window.addEventListener('touchmove', onPointerMove, {passive: true});
            window.addEventListener('pointerleave', onPointerLeave);
            window.addEventListener('touchend', onPointerLeave);

            let lastFrame = performance.now() / 1000;
            function animate() {
                const now = performance.now() / 1000;
                const dt = Math.min(0.05, now - lastFrame);
                lastFrame = now;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = segments.length - 1; i >= 0; i--) {
                    const s = segments[i];
                    const age = now - s.born;
                    const rem = 1 - (age / s.life);
                    if (rem <= 0) {
                        segments.splice(i, 1);
                        continue;
                    }

                    const alpha = rem * rem;

                    ctx.lineWidth = LINE_WIDTH;
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = `rgba(46, 204, 64, ${alpha.toFixed(3)})`;

                    ctx.beginPath();
                    ctx.moveTo(s.x1, s.y1);
                    ctx.lineTo(s.x2, s.y2);
                    ctx.stroke();
                }

                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        })();

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll to top button
        const scrollTopBtn = document.getElementById('scrollTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Download CV functionality
        document.getElementById('downloadCvBtn').addEventListener('click', function(e) {
            e.preventDefault();
            // Create a dummy PDF download
            const link = document.createElement('a');
            link.href = 'data:application/pdf;base64,assets/nishant';
            link.download = 'nishantCV.pdf';
            link.click();
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observe animated elements
        document.querySelectorAll('.skill-card, .project-card').forEach(el => {
            observer.observe(el);
        });



