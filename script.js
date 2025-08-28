class PromptGenerator {
    constructor() {
        this.currentTab = 'chatgpt';
        this.isGenerating = false;
        this.initializeElements();
        this.bindEvents();
        this.initializeTabs();
    }

    initializeElements() {
        this.elements = {
            tabButtons: document.querySelectorAll('.tab-btn'),
            promptInput: document.getElementById('prompt-input'),
            promptType: document.getElementById('prompt-type'),
            generateBtn: document.getElementById('generate-btn'),
            suggestionButtons: document.querySelectorAll('.suggestion-btn'),
            collapseBtn: document.querySelector('.collapse-btn'),
            suggestionsGrid: document.querySelector('.suggestions-grid'),
            outputSection: document.getElementById('output-section'),
            loadingSection: document.getElementById('loading-section'),
            errorSection: document.getElementById('error-section'),
            generatedPrompt: document.getElementById('generated-prompt'),
            copyBtn: document.getElementById('copy-btn'),
            regenerateBtn: document.getElementById('regenerate-btn'),
            retryBtn: document.getElementById('retry-btn')
        };
    }

    bindEvents() {
        // Tab switching
        this.elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Generate button
        this.elements.generateBtn.addEventListener('click', () => this.generatePrompt());

        // Suggestion buttons
        this.elements.suggestionButtons.forEach(btn => {
            btn.addEventListener('click', () => this.useSuggestion(btn.dataset.suggestion));
        });

        // Collapse suggestions
        this.elements.collapseBtn.addEventListener('click', () => this.toggleSuggestions());

        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyPrompt());

        // Regenerate button
        this.elements.regenerateBtn.addEventListener('click', () => this.generatePrompt());

        // Retry button
        this.elements.retryBtn.addEventListener('click', () => this.generatePrompt());

        // Enter key in textarea
        this.elements.promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generatePrompt();
            }
        });
    }

    initializeTabs() {
        this.switchTab(this.currentTab);
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        this.elements.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update placeholder text based on tab
        const placeholders = {
            chatgpt: "I want a prompt that will help me write a professional email...",
            midjourney: "I want a prompt that will generate a beautiful landscape image...",
            optimizer: "I want to improve this existing prompt: [paste your prompt here]...",
            claude: "I want a prompt that will help Claude analyze complex data..."
        };

        this.elements.promptInput.placeholder = placeholders[tabName] || placeholders.chatgpt;

        // Update suggestions based on tab
        this.updateSuggestions(tabName);
    }

    updateSuggestions(tabName) {
        const suggestions = {
            chatgpt: [
                "Write a professional email",
                "Create a marketing strategy", 
                "Explain a complex topic",
                "Generate creative content",
                "Analyze business data",
                "Write compelling copy",
                "Plan a project timeline",
                "Brainstorm innovative ideas"
            ],
            midjourney: [
                "Create a fantasy landscape",
                "Design a modern logo",
                "Generate portrait art",
                "Create abstract patterns",
                "Design product mockups",
                "Generate concept art",
                "Create architectural views",
                "Design character concepts"
            ],
            optimizer: [
                "Make more specific",
                "Add creative elements",
                "Improve clarity",
                "Add constraints",
                "Enhance creativity",
                "Add context details",
                "Improve structure",
                "Add examples"
            ],
            claude: [
                "Analyze complex data",
                "Write technical docs",
                "Code review assistance",
                "Research synthesis",
                "Strategic planning",
                "Problem solving",
                "Data interpretation",
                "Process optimization"
            ]
        };

        const tabSuggestions = suggestions[tabName] || suggestions.chatgpt;
        
        this.elements.suggestionButtons.forEach((btn, index) => {
            if (index < tabSuggestions.length) {
                btn.textContent = tabSuggestions[index];
                btn.dataset.suggestion = tabSuggestions[index];
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    useSuggestion(suggestion) {
        const currentValue = this.elements.promptInput.value;
        const newValue = currentValue ? `${currentValue} ${suggestion}` : suggestion;
        this.elements.promptInput.value = newValue;
        this.elements.promptInput.focus();
    }

    toggleSuggestions() {
        const grid = this.elements.suggestionsGrid;
        const btn = this.elements.collapseBtn;
        
        if (grid.style.display === 'none') {
            grid.style.display = 'grid';
            btn.textContent = '−';
        } else {
            grid.style.display = 'none';
            btn.textContent = '+';
        }
    }

    async generatePrompt() {
        const userInput = this.elements.promptInput.value.trim();
        
        if (!userInput) {
            this.showError('Please enter a prompt description.');
            return;
        }

        if (this.isGenerating) return;

        this.isGenerating = true;
        this.showLoading();
        this.elements.generateBtn.disabled = true;

        try {
            const response = await this.callAPI(userInput);
            this.showResult(response);
        } catch (error) {
            console.error('Generation error:', error);
            this.showError(error.message || 'Failed to generate prompt. Please try again.');
        } finally {
            this.isGenerating = false;
            this.elements.generateBtn.disabled = false;
        }
    }

    async callAPI(userInput) {
        const promptType = this.elements.promptType.value;
        
        // Client-side prompt generation
        return this.generatePromptClientSide(userInput, promptType, this.currentTab);
    }

    generatePromptClientSide(userInput, promptType, targetPlatform) {
        const templates = {
            chatgpt: {
                creative: `You are a creative assistant. ${userInput}. Please provide a detailed, imaginative, and engaging response that includes specific examples, creative suggestions, and actionable steps. Be thorough and helpful while maintaining a conversational tone.`,
                technical: `You are an expert technical consultant. ${userInput}. Please provide a comprehensive technical analysis with step-by-step explanations, best practices, potential challenges, and recommended solutions. Include relevant examples and implementation details.`,
                business: `You are a business strategy expert. ${userInput}. Please provide strategic insights, market analysis, actionable recommendations, and potential ROI considerations. Structure your response with clear priorities and implementation timelines.`,
                educational: `You are an educational specialist. ${userInput}. Please explain this topic in a clear, structured way with examples, analogies, and practical applications. Break down complex concepts and provide learning objectives and assessment methods.`
            },
            claude: {
                creative: `I need help with a creative task. ${userInput}. Please provide innovative solutions, multiple perspectives, and detailed creative approaches. Include specific examples and implementation strategies.`,
                technical: `I need technical expertise for: ${userInput}. Please provide thorough technical analysis, code examples where relevant, best practices, and step-by-step implementation guidance.`,
                business: `I need business consulting on: ${userInput}. Please analyze this from multiple business angles, provide strategic recommendations, risk assessments, and actionable next steps with timelines.`,
                educational: `I need educational content about: ${userInput}. Please create comprehensive learning material with clear explanations, examples, exercises, and assessment criteria.`
            },
            midjourney: {
                creative: `Create a stunning visual: ${userInput}. Style: photorealistic, highly detailed, professional photography, dramatic lighting, vibrant colors, 8K resolution, award-winning composition`,
                technical: `Technical visualization: ${userInput}. Style: technical diagram, blueprint aesthetic, clean lines, professional documentation style, high contrast, detailed annotations, technical accuracy`,
                business: `Professional business visual: ${userInput}. Style: corporate, clean, modern, professional photography, business environment, high quality, polished, executive presentation style`,
                educational: `Educational illustration: ${userInput}. Style: clear, informative, diagram-style, educational poster, bright colors, easy to understand, classroom appropriate, detailed labels`
            },
            optimizer: {
                creative: `Original prompt: "${userInput}"\n\nOptimized creative prompt: Enhance this prompt by adding more specific creative details, emotional context, artistic style references, and clearer outcome expectations. Include specific examples and creative constraints that will lead to more engaging and original results.`,
                technical: `Original prompt: "${userInput}"\n\nOptimized technical prompt: Improve this prompt by adding technical specifications, implementation requirements, performance criteria, error handling considerations, and specific deliverables. Include relevant frameworks, methodologies, and success metrics.`,
                business: `Original prompt: "${userInput}"\n\nOptimized business prompt: Enhance this prompt by adding market context, stakeholder considerations, success metrics, timeline requirements, and strategic alignment. Include specific business outcomes and measurable objectives.`,
                educational: `Original prompt: "${userInput}"\n\nOptimized educational prompt: Improve this prompt by adding learning objectives, target audience specifications, assessment criteria, practical applications, and engagement strategies. Include specific educational outcomes and progression markers.`
            }
        };

        const platformTemplates = templates[targetPlatform] || templates.chatgpt;
        const selectedTemplate = platformTemplates[promptType] || platformTemplates.creative;
        
        return selectedTemplate;
    }

    showLoading() {
        this.hideAllSections();
        this.elements.loadingSection.style.display = 'block';
    }

    showResult(prompt) {
        this.hideAllSections();
        this.elements.generatedPrompt.textContent = prompt;
        this.elements.outputSection.style.display = 'block';
    }

    showError(message) {
        this.hideAllSections();
        this.elements.errorSection.querySelector('#error-message').textContent = message;
        this.elements.errorSection.style.display = 'block';
    }

    hideAllSections() {
        this.elements.outputSection.style.display = 'none';
        this.elements.loadingSection.style.display = 'none';
        this.elements.errorSection.style.display = 'none';
    }

    async copyPrompt() {
        const prompt = this.elements.generatedPrompt.textContent;
        
        try {
            await navigator.clipboard.writeText(prompt);
            
            // Visual feedback
            const originalText = this.elements.copyBtn.textContent;
            this.elements.copyBtn.textContent = '✓ Copied!';
            this.elements.copyBtn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.elements.copyBtn.textContent = originalText;
                this.elements.copyBtn.style.backgroundColor = '';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = prompt;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.elements.copyBtn.textContent = '✓ Copied!';
                setTimeout(() => {
                    this.elements.copyBtn.textContent = '📋 Copy';
                }, 2000);
            } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
            }
            
            document.body.removeChild(textArea);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PromptGenerator();
});

// Add some utility functions for enhanced user experience
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

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('prompt-input');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 300) + 'px';
        });
    }
});