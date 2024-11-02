<script>
	import { onMount } from 'svelte';
	import { TOAST_TYPE_ERROR } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { setContext } from 'svelte';
	import Dashboardsidenav from '$lib/layouts/navs/dashboardsidenav.svelte';

	let { children, data } = $props();
    let status = $state('disconnected');
	let retryInterval = 1000; // Initial retry delay (1 second)
	const maxRetries = 6; // Maximum number of retries
	let retryCount = 0; // Current retry count
	let retrying = false; // Flag to prevent overlapping retries
    let messages = $state([]);

	function connectSSE() {
		const eventSource = new EventSource('/api/sse');

		// Connection established
		eventSource.onopen = () => {
			status = 'connected';
			retryInterval = 1000; // Reset retry interval on successful connection
			retryCount = 0; // Reset retry count on successful connection
			console.log('Connected to SSE.');
		};

		// Message received
		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				// Check if `data` is an array and update `messages`
				messages = Array.isArray(data) ? [...data, ...messages] : [data, ...messages];
			} catch (error) {
				console.error('Error parsing SSE message:', error);
			}
		};

		// Error occurred
		eventSource.onerror = () => {
			console.error('Error connecting to SSE endpoint.');
			status = 'error';
			eventSource.close();
			// Only retry if not already retrying
			if (!retrying) retryConnection();
		};
	}

	// Handle retry logic with exponential backoff
	function retryConnection() {
		if (retryCount >= maxRetries) {
			// Max retries reached
			toastManager(TOAST_TYPE_ERROR, 'Maximum retry attempts reached. Please check your network connection.');
			status = 'disconnected';
			return;
		}

		if (!retrying) {
			retrying = true; // Set retrying flag to avoid duplicate attempts
			setTimeout(() => {
				status = 'reconnecting';
				retryCount++;
				console.log(`Retry number ${retryCount}, Retrying connection in ${retryInterval / 1000} seconds...`);
				connectSSE();
				retryInterval = Math.min(retryInterval * 2, 30000); // Max 30 seconds
				retrying = false; // Reset retrying after attempt
			}, retryInterval);
		}
	}

	onMount(() => {
		connectSSE();
		return () => {
			status = 'disconnected';
		};
	});

	let sseContext = {
		get messages() {
			return messages;
		},
		get status() {
			return status;
		},
		updateStatus: (newStatus) => {
			status = newStatus;
		}
	};

	setContext('sseMessages', sseContext);

</script>

<Dashboardsidenav userInfo={data.userInformation} />
{@render children()}
