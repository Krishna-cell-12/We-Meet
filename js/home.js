// Smooth scrolling for navigation links
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

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Profile card hover effects
document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Add floating hearts continuously
function createFloatingHeart() {
    const heartsContainer = document.querySelector('.floating-hearts');
    if (heartsContainer) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = ['❤️', '💕', '💖'][Math.floor(Math.random() * 3)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }
}

// Create floating hearts periodically
setInterval(createFloatingHeart, 3000);

// Button click animations
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = (e.clientX - e.target.offsetLeft) + 'px';
        ripple.style.top = (e.clientY - e.target.offsetTop) + 'px';
        ripple.style.width = ripple.style.height = '20px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Profile Management System
class ProfileManager {
    constructor() {
        this.profiles = this.loadProfiles();
        this.filteredProfiles = this.profiles;
        this.initializeEventListeners();
        this.listenForRealTimeUpdates && this.listenForRealTimeUpdates();
    }

    // Load profiles from localStorage or use default profiles
    loadProfiles() {
        const savedProfiles = localStorage.getItem('weMeetProfiles');
        let profiles = [];
        if (savedProfiles) {
            profiles = JSON.parse(savedProfiles);
        }
        // Only keep real user profiles (with userId or email)
        profiles = profiles.filter(p => p.userId || p.email);
        return profiles;
    }

    // Save profiles to localStorage
    saveProfiles() {
        localStorage.setItem('weMeetProfiles', JSON.stringify(this.profiles));
    }
    // Add new profile
    addProfile(profileData) {
        // Support both legacy and Firebase-style data
        const newProfile = {
            id: profileData.userId || profileData.id || 'profile_' + Date.now(),
            name: profileData.displayName || profileData.name,
            picture: profileData.photoUrl || profileData.picture || 'https://via.placeholder.com/90x90/ff6b9d/ffffff?text=' + ((profileData.displayName || profileData.name) ? (profileData.displayName || profileData.name).charAt(0) : 'U'),
            interests: profileData.interests || [],
            rating: 0,
            age: profileData.age,
            location: profileData.location,
            bio: profileData.bio,
            lookingFor: profileData.lookingFor,
            createdAt: profileData.createdAt ? (typeof profileData.createdAt === 'object' && profileData.createdAt.toDate ? profileData.createdAt.toDate().toISOString() : profileData.createdAt) : new Date().toISOString()
        };

        // Add to beginning of array to show newest first
        this.profiles.unshift(newProfile);
        this.saveProfiles();
        this.renderProfiles();
        
        // Show success animation
        this.showProfileAddedAnimation(newProfile);
        
        // Scroll to profiles section
        setTimeout(() => {
            const profilesSection = document.getElementById('profiles');
            if (profilesSection) {
                profilesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
        
        return newProfile;
    }

    // Show profile added animation
    showProfileAddedAnimation(profile) {
        const notification = document.createElement('div');
        notification.className = 'profile-added-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🎉</div>
                <div class="notification-text">
                    <strong>${profile.name}</strong> has been added to Discover Profiles!
                </div>
                <div class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</div>
            </div>
        `;
        // Add styles for notification
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .profile-added-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ff6b9d, #ff9a9e);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
                z-index: 10000;
                animation: slideInRight 0.5s ease-out;
                max-width: 350px;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-icon {
                font-size: 24px;
            }
            .notification-text {
                flex: 1;
                font-size: 14px;
            }
            .notification-close {
                cursor: pointer;
                font-size: 18px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(notificationStyle);
        document.body.appendChild(notification);
    }

    // Filter profiles by selected interests
    filterProfilesByInterests(selectedInterests) {
        if (!selectedInterests || selectedInterests.length === 0) {
            this.filteredProfiles = this.profiles;
        } else {
            this.filteredProfiles = this.profiles.filter(profile => {
                if (!profile.interests || profile.interests.length === 0) return false;
                return profile.interests.some(interest => selectedInterests.includes(interest));
            });
        }
        this.renderProfiles();
    }

    // Render profiles in the grid
    renderProfiles() {
        const grid = document.getElementById('profilesGrid');
        if (!grid) return;
        grid.innerHTML = '';

        // Get current user ID from localStorage (if available)
        let currentUserId = null;
        try {
            const user = JSON.parse(localStorage.getItem('firebase:authUser:we-meet-36738::firebase')); // Firebase Auth localStorage key
            if (user && user.uid) currentUserId = user.uid;
        } catch (e) {}

        // Always show current user's profile at the top if present
        let profiles = this.filteredProfiles || this.profiles;
        if (currentUserId) {
            const idx = profiles.findIndex(p => p.id === currentUserId || p.userId === currentUserId);
            if (idx > 0) {
                const [userProfile] = profiles.splice(idx, 1);
                profiles.unshift(userProfile);
            }
        }

        if (profiles.length === 0) {
            grid.innerHTML = '<div style="text-align:center;color:#888;padding:32px;">No profiles found yet!</div>';
            return;
        }

        profiles.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'profile-card';
            card.innerHTML = `
                <img src="${profile.picture || profile.photoUrl || 'https://via.placeholder.com/90x90/ff6b9d/ffffff?text=' + (profile.name ? profile.name.charAt(0) : 'U')}" class="profile-pic" alt="${profile.name}">
                <div class="profile-info">
                    <h3>${profile.name}</h3>
                    <p><strong>Age:</strong> ${profile.age || ''}</p>
                    <p><strong>Location:</strong> ${profile.location || ''}</p>
                    <p>${profile.bio || ''}</p>
                    <div class="interests-list">
                        ${(profile.interests || []).map(i => `<span class="interest">${i}</span>`).join(' ')}
                    </div>
                    <div class="profile-actions">
                        ${(currentUserId && (profile.id !== currentUserId && profile.userId !== currentUserId)) ? `<button class="chat-btn" data-userid="${profile.id || profile.userId}">Chat</button>` : ''}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Add event listeners for chat buttons
        grid.querySelectorAll('.chat-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-userid');
                window.location.href = `chats.html?userId=${encodeURIComponent(userId)}`;
            });
        });
    }

    // Attach rating event listeners
    attachRatingListeners() {
        document.querySelectorAll('.profile-rating').forEach(ratingDiv => {
            ratingDiv.addEventListener('click', (e) => {
                if (e.target.classList.contains('star')) {
                    const idx = +ratingDiv.getAttribute('data-idx');
                    const star = +e.target.getAttribute('data-star');
                    
                    // Update rating in profiles array
                    const sortedProfiles = [...this.profiles].sort((a, b) => 
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    
                    if (sortedProfiles[idx]) {
                        const profileId = sortedProfiles[idx].id;
                        const profileIndex = this.profiles.findIndex(p => p.id === profileId);
                        if (profileIndex !== -1) {
                            this.profiles[profileIndex].rating = star;
                            this.saveProfiles();
                            this.renderProfiles();
                        }
                    }
                }
            });
        });
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Listen for profile creation events
        window.addEventListener('profileCreated', (event) => {
            this.addProfile(event.detail);
        });
        
        // Listen for storage changes (if profiles are updated from other tabs)
        window.addEventListener('storage', (event) => {
            if (event.key === 'weMeetProfiles') {
                this.profiles = this.loadProfiles();
                this.renderProfiles();
            }
        });
    }

    // Chat functionality
    startChat(name) {
        // Create a more sophisticated chat interface
        const chatModal = document.createElement('div');
        chatModal.className = 'chat-modal';
        chatModal.innerHTML = `
            <div class="chat-modal-content">
                <div class="chat-header">
                    <h3>Chat with ${name}</h3>
    // Initialize event listeners
    initializeEventListeners() {
        // Listen for profile creation events
        window.addEventListener('profileCreated', (event) => {
            this.addProfile(event.detail);
        });
        
        // Listen for storage changes (if profiles are updated from other tabs)
        window.addEventListener('storage', (event) => {
            if (event.key === 'weMeetProfiles') {
                this.profiles = this.loadProfiles();
                this.renderProfiles();
            }
        });
    }

    // Listen for real-time updates (placeholder for Firebase or other real-time DB)
    listenForRealTimeUpdates() {
        // If using Firebase, you would set up a real-time listener here
        // For now, we'll just listen for the custom event
        window.addEventListener('profileCreated', (event) => {
            this.addProfile(event.detail);
        });
    }
            .chat-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .chat-modal-content {
                background: white;
                border-radius: 15px;
                width: 90%;
                max-width: 500px;
                height: 70vh;
                display: flex;
                flex-direction: column;
            }
            .chat-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }
            .system-message {
                text-align: center;
                color: #666;
                font-style: italic;
                margin-bottom: 20px;
            }
            .chat-input-area {
                padding: 20px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }
            .chat-input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 20px;
                outline: none;
            }
            .send-btn {
                background: #ff6b9d;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
            }
            .close-chat {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
            }
        `;
        
        document.head.appendChild(chatStyle);
        document.body.appendChild(chatModal);
    }

    // Like functionality
    sendLike(name) {
        // Create like animation
        const likeNotification = document.createElement('div');
        likeNotification.className = 'like-notification';
        likeNotification.innerHTML = `
            <div class="like-animation">❤️</div>
            <div class="like-text">You liked ${name}'s profile!</div>
        `;
        
        // Add like animation styles
        const likeStyle = document.createElement('style');
        likeStyle.textContent = `
            .like-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
                z-index: 10000;
                animation: likePopup 2s ease-out forwards;
            }
            .like-animation {
                font-size: 60px;
                margin-bottom: 10px;
                animation: heartBeat 1s infinite;
            }
            .like-text {
                font-size: 18px;
                color: #333;
                font-weight: 600;
            }
            @keyframes likePopup {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
            }
            @keyframes heartBeat {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.2);
                }
            }
        `;
        
        document.head.appendChild(likeStyle);
        document.body.appendChild(likeNotification);
        
        setTimeout(() => {
            likeNotification.remove();
        }, 2000);
    }
}

// Initialize Profile Manager
const profileManager = new ProfileManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    profileManager.renderProfiles();
    
    // Add interest management
    const interestsForm = document.getElementById('interestsForm');
    const addInterestBtn = document.getElementById('addInterestBtn');
    const newInterestInput = document.getElementById('newInterestInput');
    
    if (addInterestBtn && newInterestInput) {
        addInterestBtn.addEventListener('click', () => {
            const newInterest = newInterestInput.value.trim();
            if (newInterest && newInterest.length > 0) {
                const interestsGrid = document.getElementById('interestsGrid');
                const newLabel = document.createElement('label');
                newLabel.className = 'interest-label';
                newLabel.innerHTML = `
                    <input type="checkbox" name="interests" value="${newInterest}" checked>
                    <span class="emoji">✨</span> ${newInterest}
                `;
                interestsGrid.appendChild(newLabel);
                newInterestInput.value = '';
            }
        });
        
        newInterestInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addInterestBtn.click();
            }
        });
    }
    
    // Handle interests form submission
    if (interestsForm) {
        interestsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedInterests = Array.from(interestsForm.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
            profileManager.filterProfilesByInterests(selectedInterests);
        });
    }

    // Add event listener for interests form
    const interestsFormTop = document.getElementById('interestsForm');
    if (interestsFormTop) {
        interestsFormTop.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedInterests = Array.from(interestsFormTop.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
            profileManager.filterProfilesByInterests(selectedInterests);
        });
    }
    // On page load, show all profiles
    profileManager.filteredProfiles = profileManager.profiles;
    profileManager.renderProfiles();
});

// Global functions for compatibility
window.profileManager = profileManager;
window.startChat = (name) => profileManager.startChat(name);
window.sendLike = (name) => profileManager.sendLike(name);
window.viewProfile = (id) => profileManager.viewProfile(id);