// --- Global Initialization & Performance Setup ---
const canvas = document.getElementById('magicCanvas');
const ctx = canvas.getContext('2d');
const mouseGlow = document.getElementById('mouseGlow');

// Dynamic view resizing setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Index calculation hook for CSS letter bouncing utility
document.querySelectorAll('.romantic-title span').forEach((span, index) => {
    span.style.setProperty('--i', index + 1);
});

// Ambient Micro-messages array
const sweetMessages = [
    "❤️ You're amazing.",
    "💖 You make me smile.",
    "💕 This page was made just for you.",
    "✨ Every click makes me happier.",
    "💝 My favorite view is you.",
    "🌸 Life is sweeter with you."
];
const loveNoteElement = document.getElementById('loveNote');
setInterval(() => {
    const randomIndex = Math.floor(Math.random() * sweetMessages.length);
    loveNoteElement.style.opacity = 0;
    setTimeout(() => {
        loveNoteElement.innerHTML = sweetMessages[randomIndex];
        loveNoteElement.style.opacity = 0.6;
    }, 400);
}, 5000);

// Mouse tracking logic for glow backdrop
window.addEventListener('mousemove', (e) => {
    mouseGlow.style.opacity = '1';
    mouseGlow.style.left = `${e.clientX}px`;
    mouseGlow.style.top = `${e.clientY}px`;
});
window.addEventListener('mouseout', () => { mouseGlow.style.opacity = '0'; });

// --- Particle Simulation Engine ---
const elementsPool = ['❤️', '💖', '💕', '✨', '🌸', '💝', '💞'];
let activeParticles = [];
let celebrationMode = false;

class FloatingParticle {
    constructor(isCelebration = false) {
        this.isCelebration = isCelebration;
        this.reset();
        if (isCelebration) {
            // Explode upward and outward from center canvas
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - Math.random() * 4;
            this.size = Math.random() * 24 + 16;
        }
    }

    reset() {
        this.char = elementsPool[Math.floor(Math.random() * elementsPool.length)];
        this.size = Math.random() * 20 + 12;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.size + Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = -(Math.random() * 1.5 + 0.5);
        this.opacity = Math.random() * 0.5 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.isCelebration) {
            this.vy += 0.15; // Gravity pull for fireworks arc effect
            this.opacity -= 0.008; // gradual fade out
        } else {
            // Loop regular floating elements naturally
            if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
                this.reset();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.font = `${this.size}px Arial`;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, 0, 0);
        ctx.restore();
    }
}

// Generate base ambient background load
for (let i = 0; i < 35; i++) {
    activeParticles.push(new FloatingParticle(false));
}

function animateLayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.update();
        p.draw();

        // Clean up expended celebration particles
        if (p.isCelebration && p.opacity <= 0) {
            activeParticles.splice(i, 1);
        }
    }

    // Maintain basic float system density when quiet
    if (!celebrationMode && activeParticles.length < 35) {
        activeParticles.push(new FloatingParticle(false));
    }

    requestAnimationFrame(animateLayer);
}
requestAnimationFrame(animateLayer);

// --- The Elusive "NO" Button Core Evasion System ---
const btnNo = document.getElementById('btnNo');
const taunts = ["Catch me! 😝", "Too slow! ❤️", "Nope 😂", "You almost got me!", "Not today! 🙈"];

function evade(event) {
    if (celebrationMode) return;

    // Convert element status layout dynamically on entry to prevent page reflow collapse
    if (!btnNo.classList.contains('evading')) {
        btnNo.classList.add('evading');
    }

    const padding = 60; 
    const widthBounds = window.innerWidth - btnNo.offsetWidth - padding;
    const heightBounds = window.innerHeight - btnNo.offsetHeight - padding;

    // Generate safe safehouses avoiding viewport clipping
    let targetX = Math.max(padding, Math.random() * widthBounds);
    let targetY = Math.max(padding, Math.random() * heightBounds);

    // Ensure it doesn't cross layout space coordinates of main Card boundaries
    const yesRect = document.getElementById('btnYes').getBoundingClientRect();
    if (targetX > yesRect.left - padding && targetX < yesRect.right + padding &&
        targetY > yesRect.top - padding && targetY < yesRect.bottom + padding) {
        targetX += 150;
        targetY += 150;
    }

    // Dynamic clean rendering updates
    const rotateRand = (Math.random() - 0.5) * 25; // mild rotation tweak
    btnNo.style.left = `${targetX}px`;
    btnNo.style.top = `${targetY}px`;
    btnNo.style.transform = `scale(0.9) rotate(${rotateRand}deg)`;

    // Spawn cute floating taunt feedback texts
    if (Math.random() > 0.3) {
        const bubble = document.createElement('div');
        bubble.className = 'taunt-bubble';
        bubble.innerText = taunts[Math.floor(Math.random() * taunts.length)];
        bubble.style.left = `${targetX + 20}px`;
        bubble.style.top = `${targetY - 20}px`;
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1200);
    }
}

// Attach listeners for multi-platform evasion response
btnNo.addEventListener('mouseenter', evade);
btnNo.addEventListener('mousemove', evade);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Intercept mobile touch actions immediately
    evade(e);
});

// --- Flow Orchestration & Modal Handshakes ---
const btnYes = document.getElementById('btnYes');
const dateModal = document.getElementById('dateModal');
const btnConfirm = document.getElementById('btnConfirm');
const datePicker = document.getElementById('datePicker');
const mainContainer = document.getElementById('mainContainer');

// Lock out date selector calendar ranges backward dynamically past current absolute reference point
const baseToday = new Date();
const formattedDateString = baseToday.toISOString().split('T')[0];
datePicker.min = formattedDateString;
datePicker.value = formattedDateString;

btnYes.addEventListener('click', () => {
    dateModal.classList.add('active');
});

btnConfirm.addEventListener('click', () => {
    const chosenDate = datePicker.value;
    if (!chosenDate) return;

    dateModal.classList.remove('active');
    triggerGrandCelebration(chosenDate);
});

// --- Final Cinematic Presentation Sequence ---
function triggerGrandCelebration(targetDate) {
    celebrationMode = true;
    
    // Clean down operational layout interfaces gracefully
    document.getElementById('proposalCard').remove();
    btnNo.remove();
    loveNoteElement.remove();

    // Format target date readable output cleanly
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(targetDate);
    const customizedDatePresentation = dateObj.toLocaleDateString('en-US', dateOptions);

    // Reconstruct structural scene tree elegantly for success reveal
    const confirmationContainer = document.createElement('div');
    confirmationContainer.className = 'glass-card success-date-card';
    confirmationContainer.innerHTML = `
        <h2 style="font-size: 2.5rem; margin-bottom: 15px;">Yay! ❤️</h2>
        <p style="font-size: 1.1rem; margin-bottom: 20px; font-weight:400;">Our date is scheduled for:</p>
        <div style="background: rgba(255, 71, 126, 0.1); padding: 15px 20px; border-radius: 16px; border: 1px dashed var(--primary-love); margin-bottom: 20px;">
            <h3 style="font-weight: 600; line-height: 1.4;">📅 ${customizedDatePresentation}</h3>
        </div>
        <p style="font-family: 'Dancing Script', cursive; font-size: 2rem; color: var(--text-dark);">I can't wait to see you.</p>
    `;
    mainContainer.appendChild(confirmationContainer);

    // Spark intense celebration particle cascades inside canvas frame loop loop
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            activeParticles.push(new FloatingParticle(true));
        }, Math.random() * 600);
    }

    // Secondary auto-sparkle burst loop engine running concurrently
    const burstInterval = setInterval(() => {
        if (activeParticles.length < 200) {
            for (let k = 0; k < 15; k++) {
                activeParticles.push(new FloatingParticle(true));
            }
        }
    }, 1500);

    // Optional Audio pipeline hook ready:
    // const celebrationAudio = new Audio('path_to_romantic_file.mp3');
    // celebrationAudio.volume = 0.5;
    // celebrationAudio.play().catch(() => {/* handle browser autoplay policies softly */});
}