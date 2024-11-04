<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { TOAST_TYPE_ERROR, TOAST_TYPE_RETRYING } from '$lib/settings/constants.js';
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
    let pingTimeout = null;
    let lastMessageTime = Date.now();
    let visibilityHandler = null;
    
    // Add timestamp and prevent caching
    function getSSEUrl() {
        return `/api/sse?client_id=${generateClientId()}&t=${Date.now()}`;
    }
    
    // Generate a unique client ID for this session
    function generateClientId() {
        return `client_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    function isConnectionValid() {
        return eventSource && 
               eventSource.readyState !== EventSource.CLOSED && 
               eventSource.readyState !== EventSource.CONNECTING &&
               (Date.now() - lastMessageTime) < 30000; // Consider connection stale after 30s
    }
    
    function cleanupConnection() {
        if (pingTimeout) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        }
        
        if (eventSource) {
            try {
                eventSource.onopen = null;
                eventSource.onmessage = null;
                eventSource.onerror = null;
                eventSource.close();
            } catch (error) {
                console.error('Error cleaning up EventSource:', error);
            }
            eventSource = null;
        }
    }
    
    function setupPingCheck() {
        if (pingTimeout) {
            clearTimeout(pingTimeout);
        }
        
        pingTimeout = setTimeout(() => {
            if (!unmounted && !isConnectionValid()) {
                toastManager(
                    TOAST_TYPE_RETRYING,
                    'Connection appears stale. Reconnecting...'
                );
                cleanupConnection();
                connectSSE();
            }
            setupPingCheck();
        }, 30000); // Check every 30 seconds
    }
    
    function connectSSE() {
        if (!browser || unmounted) return;
        
        if (isConnectionValid()) {
            console.log('SSE connection already active. Skipping new connection.');
            return;
        }
    
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
                lastMessageTime = Date.now();
                console.log('Connected to SSE.');
                setupPingCheck();
            };
    
            eventSource.onmessage = (event) => {
                if (unmounted) {
                    cleanupConnection();
                    return;
                }
    
                lastMessageTime = Date.now();
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
        if (!browser || unmounted || retryCount >= maxRetries) {
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
                    toastManager(
                        TOAST_TYPE_RETRYING,
                        `Connection lost. Retrying... (${retryCount}/${maxRetries})`
                    );
                    connectSSE();
                    retryInterval = Math.min(retryInterval * 2, 30000);
                }
                retrying = false;
            }, retryInterval);
        }
    }
    
    // Handle visibility change
    function handleVisibilityChange() {
        if (browser && !document.hidden && !isConnectionValid()) {
            console.log('Page became visible, reconnecting SSE...');
            retryCount = 0; // Reset retry count on visibility change
            connectSSE();
        }
    }
    
    onMount(() => {
        if (!browser) return;
        
        unmounted = false;
        connectSSE();
        
        // Setup visibility change listener
        visibilityHandler = () => handleVisibilityChange();
        document.addEventListener('visibilitychange', visibilityHandler);
        
        // Setup beforeunload handler to cleanup properly
        window.addEventListener('beforeunload', () => {
            cleanupConnection();
        });
    });
    
    onDestroy(() => {
        unmounted = true;
        status = 'disconnected';
        
        if (browser && visibilityHandler) {
            document.removeEventListener('visibilitychange', visibilityHandler);
        }
        
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
        },
        reconnect: () => {
            if (browser) {
                retryCount = 0;
                connectSSE();
            }
        }
    };
    
    setContext('sseMessages', sseContext);
    $inspect(sseContext);
    </script>
    
    <Dashboardsidenav userInfo={data.userInformation} />
    {@render children()}