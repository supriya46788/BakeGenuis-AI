// Chatbot functionality
class BakeGeniusChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        // Knowledge base
        this.knowledgeBase = {
            greetings: [
                "Hello! I'm your BakeGenius assistant. How can I help you today?",
                "Hi there! Welcome to BakeGenius.ai. What would you like to know?",
                "Hey! I'm here to help you with all your baking questions. What's on your mind?",
                "Welcome to BakeGenius! I'm your friendly baking assistant. How can I assist you?"
            ],
            goodbyes: [
                "Goodbye! Happy baking! 🧁",
                "See you later! May your bakes always turn out perfect! 👨‍🍳",
                "Bye! Don't forget to check our conversion tools for your next recipe! 🍰",
                "Take care! Come back anytime you need baking help! 🥧"
            ],
            ingredients: {
                flour: "Flour is the foundation of most baked goods. All-purpose flour works for most recipes, but bread flour has more protein for chewier textures, while cake flour creates lighter, more tender results.",
                sugar: "Sugar not only sweetens but also affects texture and browning. Granulated sugar is most common, while brown sugar adds moisture and molasses flavor.",
                butter: "Butter adds richness and flavor. Room temperature butter creams well with sugar, while cold butter creates flaky pastries.",
                eggs: "Eggs provide structure, moisture, and richness. They act as binding agents and help with leavening when beaten.",
                "baking powder": "Baking powder is a leavening agent that helps baked goods rise. It contains both acid and base, so it activates when mixed with liquid.",
                "baking soda": "Baking soda needs an acid (like buttermilk or lemon juice) to activate. It creates a quick rise and helps with browning.",
                vanilla: "Vanilla extract enhances flavor in most baked goods. Pure vanilla extract is preferred over artificial for better taste.",
                salt: "Salt enhances flavors and strengthens gluten structure. Even sweet recipes need a pinch of salt for balance.",
                milk: "Milk adds moisture and richness. Different fat contents affect texture - whole milk creates richer results than skim milk.",
                chocolate: "Chocolate comes in many forms - cocoa powder for intense flavor, chocolate chips for texture, or melted chocolate for richness."
            },
            website: {
                about: "BakeGenius.ai is an AI-powered baking conversion tool that helps you convert measurements, scale recipes, and get perfect baking results every time.",
                features: "Our main features include: recipe conversion (cups to grams), recipe scaling, measurement calculator, ingredient substitutions, and baking tips.",
                convert: "Use our conversion tool to convert between different measurement units like cups to grams, ounces to milliliters, and more.",
                scale: "Our recipe scaling feature helps you adjust recipe quantities for different serving sizes while maintaining perfect proportions.",
                customize: "You can customize your experience with different themes and measurement preferences.",
                help: "Visit our help center for detailed guides, FAQs, and troubleshooting tips for all your baking needs."
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('Chatbot init() called');
        this.createChatbotHTML();
        console.log('Chatbot HTML created');
        this.bindEvents();
        console.log('Chatbot events bound');
        this.addWelcomeMessage();
        console.log('Welcome message added');
    }
    
    createChatbotHTML() {
        // Add chatbot button to navbar
        const navActions = document.querySelector('.nav-actions');
        if (navActions && !document.getElementById('chatbotToggle')) {
            const chatbotButton = document.createElement('button');
            chatbotButton.id = 'chatbotToggle';
            chatbotButton.className = 'chatbot-nav-btn';
            chatbotButton.title = 'Chat with BakeGenius Assistant';
            chatbotButton.innerHTML = '<i class="fas fa-comments"></i>';
            navActions.appendChild(chatbotButton);
        }
        
        // Add chatbot popup to body
        if (!document.getElementById('chatbotPopup')) {
            const chatbotPopupHTML = `
                <div class="chatbot-popup" id="chatbotPopup">
                    <div class="chatbot-header">
                        <h3>BakeGenius Assistant</h3>
                        <button class="chatbot-close" id="chatbotClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chatbot-messages" id="chatbotMessages">
                    </div>
                    <div class="chatbot-input-area">
                        <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Ask me about baking..." maxlength="200">
                        <button class="chatbot-send" id="chatbotSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', chatbotPopupHTML);
        }
    }
    
    bindEvents() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const send = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        
        if (!toggle || !close || !send || !input) {
            console.error('Chatbot elements not found:', {
                toggle: !!toggle,
                close: !!close,
                send: !!send,
                input: !!input
            });
            return;
        }
        
        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());
        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            const chatbotPopup = document.getElementById('chatbotPopup');
            const chatbotToggle = document.getElementById('chatbotToggle');
            if (this.isOpen && chatbotPopup && !chatbotPopup.contains(e.target) && e.target !== chatbotToggle && !chatbotToggle.contains(e.target)) {
                this.closeChatbot();
            }
        });
    }
    
    toggleChatbot() {
        const popup = document.getElementById('chatbotPopup');
        
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            popup.classList.add('show');
            this.isOpen = true;
            
            // Focus input
            setTimeout(() => {
                document.getElementById('chatbotInput').focus();
            }, 300);
        }
    }
    
    closeChatbot() {
        const popup = document.getElementById('chatbotPopup');
        
        popup.classList.remove('show');
        this.isOpen = false;
    }
    
    addWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessage = this.getRandomResponse(this.knowledgeBase.greetings);
            this.addMessage(welcomeMessage, 'bot');
        }, 1000);
    }
    
    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (message === '') return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response after a delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ text, sender, timestamp: new Date() });
    }
    
    showTypingIndicator() {
        if (this.isTyping) return;
        
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.isTyping = true;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greetings
        if (this.containsAny(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            return this.getRandomResponse(this.knowledgeBase.greetings);
        }
        
        // Goodbyes
        if (this.containsAny(lowerMessage, ['bye', 'goodbye', 'see you', 'farewell', 'thanks', 'thank you'])) {
            return this.getRandomResponse(this.knowledgeBase.goodbyes);
        }
        
        // Ingredient questions
        if (this.containsAny(lowerMessage, ['ingredient', 'what is', 'tell me about', 'about'])) {
            for (const [ingredient, info] of Object.entries(this.knowledgeBase.ingredients)) {
                if (lowerMessage.includes(ingredient)) {
                    return info;
                }
            }
        }
        
        // Website features
        if (this.containsAny(lowerMessage, ['website', 'site', 'bakegenius', 'what can', 'features', 'help'])) {
            if (lowerMessage.includes('convert') || lowerMessage.includes('conversion')) {
                return this.knowledgeBase.website.convert;
            } else if (lowerMessage.includes('scale') || lowerMessage.includes('scaling')) {
                return this.knowledgeBase.website.scale;
            } else if (lowerMessage.includes('customize') || lowerMessage.includes('theme')) {
                return this.knowledgeBase.website.customize;
            } else if (lowerMessage.includes('help')) {
                return this.knowledgeBase.website.help;
            } else {
                return this.knowledgeBase.website.about;
            }
        }
        
        // Baking tips
        if (this.containsAny(lowerMessage, ['tip', 'advice', 'how to', 'baking', 'recipe'])) {
            const tips = [
                "Always measure ingredients accurately for best results. Use a kitchen scale when possible!",
                "Room temperature ingredients mix better than cold ones. Take eggs and butter out 30 minutes before baking.",
                "Don't overmix cake batter - it can make your cake tough. Mix just until ingredients are combined.",
                "Preheat your oven fully before baking. This usually takes 15-20 minutes.",
                "Use our conversion tool to convert between cups and grams for more precise measurements!",
                "Test for doneness with a toothpick - it should come out with just a few moist crumbs.",
                "Let cookies cool on the baking sheet for 5 minutes before transferring to prevent breaking."
            ];
            return this.getRandomResponse(tips);
        }
        
        // Default responses
        const defaultResponses = [
            "I'm here to help with baking questions! You can ask me about ingredients, our website features, or general baking tips.",
            "I'd love to help! Try asking me about specific ingredients, how to use our conversion tools, or baking advice.",
            "I'm your baking assistant! Ask me about flour, sugar, eggs, or any other baking ingredients. I can also tell you about our website features.",
            "Feel free to ask me about baking ingredients, our conversion and scaling tools, or general baking tips!"
        ];
        
        return this.getRandomResponse(defaultResponses);
    }
    
    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        try {
            // Check if chatbot already exists
            if (document.querySelector('.chatbot-nav-btn')) {
                console.log('Chatbot already initialized');
                return;
            }
            
            console.log('Initializing BakeGenius Chatbot...');
            new BakeGeniusChatbot();
            console.log('Chatbot initialized successfully');
        } catch (error) {
            console.error('Error initializing chatbot:', error);
        }
    }, 500);
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    setTimeout(() => {
        try {
            if (!document.querySelector('.chatbot-nav-btn')) {
                console.log('Fallback: Initializing BakeGenius Chatbot...');
                new BakeGeniusChatbot();
            }
        } catch (error) {
            console.error('Fallback error initializing chatbot:', error);
        }
    }, 1000);
}
