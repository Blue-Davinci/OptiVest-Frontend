<script>
    import { onMount, onDestroy } from 'svelte';
    import { TOAST_TYPE_ERROR, TOAST_TYPE_RETRYING } from '$lib/settings/constants.js';
    import { toastManager } from '$lib/helpers/utilities.js';
    import { setContext } from 'svelte';
    import Dashboardsidenav from '$lib/layouts/navs/dashboardsidenav.svelte';

    let { children, data } = $props();
    let status = $state('disconnected');
    let retryInterval = 1000;
    const maxRetries = 6;
    const initialRetryDelay = 20000;
    let retryCount = 0;
    let retrying = false;
    let messages = $state([]);
    let isMounted = false;
    let eventSource = null;
    let reconnectTimeout = null;

    function getSSEUrl() {
        const params = new URLSearchParams({
            user: data.userInformation.id,
            timestamp: Date.now().toString()
        });
        return `/api/sse?${params.toString()}`;
    }

    function connectSSE() {
        if (eventSource || !isMounted) return;
        
        // Close existing connection if any
        closeConnection();
        
        console.log('Connecting to SSE endpoint...');
        eventSource = new EventSource(getSSEUrl());

        eventSource.onopen = () => {
            status = 'connected';
            isMounted = true;
            retryInterval = 1000;
            retryCount = 0;
            console.log('Connected to SSE.');
        };

        eventSource.onmessage = (event) => {
            if (!isMounted) return;
            
            try {
                const data = JSON.parse(event.data);
                messages = Array.isArray(data) ? [...data, ...messages] : [data, ...messages];
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = (event) => {
            console.error('Error connecting to SSE endpoint:', event);
            status = 'error';
            
            // Clean up existing connection
            closeConnection();

            if (!isMounted) return;

            // Schedule retry with backoff
            if (!retrying && retryCount < maxRetries) {
                retrying = true;
                const delay = retryCount === 0 ? initialRetryDelay : retryInterval;
                
                reconnectTimeout = setTimeout(() => {
                    if (isMounted) {
                        retrying = false;
                        retryConnection();
                    }
                }, delay);
            } else if (retryCount >= maxRetries) {
                toastManager(
                    TOAST_TYPE_ERROR,
                    'Maximum retry attempts reached. Please refresh the page.'
                );
                status = 'disconnected';
            }
        };
    }

    function retryConnection() {
        if (!isMounted || retryCount >= maxRetries) return;
        
        status = 'reconnecting';
        retryCount++;
        toastManager(
            TOAST_TYPE_RETRYING,
            `Retrying connection in ${retryInterval / 1000} seconds...`
        );
        retryInterval = Math.min(retryInterval * 2, 30000);
        connectSSE();
    }

    function closeConnection() {
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }
        
        if (eventSource) {
            eventSource.close();
            eventSource = null;
            status = 'disconnected';
            console.log('SSE connection closed.');
        }
    }

    onMount(() => {
        isMounted = true;
        connectSSE();
    });

    onDestroy(() => {
        console.log('Unmounting SSE component...');
        isMounted = false;
        retrying = false;
        closeConnection();
    });

    let sseContext = {
        get messages() {
            return messages;
        },
        get status() {
            return status;
        },
        get count() {
            return messages.length;
        },
        get budgetCount() {
            return messages.filter((message) => message.NotificationType === 'budget').length;
        },
        updateStatus: (newStatus) => {
            status = newStatus;
        },
        deleteNotification: (notificationId) => {
            messages = messages.filter((message) => message.notification_id !== notificationId);
        }
    };

    setContext('sseMessages', sseContext);
</script>

<Dashboardsidenav userInfo={data.userInformation} />
{@render children()}