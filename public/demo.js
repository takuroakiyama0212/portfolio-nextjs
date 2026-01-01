// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all feature cards and steps
    document.querySelectorAll('.feature-card, .step').forEach(el => {
        observer.observe(el);
    });

    // Update GitHub link if needed
    const githubLink = document.querySelector('a[href*="github.com"]');
    if (githubLink && githubLink.href.includes('yourusername')) {
        // You can update this programmatically or leave it for manual update
        console.log('Update GitHub repository URL in demo.html');
    }

    // Add active state to navigation links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.footer-links a[href^="#"]');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // Parallax effect removed to prevent UI overlapping issues

    // Get default web app URL
    function getDefaultWebAppUrl() {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        
        // If on Vercel (vercel.app domain)
        if (url.hostname.includes('vercel.app')) {
            // Demo is at root, app is at /app
            return url.origin + '/app';
        }
        
        // If on GitHub Pages (github.io domain)
        if (url.hostname.includes('github.io')) {
            // Remove /demo.html and return base URL
            const basePath = url.pathname.replace(/\/demo\.html$/, '');
            return `${url.protocol}//${url.hostname}${basePath}/`;
        }
        
        // If on localhost, try to get local network IP for mobile access
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            // For mobile QR code scanning, we need the actual network IP
            // User should replace this with their computer's local IP (e.g., 192.168.1.100:8081)
            // Or use a service like ngrok for public access
            return 'http://localhost:8081';
        }
        
        // Default: Vercel format (user can edit)
        return url.origin + '/app';
    }
    
    // Function to get local network IP (for mobile QR code access)
    async function getLocalNetworkIP() {
        try {
            // Try to get IP from WebRTC (works in some browsers)
            const pc = new RTCPeerConnection({iceServers: []});
            pc.createDataChannel('');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            return new Promise((resolve) => {
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        const candidate = event.candidate.candidate;
                        const match = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
                        if (match && !match[0].startsWith('127.')) {
                            pc.close();
                            resolve(match[0]);
                        }
                    }
                };
                setTimeout(() => {
                    pc.close();
                    resolve(null);
                }, 1000);
            });
        } catch (error) {
            return null;
        }
    }

    // QR Modal logic
    const qrModal = document.getElementById('qr-modal');
    const qrBackdrop = document.getElementById('qr-backdrop');
    const qrClose = document.getElementById('qr-close');
    const qrOpenBtn = document.getElementById('open-qr');
    const qrImage = document.getElementById('qr-image');
    const qrUrlInput = document.getElementById('qr-url');
    const qrCopyBtn = document.getElementById('qr-copy');
    const qrOpenLinkBtn = document.getElementById('qr-open');

    // Set default URL when page loads
    let defaultUrl = getDefaultWebAppUrl();
    
    // If on localhost, try to detect network IP for mobile access
    if (defaultUrl.includes('localhost') || defaultUrl.includes('127.0.0.1')) {
        getLocalNetworkIP().then(ip => {
            if (ip && qrUrlInput) {
                // Replace localhost with detected IP
                const newUrl = defaultUrl.replace(/localhost|127\.0\.0\.1/, ip);
                qrUrlInput.placeholder = newUrl;
                // Show hint to user
                console.log('💡 For mobile QR code, use:', newUrl);
            }
        });
    }
    
    if (qrUrlInput) {
        qrUrlInput.value = defaultUrl;
    }

    function updateQrImage(url) {
        if (!url || url.trim() === '') return;
        // Clean and normalize URL
        const cleanUrl = url.trim();
        // Ensure URL is properly formatted
        let finalUrl = cleanUrl;
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            finalUrl = 'http://' + cleanUrl;
        }
        // Remove trailing slash for consistency
        finalUrl = finalUrl.replace(/\/$/, '');
        
        // Encode the URL for QR code (use the exact URL, not encoded)
        const encoded = encodeURIComponent(finalUrl);
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&data=${encoded}`;
        
        // Display the URL below QR code for verification
        const urlDisplay = document.getElementById('qr-url-display');
        if (urlDisplay) {
            urlDisplay.textContent = finalUrl;
        }
        
        // Store the final URL for debugging
        qrImage.setAttribute('data-url', finalUrl);
    }

    function openModal() {
        qrModal.classList.add('active');
        qrModal.setAttribute('aria-hidden', 'false');
        // Ensure URL is set before updating QR
        if (!qrUrlInput.value || qrUrlInput.value.trim() === '') {
            qrUrlInput.value = getDefaultWebAppUrl();
        }
        // Normalize URL before generating QR
        let url = qrUrlInput.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
            qrUrlInput.value = url;
        }
        updateQrImage(url);
    }

    function closeModal() {
        qrModal.classList.remove('active');
        qrModal.setAttribute('aria-hidden', 'true');
    }

    qrOpenBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    qrClose?.addEventListener('click', closeModal);
    qrBackdrop?.addEventListener('click', closeModal);

    qrUrlInput?.addEventListener('input', (e) => {
        let url = e.target.value.trim();
        // Auto-add http:// if missing
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
            e.target.value = url;
        }
        updateQrImage(url);
    });

    qrCopyBtn?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(qrUrlInput.value);
            qrCopyBtn.textContent = 'Copied!';
            setTimeout(() => { qrCopyBtn.textContent = 'Copy Link'; }, 1500);
        } catch (error) {
            alert('Failed to copy link');
        }
    });

    qrOpenLinkBtn?.addEventListener('click', () => {
        const url = qrUrlInput.value.trim();
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('Please enter a valid URL');
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && qrModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Console message
    console.log('%c🚗 CarSwipe Demo Page', 'font-size: 20px; font-weight: bold; color: #FF6B6B;');
    console.log('%cBuilt with React Native, Expo, and Firebase', 'font-size: 12px; color: #868E96;');
});

