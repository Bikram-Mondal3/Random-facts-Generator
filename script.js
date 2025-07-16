// --- Agent AI Facts (local JSON-like structure) ---
const agentAIFacts = [
    "Agent-based AI systems are composed of autonomous entities called agents that perceive and act within an environment.",
    "Agents can be reactive (responding to stimuli) or deliberative (planning actions based on internal models).",
    "Multi-agent systems involve multiple agents interacting, collaborating, or competing to achieve individual or shared goals.",
    "Agent AI is widely used in robotics, where robots act as agents navigating and manipulating their environment.",
    "In finance, agent-based models simulate markets by modeling traders as agents with different strategies.",
    "Agents can exhibit learning capabilities, adapting their behavior based on experience or feedback.",
    "Agent architectures include simple rule-based systems, belief-desire-intention (BDI) models, and neural network-based agents.",
    "Swarm intelligence, inspired by social insects, is a form of agent-based AI where simple agents collectively solve complex problems.",
    "Agent-based simulations are used in epidemiology to model the spread of diseases through populations.",
    "Agents can communicate using protocols, enabling negotiation, cooperation, and coordination.",
    "Autonomous vehicles use agent-based AI to perceive surroundings, make driving decisions, and interact with other vehicles.",
    "Game AI often uses agents to control non-player characters (NPCs) with realistic, adaptive behaviors.",
    "Agents can be physical (robots, drones) or virtual (software bots, digital assistants).",
    "Agent-based AI supports distributed problem-solving, where agents work on subproblems and share results.",
    "Cognitive agents can reason about their environment, predict outcomes, and plan complex sequences of actions.",
    "Agent-based modeling helps researchers study emergent phenomena in social, economic, and ecological systems.",
    "Agents can be designed with varying degrees of autonomy, from fully independent to tightly controlled.",
    "In smart homes, agent AI manages devices, optimizes energy use, and enhances user comfort.",
    "Security systems use agent-based AI for threat detection, response, and adaptive defense.",
    "Agent communication languages (like KQML, FIPA-ACL) standardize how agents exchange information."
];

// --- Dice face dot positions for 1-6 ---
const diceDotPatterns = [
    // 1
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    // 2
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    // 3
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    // 4
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    // 5
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    // 6
    [1, 0, 1, 1, 0, 1, 1, 0, 1]
];

// --- Utility: Shuffle array (Fisher-Yates) ---
function shuffle(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// --- Render Dice Face with animation ---
function renderDiceFace(number) {
    const face = document.getElementById('diceFace');
    face.innerHTML = '';
    const pattern = diceDotPatterns[number - 1];

    // Create all dots with a slight delay for each
    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (pattern[i] ? ' active' : '');

        // Add a slight delay to each dot's appearance
        if (pattern[i]) {
            dot.style.transitionDelay = `${i * 30}ms`;
        }

        face.appendChild(dot);
    }
}

// --- Render Facts with staggered animation ---
function renderFacts(facts) {
    const factsList = document.getElementById('factsList');
    factsList.innerHTML = '';

    // Fade out existing cards first if any exist
    const existingCards = factsList.querySelectorAll('.fact-card');
    if (existingCards.length > 0) {
        existingCards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
        });
    }

    // Render new facts with staggered animation
    facts.forEach((fact, index) => {
        const card = document.createElement('div');
        card.className = 'fact-card';
        card.innerHTML = `<span>${fact}</span>`;

        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        factsList.appendChild(card);

        // Trigger animation with staggered delay
        setTimeout(() => {
            card.style.transition = 'all 0.4s var(--animation-timing)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50 * index);
    });
}

// --- Roll Dice Logic with enhanced animation ---
let lastFactsSet = [];
let isRolling = false;

function rollDice() {
    if (isRolling) return; // Prevent multiple rolls

    isRolling = true;
    const dice = document.getElementById('dice');
    const rollSound = document.getElementById('rollSound');
    const factsList = document.getElementById('factsList');

    // Prepare the dice for rolling
    dice.classList.add('rolling');

    // Play sound effect
    rollSound.currentTime = 0;
    rollSound.play().catch(e => console.log('Audio play failed:', e));

    // Fade out current facts
    const currentCards = factsList.querySelectorAll('.fact-card');
    currentCards.forEach((card, i) => {
        card.style.transition = 'all 0.3s ease-in-out';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
    });

    // Complete the roll after animation
    setTimeout(() => {
        dice.classList.remove('rolling');

        // Random dice number (1-6)
        const diceNumber = Math.floor(Math.random() * 6) + 1;
        renderDiceFace(diceNumber);

        // Pick facts equal to the dice number
        let factsPool = agentAIFacts.slice();
        if (factsPool.length > diceNumber && lastFactsSet.length) {
            factsPool = factsPool.filter(f => !lastFactsSet.includes(f));
            if (factsPool.length < diceNumber) factsPool = agentAIFacts.slice();
        }

        const facts = shuffle(factsPool).slice(0, diceNumber);
        lastFactsSet = facts;

        // Update the roll label to show how many facts were generated
        document.querySelector('.roll-label').textContent =
            `You rolled a ${diceNumber}: showing ${diceNumber} Agent AI fact${diceNumber !== 1 ? 's' : ''}`;

        // Slight delay before showing new facts
        setTimeout(() => {
            renderFacts(facts);
            isRolling = false;
        }, 100);

    }, 1000); // Longer animation duration
}

// --- Theme Toggle with smooth transitions ---
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);

    // Update icon with subtle animation
    themeIcon.style.transform = 'scale(0.8)';
    setTimeout(() => {
        themeIcon.textContent = theme === 'dark' ? '🌞' : '🌙';
        themeIcon.style.transform = 'scale(1)';
    }, 150);

    // Save preference
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
});

// On load, set theme from storage or default to dark
(function () {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

// --- Dice Click/Keyboard Interaction ---
const dice = document.getElementById('dice');
dice.addEventListener('click', rollDice);
dice.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent scrolling with space
        rollDice();
    }
});

// --- Initial Render ---
renderDiceFace(1);

// Start with empty facts list - only show facts after rolling
document.getElementById('factsList').innerHTML = '';