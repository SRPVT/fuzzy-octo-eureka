// Live Stats with Timed Increments
let statsData = {
  commands: 150,
  servers: 8,
  users: 122,
  uptime: 99,
  lastCommandsUpdate: Date.now(),
  lastServersUpdate: Date.now()
};

document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  // Check every second for timing thresholds
  setInterval(updateStats, 1000);
});

function updateStats() {
  const now = Date.now();
  
  // Commands Executed: Increase by 2 every 60 seconds (60000ms)
  if (now - statsData.lastCommandsUpdate >= 60000) {
    statsData.commands += 2;
    statsData.lastCommandsUpdate = now;
    updateStatCard(0, statsData.commands, 'Commands Executed');
  }
  
  // Active Servers: Increase by 1 every 10 minutes (600000ms)
  if (now - statsData.lastServersUpdate >= 600000) {
    statsData.servers += 1;
    statsData.lastServersUpdate = now;
    updateStatCard(1, statsData.servers, 'Active Servers');
  }
  
  // Active Users: Keep constant at 122
  updateStatCard(2, statsData.users, 'Active Users');
  
  // Uptime: Keep constant at 99%
  updateStatCard(3, statsData.uptime, 'Uptime');
}

function updateStatCard(index, value, label) {
  const cards = document.querySelectorAll('.stat-card');
  if (cards[index]) {
    const numberEl = cards[index].querySelector('.stat-number');
    if (numberEl) {
      const currentValue = parseInt(numberEl.innerText);
      if (currentValue !== value) {
        // Add pulse animation when value changes
        numberEl.style.animation = 'none';
        setTimeout(() => {
          numberEl.style.animation = 'stat-pulse 0.6s ease';
          numberEl.innerText = value;
        }, 10);
      }
    }
  }
}
