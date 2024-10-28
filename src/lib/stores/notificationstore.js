import { writable } from 'svelte/store';

export const notificationStore = writable({
    messages: [],
    unreadCount: 0,
    status: 'disconnected'
});