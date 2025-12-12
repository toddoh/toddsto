(function() {
    // Time display
    var timeEl = document.getElementById('current-time');

    function updateTime() {
        var now = new Date();
        var timeStr = now.toLocaleTimeString('en-US', {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        var monthDay = now.toLocaleDateString('en-US', {
            timeZone: 'America/New_York',
            month: 'short',
            day: 'numeric'
        });
        timeEl.textContent = timeStr + ' ' + monthDay + ' in Northeast';
    }

    updateTime();
    setInterval(updateTime, 1000);
})();
