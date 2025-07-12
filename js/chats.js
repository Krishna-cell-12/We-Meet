// Helper to get query parameter
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// Get current user from Firebase Auth localStorage (same as home.js)
function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem('firebase:authUser:we-meet-36738::firebase'));
        return user;
    } catch (e) { return null; }
}

// Get all profiles from localStorage
function getAllProfiles() {
    return JSON.parse(localStorage.getItem('weMeetProfiles')) || [];
}

// Get chat partner info
const partnerId = getQueryParam('userId');
const currentUser = getCurrentUser();
const profiles = getAllProfiles();
const partner = profiles.find(p => p.id === partnerId || p.userId === partnerId);

// Display chat header
const chatHeader = document.getElementById('chatHeader');
if (partner) {
    chatHeader.innerHTML = `
        <img src="${partner.picture || partner.photoUrl || 'https://via.placeholder.com/90x90/ff6b9d/ffffff?text=' + (partner.name ? partner.name.charAt(0) : 'U')}" alt="${partner.name}">
        <div><strong>${partner.name}</strong><br><span style="font-size:13px;color:#888;">Private Chat</span></div>
    `;
} else {
    chatHeader.innerHTML = '<span>User not found.</span>';
}

// Chat storage key
const chatKey = currentUser && partnerId ? `chat_${currentUser.uid}_${partnerId}` : null;

// Load and render messages
function loadMessages() {
    if (!chatKey) return;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'chat-message' + (msg.sender === currentUser.uid ? ' me' : '');
        div.innerHTML = `<span class="bubble">${msg.text}</span><div style="font-size:10px;color:#aaa;">${new Date(msg.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>`;
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
const chatForm = document.getElementById('chatForm');
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!chatKey) return;
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    let messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    messages.push({ sender: currentUser.uid, text, time: Date.now() });
    localStorage.setItem(chatKey, JSON.stringify(messages));
    input.value = '';
    loadMessages();
});

// Initial load
loadMessages();
// Optionally, poll for new messages every 2 seconds (for demo)
setInterval(loadMessages, 2000); 