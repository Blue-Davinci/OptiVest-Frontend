
// Load notification count from localStorage
function loadNotificationCount() {
	const count = localStorage.getItem('notificationCount');
	return count ? parseInt(count, 10) : 0;
}

// Save notification count to localStorage
function saveNotificationCount(count) {
	localStorage.setItem('notificationCount', count.toString());
}

export{
    loadNotificationCount,
    saveNotificationCount
}