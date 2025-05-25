
// Google AdSense Integration Helper
class AdManager {
    constructor(publisherId) {
        this.publisherId = publisherId;
        this.adSlots = new Map();
        this.initialized = false;
    }
    
    // Initialize AdSense
    init() {
        if (this.initialized) return;
        
        // Create AdSense script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.publisherId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        
        this.initialized = true;
    }
    
    // Create an ad unit
    createAd(containerId, adSlotId, format = 'auto', isResponsive = true) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', this.publisherId);
        adElement.setAttribute('data-ad-slot', adSlotId);
        adElement.setAttribute('data-ad-format', format);
        
        if (isResponsive) {
            adElement.setAttribute('data-full-width-responsive', 'true');
        }
        
        container.appendChild(adElement);
        
        // Push to AdSense
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
        
        this.adSlots.set(containerId, adSlotId);
    }
    
    // Track ad performance (basic)
    trackAdClick(adSlotId) {
        console.log(`Ad clicked: ${adSlotId}`);
        // You can integrate with Google Analytics here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_click', {
                'ad_slot_id': adSlotId,
                'event_category': 'ads',
                'event_label': 'click'
            });
        }
    }
}

// Usage example:
// const adManager = new AdManager('ca-pub-YOUR_ADSENSE_ID');
// adManager.init();
// adManager.createAd('ad-container-1', 'YOUR_AD_SLOT_ID');

// Auto-create ads when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Replace with your actual AdSense ID
    const ADSENSE_ID = 'ca-pub-YOUR_ADSENSE_ID';
    
    // Only initialize if valid AdSense ID is provided
    if (ADSENSE_ID !== 'ca-pub-YOUR_ADSENSE_ID' && ADSENSE_ID.startsWith('ca-pub-')) {
        const adManager = new AdManager(ADSENSE_ID);
        adManager.init();
        
        // Auto-create ads for containers with class 'auto-ad'
        document.querySelectorAll('.auto-ad').forEach((container, index) => {
            const adSlotId = container.dataset.adSlot;
            if (adSlotId && container.id) {
                adManager.createAd(container.id, adSlotId);
            }
        });
    } else {
        // Hide placeholder ads or show demo content
        document.querySelectorAll('.ad-container').forEach(container => {
            const placeholder = container.querySelector('div[style*="background"]');
            if (placeholder) {
                placeholder.style.display = 'block';
            }
        });
    }
    
    // Ensure ad containers are responsive and fix layout issues
    function makeAdsResponsive() {
        const adContainers = document.querySelectorAll('.ad-container');
        adContainers.forEach(container => {
            container.style.width = '100%';
            container.style.maxWidth = '100%';
            container.style.overflow = 'hidden';
            container.style.margin = '1rem 0';
            
            // Ensure minimum height for layout stability
            if (container.offsetHeight === 0) {
                container.style.minHeight = '100px';
            }
        });
        
        // Fix AdSense containers that might cause layout issues
        document.querySelectorAll('.adsbygoogle').forEach(ad => {
            if (ad.offsetWidth === 0) {
                ad.style.display = 'none';
            }
        });
    }
    
    makeAdsResponsive();
    window.addEventListener('resize', makeAdsResponsive);
    
    // Re-check ad containers after a delay (for dynamic content)
    setTimeout(makeAdsResponsive, 1000);
});

// SEO and monetization helper functions
function optimizeForSEO() {
    // Add structured data for better search visibility
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Irakoze.net",
        "description": "Legitimate ways to earn money online without investment. Free games and cybersecurity resources.",
        "url": window.location.origin,
        "potentialAction": {
            "@type": "SearchAction",
            "target": window.location.origin + "/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Call SEO optimization
optimizeForSEO();
