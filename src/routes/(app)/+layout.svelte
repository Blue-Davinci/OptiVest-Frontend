<script>
import { onMount, onDestroy } from 'svelte';
import { TOAST_TYPE_ERROR } from '$lib/settings/constants.js';
import { toastManager } from '$lib/helpers/utilities.js';
import { setContext } from 'svelte';
import Dashboardsidenav from '$lib/layouts/navs/dashboardsidenav.svelte';

let { children, data } = $props();
let status = $state('disconnected');
let retryInterval = 1000;
let maxRetries = 6;
let retryCount = 0;
let retrying = false;
let messages = $state([]);
let eventSource = null;
let unmounted = false;

// Add timestamp to URL to prevent caching
function getSSEUrl() {
    return `/api/sse?t=${Date.now()}`;
}

function isConnectionValid() {
    return eventSource && 
           eventSource.readyState !== EventSource.CLOSED && 
           eventSource.readyState !== EventSource.CONNECTING;
}

function cleanupConnection() {
    if (eventSource) {
        eventSource.onopen = null;
        eventSource.onmessage = null;
        eventSource.onerror = null;
        eventSource.close();
        eventSource = null;
    }
}

function connectSSE() {
    if (unmounted) return;
    
    if (isConnectionValid()) {
        console.log('SSE connection already active. Skipping new connection.');
        return;
    }

    // Cleanup any existing connection first
    cleanupConnection();

    console.log('Connecting to SSE...');
    try {
        eventSource = new EventSource(getSSEUrl());

        eventSource.onopen = () => {
            if (unmounted) {
                cleanupConnection();
                return;
            }
            
            status = 'connected';
            retryInterval = 1000;
            retryCount = 0;
            console.log('Connected to SSE.');
        };

        eventSource.onmessage = (event) => {
            if (unmounted) {
                cleanupConnection();
                return;
            }

            try {
                const data = JSON.parse(event.data);
                messages = Array.isArray(data) 
                    ? [...data, ...messages] 
                    : [data, ...messages];
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('Error connecting to SSE endpoint:', error);
            status = 'error';
            cleanupConnection();

            if (!unmounted && !retrying) {
                retryConnection();
            }
        };
    } catch (error) {
        console.error('Failed to create EventSource:', error);
        if (!unmounted && !retrying) {
            retryConnection();
        }
    }
}

function retryConnection() {
    if (unmounted || retryCount >= maxRetries) {
        if (!unmounted) {
            toastManager(
                TOAST_TYPE_ERROR,
                'Maximum retry attempts reached. Please check your network connection.'
            );
            status = 'disconnected';
        }
        return;
    }

    if (!retrying) {
        retrying = true;
        setTimeout(() => {
            if (!unmounted) {
                status = 'reconnecting';
                retryCount++;
                console.log(
                    `Retry number ${retryCount}, Retrying connection in ${retryInterval / 1000} seconds...`
                );
                connectSSE();
                retryInterval = Math.min(retryInterval * 2, 30000);
            }
            retrying = false;
        }, retryInterval);
    }
}

onMount(() => {
    unmounted = false;
    connectSSE();
});

onDestroy(() => {
    unmounted = true;
    status = 'disconnected';
    cleanupConnection();
});

const sseContext = {
    get messages() {
        return messages;
    },
    get status() {
        return status;
    },
    get count() {
        return messages.length;
    },
    updateMessageStatus: (notificationId, newStatus) => {
        messages = messages.map((message) => {
            if (message.notification_id === notificationId) {
                return { ...message, status: newStatus };
            }
            return message;
        });
    },
    deleteNotification: (notificationId) => {
        console.log('deleteNotification', notificationId);
        messages = messages.filter(
            (message) => message.notification_id !== notificationId
        );
    },
    resetNotificationCount: () => {
        messages = [];
    }
};

setContext('sseMessages', sseContext);
$inspect(sseContext);
</script>

<Dashboardsidenav userInfo={data.userInformation} />
{@render children()}
