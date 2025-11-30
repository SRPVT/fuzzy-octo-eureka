// Check bot status on page load
document.addEventListener('DOMContentLoaded', async () => {
  await updateBotStatus();
  // Check every 30 seconds
  setInterval(updateBotStatus, 30000);
});

async function updateBotStatus() {
  try {
    const response = await fetch('/api/bot-status');
    const data = await response.json();
    
    const statusDiv = document.getElementById('bot-status');
    if (!statusDiv) return;
    
    let statusClass = 'unknown';
    let content = '';

    if (data.status === 'online') {
      statusClass = 'online';
      content = `
        <div class="bot-status-content online">
          <div class="bot-status-indicator">
            <div class="bot-status-dot"></div>
          </div>
          <div class="bot-status-text">
            <i class="fas fa-robot bot-status-icon"></i>
            <span class="bot-status-name">${data.username}</span>
            <span style="font-size: 0.8rem; opacity: 0.7;">Online</span>
          </div>
        </div>
      `;
    } else if (data.status === 'offline') {
      statusClass = 'offline';
      content = `
        <div class="bot-status-content offline">
          <div class="bot-status-indicator">
            <div class="bot-status-dot"></div>
          </div>
          <div class="bot-status-text">
            <i class="fas fa-robot bot-status-icon"></i>
            <span>Bot Offline</span>
          </div>
        </div>
      `;
    } else {
      statusClass = 'unknown';
      content = `
        <div class="bot-status-content unknown">
          <div class="bot-status-indicator">
            <div class="bot-status-dot"></div>
          </div>
          <div class="bot-status-text">
            <i class="fas fa-robot bot-status-icon"></i>
            <span>Status Unknown</span>
          </div>
        </div>
      `;
    }
    
    statusDiv.innerHTML = content;
  } catch (error) {
    console.error('Error checking bot status:', error);
    const statusDiv = document.getElementById('bot-status');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="bot-status-content unknown">
          <div class="bot-status-indicator">
            <div class="bot-status-dot"></div>
          </div>
          <div class="bot-status-text">
            <i class="fas fa-exclamation-circle bot-status-icon"></i>
            <span>Status Error</span>
          </div>
        </div>
      `;
    }
  }
}
