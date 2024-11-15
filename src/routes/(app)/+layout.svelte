<script>
	import { onMount, onDestroy } from 'svelte';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_RETRYING } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { setContext } from 'svelte';
	import Dashboardsidenav from '$lib/layouts/navs/dashboardsidenav.svelte';

	let { children, data } = $props();
	let status = $state('disconnected');
	let retryInterval = 1000; // Initial retry delay (1 second)
	const maxRetries = 6; // Maximum number of retries
	const initialRetryDelay = 45000; // Initial delay before the first retry (5 seconds)
	let retryCount = 0;
	let retrying = false;
	let messages = $state([]);
	let isMounted = false;
	let eventSource = null;

	function generateConnectionId() {
			return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	function getSSEUrl() {
			const params = new URLSearchParams({
				user : data.userInformation.id,
				connection_id: generateConnectionId(),
				timestamp: Date.now().toString(),
			});
			return `/api/sse?${params.toString()}`;
		}

	function connectSSE() {
		if (eventSource || !isMounted) return; // Prevent redundant connection
		console.log('Connecting to SSE endpoint...');

		eventSource = new EventSource(getSSEUrl());

		eventSource.onopen = () => {
			status = 'connected';
			isMounted = true;
			retryInterval = 1000; // Reset retry interval
			retryCount = 0; // Reset retry count
			console.log('Connected to SSE.');
		};

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				messages = Array.isArray(data) ? [...data, ...messages] : [data, ...messages];
			} catch (error) {
				console.error('Error parsing SSE message:', error);
			}
		};

		eventSource.onerror = (event) => {
			console.error('Error connecting to SSE endpoint:', event);
			if (event && event.type) {
				console.error('Error type:', event.type);
			}
			status = 'error';
			closeConnection();
			let setInitialDelay = retryCount === 0 ? initialRetryDelay : 0;
			// Check if the component is still mounted and attempt retry with delay
			if (isMounted && !retrying) {
				console.log('Scheduling initial retry...');
				retrying = true;
				setTimeout(() => {
					retrying = false;
					retryConnection();
				}, setInitialDelay); // Initial delay before first retry
			}
		};
	}

	function retryConnection() {
		if (retryCount >= maxRetries || !isMounted) {
			toastManager(
				TOAST_TYPE_ERROR,
				'Maximum retry attempts reached. Please check your network connection.'
			);
			status = 'disconnected';
			return;
		}
		console.log(
			'[Retry Connection] Current ismounted and retrying values are: ',
			isMounted,
			retrying
		);
		if (!retrying) {
			retrying = true;
			setTimeout(() => {
				if (isMounted) {
					// Confirm component is still mounted
					status = 'reconnecting';
					retryCount++;
					toastManager(
						TOAST_TYPE_RETRYING,
						`Retrying connection in ${retryInterval / 1000} seconds...`
					);
					retryInterval = Math.min(retryInterval * 2, 30000);
					retrying = false;
					connectSSE(); // Attempt reconnection
				} else {
					console.log('Component unmounted. Stopping retry logic.');
					retrying = false; // Reset if unmounted
				}
			}, retryInterval);
		}
	}

	function closeConnection() {
		console.log('Closing SSE connection.');
		status = 'disconnected';
		if (eventSource) {
			eventSource.close();
			eventSource = null;
			console.log('SSE connection closed.');
		}
	}

	onMount(() => {
		isMounted = true;
		connectSSE();
	});

	onDestroy(() => {
		console.log('Unmounting SSE component in ondestroy...');
		isMounted = false;
		retrying = false; // Prevent any retries on unmount
		console.log('[OnDestroy] isMounted and retrying values are: ', isMounted, retrying);
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
