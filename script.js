document.addEventListener('DOMContentLoaded', function() {
  // Initialize Feather icons
  feather.replace();

  // DOM elements
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatEmpty = document.querySelector('.chat-empty');

  // Theme toggle
  themeToggleBtn.addEventListener('click', function() {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
  });

  // Check for saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
  }

  // Auto-resize textarea
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
  });

  // Handle chat form submission
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    if (chatEmpty) chatEmpty.remove(); // Remove empty state if present

    addMessage(message, 'user'); // Add user message
    chatInput.value = ''; 
    chatInput.style.height = 'auto';

    showTypingIndicator(); // Show typing indicator

    // Fetch response from API
    fetch(`https://shankar-gpt-3-api.vercel.app/api?message=${encodeURIComponent(message)}`)
      .then(response => response.json())
      .then(data => {
        removeTypingIndicator();
        addMessage(data.response, 'assistant'); // Show AI response
      })
      .catch(error => {
        removeTypingIndicator();
        addMessage("माफ़ करना, कुछ गड़बड़ हो गई!", 'assistant');
        console.error("Error:", error);
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
    messageContent.textContent = content;

    messageDiv.appendChild(header);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
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

    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
  }

  // Function to remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
  }
});
