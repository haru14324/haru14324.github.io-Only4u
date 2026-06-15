// Grab DOM elements cleanly without using messy inline event listeners
const envelopeWrapper = document.getElementById('envelopeWrapper');
const introText = document.getElementById('introText');
const cardWrap = document.getElementById('cardWrap');
const closeBtn = document.getElementById('closeBtn');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

let animationFrameId;

// Handle Envelope Open Actions
envelopeWrapper.addEventListener('click', () => {
    // 1. Fire the visual open animation class
    envelopeWrapper.classList.add('open');
    introText.style.opacity = '0';
    introText.style.transform = 'translateY(-20px)';

    // 2. Beautifully scale and hide envelope to clear room for the letter
    setTimeout(() => {
        envelopeWrapper.style.transform = 'scale(0.6)';
        envelopeWrapper.style.opacity = '0';
        envelopeWrapper.style.pointerEvents = 'none';
    }, 400);

    // 3. Slide up and scale in the birthday letter + trigger the pops
    setTimeout(() => {
        cardWrap.classList.add('show');
        
        // Find center coordinates of the card wrap element to explode confetti *from* it
        const rect = cardWrap.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        
        launchConfettiExplosion(originX, originY);
        startFloatingHearts();
    }, 700);
});

// Handle Closing the Envelope
closeBtn.addEventListener('click', () => {
    cardWrap.classList.remove('show');

    setTimeout(() => {
        envelopeWrapper.style.pointerEvents = 'auto';
        envelopeWrapper.style.opacity = '1';
        envelopeWrapper.style.transform = 'scale(1)';
        envelopeWrapper.classList.remove('open');
        
        introText.style.opacity = '1';
        introText.style.transform = 'translateY(0)';
    }, 400);
});

// Dynamic Canvas High-DPI Fix Upgrader
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);

// Realistic Confetti Popper Math Engine (Greens, Golds, Soft Mints)
function launchConfettiExplosion(originX, originY) {
    resizeCanvas();
    cancelAnimationFrame(animationFrameId); // Clean reset logic

    const colors = ['#81c784', '#a5d6a7', '#c8e6c9', '#fff59d', '#fffde7', '#4db6ac', '#81ccaf'];
    const pieces = [];
    const count = 160;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        
        pieces.push({
            x: originX,
            y: originY - 40,
            r: 4 + Math.random() * 5,
            c: colors[Math.floor(Math.random() * colors.length)],
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 7, // Sharp upward burst force
            rot: Math.random() * 360,
            vrot: -10 + Math.random() * 20,
            shape: Math.random() > 0.4 ? 'rect' : 'circle',
            gravity: 0.24,
            friction: 0.97
        });
    }

    const startTime = Date.now();

    function renderLoop() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        pieces.forEach(p => {
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vrot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.c;

            if (p.shape === 'rect') {
                ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.r / 1.3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        if (Date.now() - startTime < 4500) {
            animationFrameId = requestAnimationFrame(renderLoop);
        } else {
            ctx.clearRect(0, 0, w, h);
        }
    }
    renderLoop();
}

// Cute Floating Nurse Particles Spawner
function startFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    container.innerHTML = ''; 
    const cuteNurseIcons = ['💚', '✨', '🩺', '❤️🩹', '🌱', '🤍'];
    let count = 0;

    const interval = setInterval(() => {
        if (count >= 28) {
            clearInterval(interval);
            return;
        }
        
        const particle = document.createElement('div');
        particle.classList.add('floating-heart');
        particle.textContent = cuteNurseIcons[Math.floor(Math.random() * cuteNurseIcons.length)];
        particle.style.left = (15 + Math.random() * 70) + '%'; 
        particle.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
        particle.style.animationDuration = (2.8 + Math.random() * 2) + 's';
        
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 4500);
        count++;
    }, 150);
}