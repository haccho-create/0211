document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCanvasAnimation();
    initAIChatbot();
});

// Scroll Reveal Observer
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach((element) => {
        observer.observe(element);
    });
}

// Canvas Background Animation
function initCanvasAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Mouse/Touch Interaction
    let mouse = { x: null, y: null, radius: 200 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Config
    const particleCount = 60; // Increased count
    const connectionDistance = 150;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            // Emeald to Teal to White random colors
            const colors = ['0, 201, 167', '5, 150, 105', '200, 255, 230'];
            this.baseColor = colors[Math.floor(Math.random() * colors.length)];
            this.density = (Math.random() * 30) + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Interactive movement with mouse
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * this.density;
                    const directionY = forceDirectionY * force * this.density;

                    // Move slightly AWAY from mouse for a "ripple" effect or TOWARDS for "gravity"
                    // Here we make them gently follow the mouse (gravity) but with a limit
                    this.x += directionX * 0.4;
                    this.y += directionY * 0.4;
                }
            }

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.baseColor}, 0.5)`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        particles.forEach((a, index) => {
            for (let bIndex = index + 1; bIndex < particles.length; bIndex++) {
                const b = particles[bIndex];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    let opacity = 1 - (dist / connectionDistance);
                    ctx.strokeStyle = `rgba(0, 201, 167, ${opacity * 0.15})`; // Green lines

                    // Highlight lines to mouse
                    if (mouse.x != null) {
                        const mouseDist = Math.sqrt((a.x - mouse.x) ** 2 + (a.y - mouse.y) ** 2);
                        if (mouseDist < 120) {
                            ctx.strokeStyle = `rgba(0, 255, 200, ${opacity * 0.8})`; // Brighter lines near mouse
                        }
                    }

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        });

        // Connect particles to mouse
        if (mouse.x != null) {
            particles.forEach(p => {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 201, 167, 0.3)`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            })
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// AI Chatbot Lazy Load
function initAIChatbot() {
    const btn = document.getElementById('start-ai-btn');
    const container = document.getElementById('ai-chat-container');
    if (!btn || !container) return;

    btn.addEventListener('click', () => {
        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = "https://udify.app/chatbot/u8kxnlxoEYmcG9Br";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.minHeight = "700px";
        iframe.style.border = "none";
        iframe.allow = "microphone";

        // Remove overlay content and append iframe
        container.innerHTML = '';
        container.appendChild(iframe);
    });
}
