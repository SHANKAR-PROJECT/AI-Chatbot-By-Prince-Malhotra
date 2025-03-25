// Radhe Radhe
document.addEventListener('DOMContentLoaded', function() {
  feather.replace();

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatEmpty = document.querySelector('.chat-empty');

  // Theme toggle
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

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  }

  // Auto-resize textarea
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  // Handle chat form submission
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    // Remove empty state if present
    if (chatEmpty) {
      chatEmpty.remove();
    }

    // Add user message
    addMessage(message, 'user');

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator();

    // ✅ API CALL TO SHANKAR GPT-3
    fetch(`https://shankar-gpt-3-api.vercel.app/api?message=${encodeURIComponent(message)}`)
      .then(response => response.json())
      .then(data => {
        removeTypingIndicator();
        addMessage(data.response, 'assistant');
      })
      .catch(error => {
        removeTypingIndicator();
        addMessage("❌ Error: Unable to process request.", 'assistant');
        console.error("API Error:", error);
      });
  });

  // Function to add a message to the chat
  function addMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', role);

    const header = document.createElement('div');
    header.classList.add('chat-message-header');
    header.textContent = role === 'user' ? 'You' : 'AI Assistant';

    const messageContent = document.createElement('div');
    messageContent.classList.add('chat-message-content');

    if (content.includes("```")) {
      const codeText = content.replace(/```/g, "").trim();
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = codeText;
      pre.appendChild(code);
      messageContent.appendChild(pre);
    } else {
      messageContent.textContent = content;
    }

    messageDiv.appendChild(header);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('chat-typing');
    typingDiv.id = 'typing-indicator';

    const header = document.createElement('div');
    header.classList.add('chat-message-header');
    header.textContent = 'AI Assistant';

    const dots = document.createElement('div');
    dots.style.display = 'flex';
    dots.style.gap = '0.25rem';

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.classList.add('chat-typing-dot');
      dots.appendChild(dot);
    }

    typingDiv.appendChild(header);
    typingDiv.appendChild(dots);
    chatMessages.appendChild(typingDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
});
