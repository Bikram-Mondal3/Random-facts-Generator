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

async function rollDice() {
    if (isRolling) return; // Prevent multiple rolls

    isRolling = true;
    const dice = document.getElementById('dice');
    const rollSound = document.getElementById('rollSound');
    const factsList = document.getElementById('factsList');
    const topicSelect = document.getElementById('topicSelect');
    const selectedTopic = topicSelect.value;
    const topicName = topics[selectedTopic]?.name || 'Facts';

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
    setTimeout(async () => {
        dice.classList.remove('rolling');

        // Random dice number (1-6)
        const diceNumber = Math.floor(Math.random() * 6) + 1;
        renderDiceFace(diceNumber);

        // Update the roll label to show how many facts were generated
        document.querySelector('.roll-label').textContent =
            `You rolled a ${diceNumber}: showing ${diceNumber} ${topicName} fact${diceNumber !== 1 ? 's' : ''}`;

        // Generate facts using Gemini API
        const facts = await generateFacts(diceNumber);
        lastFactsSet = facts;

        // Render the facts
        renderFacts(facts);
        isRolling = false;

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

// --- Environment Variables ---
// In a real production environment, this would be loaded from a server-side
// process to keep the API key secure. For this demo, we assume the .env file is processed.
let GEMINI_API_KEY;

// Try to load API key
async function loadApiKey() {
    try {
        // In a real app, you'd use a proper .env loader
        // This is a simplified approach for demo purposes
        const response = await fetch('.env');
        const text = await response.text();
        const envVars = text.split('\n').reduce((acc, line) => {
            const [key, value] = line.split('=');
            if (key && value) {
                acc[key.trim()] = value.trim();
            }
            return acc;
        }, {});
        
        GEMINI_API_KEY = envVars.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
            console.error('Please set your Gemini API key in the .env file');
            showApiKeyError();
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error loading API key:', error);
        showApiKeyError();
        return false;
    }
}

function showApiKeyError() {
    // Show a user-friendly error when API key is missing
    const factsList = document.getElementById('factsList');
    factsList.innerHTML = `
        <div class="fact-card error-card">
            <span>⚠️ Please set your Gemini API key in the .env file to generate facts.</span>
        </div>
    `;
}

// --- Generate Facts using Gemini API ---
async function generateFacts(count) {
    const loadingIndicator = document.getElementById('loading');
    const topicSelect = document.getElementById('topicSelect');
    const selectedTopic = topicSelect.value;
    
    try {
        loadingIndicator.classList.add('active');
        
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
            const success = await loadApiKey();
            if (!success) {
                return getFallbackFacts(selectedTopic, count);
            }
        }
        
        const topic = topics[selectedTopic] || topics['agent-ai'];
        const prompt = topic.prompt.replace('{count}', count);
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            console.error('API Error:', await response.text());
            return getFallbackFacts(selectedTopic, count);
        }
        
        const data = await response.json();
        
        // Extract facts from response
        const text = data.candidates[0]?.content?.parts[0]?.text || '';
        
        // Split by newline and/or numbered points
        const facts = text
            .split(/\n+/)
            .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
            .filter(line => line.length > 0)
            .slice(0, count); // Ensure we only take the number we need
        
        return facts.length === count ? facts : getFallbackFacts(selectedTopic, count);
    } catch (error) {
        console.error('Error generating facts:', error);
        return getFallbackFacts(selectedTopic, count);
    } finally {
        loadingIndicator.classList.remove('active');
    }
}

// --- Get fallback facts when API fails ---
function getFallbackFacts(topic, count) {
    const factsArray = fallbackFacts[topic] || fallbackFacts.default;
    return shuffle(factsArray).slice(0, count);
}

// --- Topic Definitions ---
const topics = {
    'agent-ai': {
        name: 'Agent AI',
        prompt: 'Give me {count} short, interesting facts about agent-based artificial intelligence systems. Each fact should be a single sentence.'
    },
    'space': {
        name: 'Space & Astronomy',
        prompt: 'Give me {count} short, interesting facts about space, astronomy, and the universe. Each fact should be a single sentence.'
    },
    'history': {
        name: 'History',
        prompt: 'Give me {count} short, interesting facts about world history. Each fact should be a single sentence.'
    },
    'nature': {
        name: 'Nature & Wildlife',
        prompt: 'Give me {count} short, interesting facts about nature, wildlife, and ecosystems. Each fact should be a single sentence.'
    },
    'technology': {
        name: 'Technology',
        prompt: 'Give me {count} short, interesting facts about modern technology and innovation. Each fact should be a single sentence.'
    },
    'science': {
        name: 'Science',
        prompt: 'Give me {count} short, interesting facts about various scientific discoveries and principles. Each fact should be a single sentence.'
    }
};

// --- Fallback facts in case API fails ---
const fallbackFacts = {
    'agent-ai': [
        "Agent-based AI systems are composed of autonomous entities called agents that perceive and act within an environment.",
        "Agents can be reactive (responding to stimuli) or deliberative (planning actions based on internal models).",
        "Multi-agent systems involve multiple agents interacting, collaborating, or competing to achieve individual or shared goals.",
        "Agent AI is widely used in robotics, where robots act as agents navigating and manipulating their environment.",
        "In finance, agent-based models simulate markets by modeling traders as agents with different strategies.",
        "Agents can exhibit learning capabilities, adapting their behavior based on experience or feedback."
    ],
    'space': [
        "The largest known star, UY Scuti, is about 1,700 times larger than our Sun.",
        "A day on Venus is longer than a year on Venus.",
        "The footprints left by astronauts on the Moon will likely last for at least 100 million years.",
        "There is a planet made of diamonds called 55 Cancri e.",
        "The Great Red Spot on Jupiter is a storm that has been raging for over 300 years.",
        "Saturn's rings are made mostly of ice particles with some rocky debris and dust."
    ],
    'history': [
        "The shortest war in history was between Britain and Zanzibar on August 27, 1896, lasting only 38 minutes.",
        "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid of Giza.",
        "The first written mention of the number zero was in 628 AD by the Indian mathematician Brahmagupta.",
        "The Hundred Years' War between England and France actually lasted 116 years.",
        "Ancient Romans used urine as mouthwash to whiten their teeth.",
        "Women in Ancient Egypt had more rights and freedoms than women in Ancient Greece."
    ],
    'nature': [
        "Octopuses have three hearts and blue blood.",
        "A group of flamingos is called a flamboyance.",
        "Bananas are berries, but strawberries aren't.",
        "Sloth digestion is so slow that they may take up to a month to digest a single leaf.",
        "The Great Barrier Reef is the largest living structure on Earth.",
        "A single bee colony can produce around 100 pounds of honey in a year."
    ],
    'technology': [
        "The first computer programmer was a woman named Ada Lovelace.",
        "The average smartphone today has more computing power than all of NASA had during the Apollo moon landing.",
        "The world's first website is still online today at info.cern.ch.",
        "There are more than 5 billion searches made on Google every day.",
        "About 90% of the world's data was generated in just the last two years.",
        "The term 'bug' in computing originated when a moth caused a malfunction in an early computer."
    ],
    'science': [
        "One teaspoon of neutron star matter weighs about 6 billion tons.",
        "Human DNA shares 60% of its genes with a banana.",
        "Light travels from the Sun to Earth in about 8 minutes and 20 seconds.",
        "The total weight of all the ants on Earth is roughly equal to the total weight of all humans.",
        "The average lightning bolt contains enough energy to toast 100,000 slices of bread.",
        "A day on Mercury lasts about 176 Earth days."
    ],
    'default': [
        "The human brain contains approximately 86 billion neurons.",
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
        "Octopuses have three hearts.",
        "The world's oldest known living tree is over 5,000 years old.",
        "A bolt of lightning is five times hotter than the surface of the sun.",
        "Bananas are berries, but strawberries aren't."
    ]
};

// --- Initial Render ---
renderDiceFace(1);

// Start with empty facts list - only show facts after rolling
document.getElementById('factsList').innerHTML = '';

// --- Topic Change Handler ---
document.getElementById('topicSelect').addEventListener('change', function() {
    const selectedTopic = this.value;
    const topicName = topics[selectedTopic]?.name || 'Facts';
    
    // Update the UI to reflect the selected topic
    document.querySelector('.roll-label').textContent = `Roll the dice to see that many ${topicName} facts!`;
    
    // Clear the current facts
    document.getElementById('factsList').innerHTML = '';
});

// Add error style for API key error
const style = document.createElement('style');
style.textContent = `
.error-card {
    background: rgba(239, 68, 68, 0.05);
    border-color: rgba(239, 68, 68, 0.2);
}
`;
document.head.appendChild(style);