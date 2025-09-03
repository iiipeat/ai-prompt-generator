// Cookie Consent Banner for GDPR/CCPA Compliance
(function() {
    'use strict';
    
    // Check if user has already given consent
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
    
    function createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <p><strong>We use cookies</strong> to enhance your experience and serve personalized ads. 
                    By continuing to use our site, you consent to our use of cookies and data collection practices. 
                    <a href="privacy.html" target="_blank" class="cookie-link">Privacy Policy</a></p>
                </div>
                <div class="cookie-consent-actions">
                    <button id="cookie-accept" class="cookie-btn cookie-accept">Accept All</button>
                    <button id="cookie-decline" class="cookie-btn cookie-decline">Decline</button>
                    <button id="cookie-customize" class="cookie-btn cookie-customize">Settings</button>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #1a1a1a;
                color: white;
                padding: 20px;
                z-index: 10000;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }
            
            #cookie-consent-banner.show {
                transform: translateY(0);
            }
            
            .cookie-consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                flex-wrap: wrap;
            }
            
            .cookie-consent-text p {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .cookie-link {
                color: #4A90E2;
                text-decoration: underline;
            }
            
            .cookie-consent-actions {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }
            
            .cookie-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .cookie-accept {
                background: #4A90E2;
                color: white;
            }
            
            .cookie-accept:hover {
                background: #357ABD;
            }
            
            .cookie-decline {
                background: #666;
                color: white;
            }
            
            .cookie-decline:hover {
                background: #555;
            }
            
            .cookie-customize {
                background: transparent;
                color: #4A90E2;
                border: 1px solid #4A90E2;
            }
            
            .cookie-customize:hover {
                background: #4A90E2;
                color: white;
            }
            
            @media (max-width: 768px) {
                .cookie-consent-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-consent-actions {
                    width: 100%;
                    justify-content: center;
                }
                
                .cookie-btn {
                    flex: 1;
                    max-width: 120px;
                }
            }
        `;
        
        // Insert styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        // Insert banner
        document.body.appendChild(banner);
        
        // Show banner after a short delay
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
        
        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', function() {
            setCookie('cookie-consent', 'accepted', 365);
            hideBanner();
            // Enable Google AdSense and other tracking
            enableTracking();
        });
        
        document.getElementById('cookie-decline').addEventListener('click', function() {
            setCookie('cookie-consent', 'declined', 365);
            hideBanner();
            // Disable tracking
            disableTracking();
        });
        
        document.getElementById('cookie-customize').addEventListener('click', function() {
            // For now, redirect to privacy policy
            window.open('privacy.html', '_blank');
        });
        
        function hideBanner() {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }
    
    function enableTracking() {
        // Enable Google AdSense
        if (window.adsbygoogle) {
            // AdSense is already loaded, just enable
            console.log('AdSense tracking enabled');
        }
        
        // Enable Google Analytics if present
        if (window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted'
            });
        }
    }
    
    function disableTracking() {
        // Disable tracking
        console.log('Tracking disabled per user preference');
        
        // Disable Google Analytics if present
        if (window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }
    }
    
    // Initialize
    function init() {
        const consent = getCookie('cookie-consent');
        
        if (consent === 'accepted') {
            enableTracking();
        } else if (consent === 'declined') {
            disableTracking();
        } else {
            // Show cookie banner
            createCookieBanner();
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();