document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('template-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card');
    const categorySections = document.querySelectorAll('.template-category-section');
    const useTemplateButtons = document.querySelectorAll('.use-template-btn');
    const copyTemplateButtons = document.querySelectorAll('.copy-template-btn');

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Show all sections first
        categorySections.forEach(section => {
            section.style.display = 'block';
        });
        
        templateCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.template-description').textContent.toLowerCase();
            const template = card.querySelector('.template-preview p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || template.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Hide empty sections
        categorySections.forEach(section => {
            const visibleCards = section.querySelectorAll('.template-card[style="display: block"], .template-card:not([style])');
            const hasVisibleCards = Array.from(visibleCards).some(card => card.style.display !== 'none');
            section.style.display = hasVisibleCards ? 'block' : 'none';
        });
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            if (category === 'all') {
                // Show all sections and cards
                categorySections.forEach(section => {
                    section.style.display = 'block';
                });
                templateCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                // Show only matching category section
                categorySections.forEach(section => {
                    const sectionId = section.id;
                    const sectionCategory = sectionId.replace('-section', '');
                    
                    if (sectionCategory === category) {
                        section.style.display = 'block';
                        // Show all cards in this section
                        section.querySelectorAll('.template-card').forEach(card => {
                            card.style.display = 'block';
                        });
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
            
            // Clear search when filtering
            searchInput.value = '';
        });
    });

    // Use Template functionality - navigate to home page with pre-filled prompt
    useTemplateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            // Store template in localStorage to pass to main page
            localStorage.setItem('selectedTemplate', template);
            // Navigate to main page
            window.location.href = 'index.html';
        });
    });

    // Copy Template functionality
    copyTemplateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            
            // Copy to clipboard
            navigator.clipboard.writeText(template).then(() => {
                // Show feedback
                const originalText = this.textContent;
                this.textContent = '✓';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = template;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show feedback
                const originalText = this.textContent;
                this.textContent = '✓';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 1500);
            });
        });
    });

    // Template preview expand/collapse
    const templatePreviews = document.querySelectorAll('.template-preview');
    templatePreviews.forEach(preview => {
        const previewText = preview.querySelector('p');
        const fullText = previewText.textContent;
        
        // Initially show truncated version if text is long
        if (fullText.length > 150) {
            const truncatedText = fullText.substring(0, 150) + '...';
            previewText.textContent = truncatedText;
            
            // Add click to expand
            preview.style.cursor = 'pointer';
            preview.addEventListener('click', function() {
                if (previewText.textContent.includes('...')) {
                    previewText.textContent = fullText;
                } else {
                    previewText.textContent = truncatedText;
                }
            });
        }
    });
});