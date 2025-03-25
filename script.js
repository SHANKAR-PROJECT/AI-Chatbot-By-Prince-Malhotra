document.addEventListener('DOMContentLoaded', function() {
    feather.replace(); // Initialize Feather icons

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatEmpty = document.querySelector('.chat-empty');

    // 🌙 Theme Toggle
    themeToggleBtn.addEventListener('click', function() {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 📝 Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // 💬 Chat Form Submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        if (chatEmpty) chatEmpty.remove(); // Remove "empty chat" message

        addMessage(message, 'user'); // User message
        chatInput.value = '';
        chatInput.style.height = 'auto';

        showTypingIndicator(); // Show typing dots

        // Fetch AI response from Shankar GPT-3 API
        fetch(`https://shankar-gpt-3-api.vercel.app/api?message=${encodeURIComponent(message)}`)
            .then(response => response.json())
            .then(data => {
                removeTypingIndicator();
                if (data.status) {
                    addMessage(data.response, 'assistant'); // AI Response
                } else {
                    addMessage("Oops! Kuch gadbad ho gayi. 😕", 'assistant');
                }
            })
            .catch(error => {
                removeTypingIndicator();
                addMessage("Sorry, error aa gaya. 🚨", 'assistant');
                console.error("Error:", error);
            });
    });

    // ➕ Add Message to Chat
    function addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', role);

        const header = document.createElement('div');
        header.classList.add('chat-message-header');
        header.textContent = role === 'user' ? 'You' : 'AI Assistant';

        const messageContent = document.createElement('div');
        messageContent.classList.add('chat-message-content');
        messageContent.textContent = content;

        messageDiv.appendChild(header);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    // ⏳ Show Typing Indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-typing');
        typingDiv.id = 'typing-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('chat-typing-dot');
            typingDiv.appendChild(dot);
        }

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ❌ Remove Typing Indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }
});
