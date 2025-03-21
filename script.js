// Radhe Radhe
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Feather icons
  feather.replace();

  // DOM elements
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
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

  // Sidebar toggle for mobile
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
  });

  sidebarClose.addEventListener('click', function() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
  });

  sidebarOverlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
  });

  // Auto-resize textarea
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
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
    
    // Simulate AI response after delay
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(`Here's a solution to your query: "${message}".\n\nI've analyzed your request and prepared a comprehensive response based on the latest data and best practices.`, 'assistant');
    }, 1500);
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

  // Sidebar navigation items
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
});