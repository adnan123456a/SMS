// Socket.IO Connection
const socket = io();

// State
let currentUser = null;
let currentRoom = null;
let currentRoomId = null;
let allRooms = [];

// DOM Elements
const authSection = document.getElementById('authSection');
const mainSection = document.getElementById('mainSection');
const usernameInput = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadChatRooms();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  joinBtn.addEventListener('click', handleJoin);
  usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleJoin();
  });

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
}

// Handle User Join
function handleJoin() {
  const username = usernameInput.value.trim();

  if (!username || username.length < 2) {
    alert('Username must be at least 2 characters');
    return;
  }

  currentUser = {
    username,
    avatar: generateAvatar(username)
  };

  // Emit user join to socket
  socket.emit('userJoin', currentUser);

  // Show main section
  authSection.style.display = 'none';
  mainSection.style.display = 'flex';
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
        createdBy: currentUser.username // In production, use actual user ID
      })
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
    senderId: currentUser.username,
    senderName: currentUser.username,
    senderAvatar: currentUser.avatar,
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
