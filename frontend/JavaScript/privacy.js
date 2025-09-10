  // Update current time
  function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('current-time-display').textContent = timeString;
}

updateCurrentTime();
setInterval(updateCurrentTime, 60000);

console.log("Privacy Policy Page Loaded");