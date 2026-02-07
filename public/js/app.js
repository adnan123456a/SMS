// Socket.IO Connection
const socket = io();

// State
let currentUser = null;
let currentRoom = null;
let currentRoomId = null;
let allRooms = [];
let isLoginMode = true;

// DOM Elements
const authSection = document.getElementById('authSection');
const mainSection = document.getElementById('mainSection');

// Login Form Elements
const loginForm = document.getElementById('loginForm');
const loginUsernameInput = document.getElementById('loginUsername');
const loginPasswordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginErrorMsg = document.getElementById('loginError');
const toRegisterBtn = document.getElementById('showRegisterBtn');

// Register Form Elements
const registerForm = document.getElementById('registerForm');
const registerUsernameInput = document.getElementById('regUsername');
const registerEmailInput = document.getElementById('regEmail');
const registerPasswordInput = document.getElementById('regPassword');
const registerBtn = document.getElementById('registerBtn');
const registerErrorMsg = document.getElementById('registerError');
const toLoginBtn = document.getElementById('showLoginBtn');

// Chat Elements
const roomList = document.getElementById('roomList');
const createRoomBtn = document.getElementById('createRoomBtn');
const roomModal = document.getElementById('roomModal');
const roomNameInput = document.getElementById('roomName');
const roomDescriptionInput = document.getElementById('roomDescription');
const createBtn = document.getElementById('createBtn');
const closeBtn = document.querySelector('.close');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const currentRoomName = document.getElementById('currentRoomName');
const userCount = document.getElementById('userCount');
const userMenu = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
const userAvatar = document.getElementById('userMenuBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfoDiv = document.getElementById('userInfo');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  setupEventListeners();
  loadChatRooms();
});

// Check if user is already authenticated
async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const user = await response.json();
      currentUser = user;
      showChatSection();
      loadChatRooms();
    } else {
      showAuthSection();
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    showAuthSection();
  }
}

// Show/Hide Sections
function showAuthSection() {
  authSection.style.display = 'flex';
  mainSection.style.display = 'none';
}

function showChatSection() {
  authSection.style.display = 'none';
  mainSection.style.display = 'flex';
  updateUserDisplay();
}

// Update user display in header
function updateUserDisplay() {
  if (currentUser && userInfoDiv) {
    const userInitial = currentUser.username ? currentUser.username[0].toUpperCase() : '?';
    userAvatar.textContent = userInitial;
    userInfoDiv.innerHTML = `
      <strong>${currentUser.username || 'Unknown'}</strong>
      <small>${currentUser.email || 'No email'}</small>
    `;
  }
}

// Toggle between login and register forms
function toggleAuthMode(isLogin) {
  isLoginMode = isLogin;
  if (isLogin) {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault();
  loginErrorMsg.textContent = '';
  
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();

  if (!username || !password) {
    loginErrorMsg.textContent = 'Username and password are required';
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem('chatUsername', username);
      loginUsernameInput.value = '';
      loginPasswordInput.value = '';
      showChatSection();
      loadChatRooms();
    } else {
      loginErrorMsg.textContent = data.message || 'Login failed';
    }
  } catch (error) {
    console.error('Login error:', error);
    loginErrorMsg.textContent = 'An error occurred. Please try again.';
  }
}

// Handle Register
async function handleRegister(e) {
  e.preventDefault();
  registerErrorMsg.textContent = '';

  const username = registerUsernameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const password = registerPasswordInput.value.trim();

  if (!username || !email || !password) {
    registerErrorMsg.textContent = 'All fields are required';
    return;
  }

  if (username.length < 2) {
    registerErrorMsg.textContent = 'Username must be at least 2 characters';
    return;
  }

  if (password.length < 6) {
    registerErrorMsg.textContent = 'Password must be at least 6 characters';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    registerErrorMsg.textContent = 'Please enter a valid email address';
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem('chatUsername', username);
      registerUsernameInput.value = '';
      registerEmailInput.value = '';
      registerPasswordInput.value = '';
      showChatSection();
      loadChatRooms();
    } else {
      registerErrorMsg.textContent = data.message || 'Registration failed';
    }
  } catch (error) {
    console.error('Register error:', error);
    registerErrorMsg.textContent = 'An error occurred. Please try again.';
  }
}

// Handle Logout
async function handleLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    currentUser = null;
    localStorage.removeItem('chatUsername');
    toggleAuthMode(true);
    showAuthSection();
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Toggle User Dropdown Menu
function toggleUserDropdown() {
  userDropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (userMenu && !userMenu.contains(e.target) && userDropdown && !userDropdown.contains(e.target)) {
    userDropdown.classList.remove('active');
  }
});

// Event Listeners
function setupEventListeners() {
  // Auth form toggles
  toRegisterBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthMode(false);
  });

  toLoginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthMode(true);
  });

  // Login form
  loginBtn.addEventListener('click', handleLogin);
  loginForm.addEventListener('submit', handleLogin);
  loginPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin(e);
  });

  // Register form
  registerBtn.addEventListener('click', handleRegister);
  registerForm.addEventListener('submit', handleRegister);
  registerPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleRegister(e);
  });

  // Chat events
  createRoomBtn.addEventListener('click', () => {
    roomModal.style.display = 'block';
    roomNameInput.focus();
  });

  closeBtn.addEventListener('click', () => {
    roomModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === roomModal) {
      roomModal.style.display = 'none';
    }
  });

  createBtn.addEventListener('click', handleCreateRoom);
  roomNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCreateRoom();
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  sendBtn.addEventListener('click', handleSendMessage);

  // User menu
  userAvatar?.addEventListener('click', toggleUserDropdown);
  logoutBtn?.addEventListener('click', handleLogout);
}

// Load Chat Rooms
async function loadChatRooms() {
  try {
    const response = await fetch('/api/chatrooms');
    allRooms = await response.json();
    renderRoomList();
  } catch (error) {
    console.error('Error loading rooms:', error);
  }
}

// Render Room List
function renderRoomList() {
  roomList.innerHTML = '';

  if (allRooms.length === 0) {
    roomList.innerHTML = '<p style="padding: 20px; text-align: center; color: #888;">No rooms yet. Create one!</p>';
    return;
  }

  allRooms.forEach((room) => {
    const roomItem = document.createElement('div');
    roomItem.className = `room-item ${room._id === currentRoomId ? 'active' : ''}`;
    roomItem.innerHTML = `
      <div class="room-name"># ${room.name}</div>
      <div class="room-description">${room.description || 'No description'}</div>
      <div style="font-size: 0.75rem; color: #666; margin-top: 4px;">${room.messageCount || 0} messages</div>
    `;
    roomItem.addEventListener('click', () => selectRoom(room));
    roomList.appendChild(roomItem);
  });
}

// Select Room
function selectRoom(room) {
  // Leave previous room
  if (currentRoom) {
    socket.emit('leaveRoom', currentRoom.name);
  }

  currentRoom = room;
  currentRoomId = room._id;

  // Update URL to /chat/:roomName
  window.history.pushState({}, document.title, `/chat/${room.name}`);

  // Update UI
  currentRoomName.textContent = `# ${room.name}`;
  messageInput.disabled = false;
  sendBtn.disabled = false;
  messagesContainer.innerHTML = '<div class="empty-state"><p>Loading messages...</p></div>';

  // Join new room
  socket.emit('joinRoom', room.name);

  // Load messages
  loadMessages();

  // Update active state
  document.querySelectorAll('.room-item').forEach((item) => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
}

// Load Messages
async function loadMessages() {
  try {
    const response = await fetch(`/api/messages/${currentRoomId}?limit=50`);
    const data = await response.json();
    
    messagesContainer.innerHTML = '';

    if (data.messages.length === 0) {
      messagesContainer.innerHTML = '<div class="empty-state"><p>No messages yet. Start the conversation!</p></div>';
      return;
    }

    data.messages.forEach((msg) => {
      appendMessage(msg, false);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Handle Create Room
async function handleCreateRoom() {
  const name = roomNameInput.value.trim();
  const description = roomDescriptionInput.value.trim();

  if (!name || name.length < 2) {
    alert('Room name must be at least 2 characters');
    return;
  }

  try {
    const response = await fetch('/api/chatrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        createdBy: currentUser._id || currentUser.username
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Error creating room');
      return;
    }

    const newRoom = await response.json();

    // Close modal
    roomModal.style.display = 'none';
    roomNameInput.value = '';
    roomDescriptionInput.value = '';

    // Reload rooms
    loadChatRooms();

    // Auto-select new room
    setTimeout(() => selectRoom(newRoom), 100);
  } catch (error) {
    console.error('Error creating room:', error);
    alert('Error creating room');
  }
}

// Handle Send Message
function handleSendMessage() {
  const message = messageInput.value.trim();

  if (!message || !currentRoom || !currentUser) {
    return;
  }

  socket.emit('sendMessage', {
    roomId: currentRoomId,
    roomName: currentRoom.name,
    senderId: currentUser._id || currentUser.username,
    senderName: currentUser.username,
    senderAvatar: currentUser.profilePicture || generateAvatar(currentUser.username),
    message
  });

  messageInput.value = '';
  messageInput.focus();
}

// Append Message to UI
function appendMessage(msg, isOwn = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isOwn || msg.senderId === currentUser.username ? 'own' : ''}`;

  const timestamp = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  messageDiv.innerHTML = `
    ${isOwn || msg.senderId === currentUser.username ? '' : `<div class="message-avatar">${msg.senderName[0].toUpperCase()}</div>`}
    <div class="message-content">
      ${isOwn || msg.senderId === currentUser.username ? '' : `<div class="message-meta"><strong>${msg.senderName}</strong></div>`}
      <div class="message-text">${escapeHtml(msg.message)}</div>
      <div class="message-meta"><small>${timestamp}</small></div>
    </div>
    ${isOwn || msg.senderId === currentUser.username ? `<div class="message-avatar">${msg.senderName[0].toUpperCase()}</div>` : ''}
  `;

  messagesContainer.appendChild(messageDiv);

  // Remove empty state
  const emptyState = messagesContainer.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  // Auto-scroll
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Socket.IO Event Listeners
socket.on('receiveMessage', (data) => {
  if (data.roomName === currentRoom?.name) {
    appendMessage(data, false);
  }
});

socket.on('userJoined', (data) => {
  if (currentRoom) {
    console.log(`👤 ${data.username} joined the room`);
  }
});

socket.on('userLeft', (data) => {
  if (currentRoom) {
    console.log(`👤 ${data.username} left the room`);
  }
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
  alert(error);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Utility Functions
function generateAvatar(username) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && currentRoom) {
    loadMessages();
  }
});
