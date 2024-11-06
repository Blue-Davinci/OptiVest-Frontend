<script>;
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_RETRYING } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { setContext } from 'svelte';
	import Dashboardsidenav from '$lib/layouts/navs/dashboardsidenav.svelte';

	const ConnectionState = {
		DISCONNECTED: 'disconnected',
		CONNECTING: 'connecting',
		CONNECTED: 'connected',
		RECONNECTING: 'reconnecting',
		ERROR: 'error'
	};

	class ConnectionManager {
		constructor() {
			this.eventSource = null;
			this.retryCount = 0;
			this.maxRetries = 6;
			this.connectionId = this.generateConnectionId();
			this.isCleaningUp = false;
			this.lastActiveTime = Date.now();
			this.cleanupCallbacks = new Set();
			this.isDestroyed = false;
			this.connectionTimeout = null;
			this.hasReachedMaxRetries = false; // New flag to track max retries
		}

		generateConnectionId() {
			return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		}

		// Enhanced cleanup with timeout handling
		cleanupSync() {
			if (this.connectionTimeout) {
				clearTimeout(this.connectionTimeout);
				this.connectionTimeout = null;
			}

			if (this.eventSource) {
				// Remove all event listeners first
				this.eventSource.onopen = null;
				this.eventSource.onmessage = null;
				this.eventSource.onerror = null;
				this.eventSource.close();
				this.eventSource = null;
				console.log('SSE connection closed (cleanupSync).');
			}

			if (this.healthCheckInterval) {
				clearInterval(this.healthCheckInterval);
				this.healthCheckInterval = null;
			}
		}

		async cleanup() {
			if (this.isCleaningUp) return;

			this.isCleaningUp = true;
			try {
				// Execute cleanup callbacks
				for (const callback of this.cleanupCallbacks) {
					await callback();
				}

				this.cleanupSync();
			} finally {
				this.isCleaningUp = false;
			}
		}

		resetConnectionFlags() {
			this.isCleaningUp = false;
			this.eventSource = null;
			this.connectionTimeout = null;
		}

		addCleanupCallback(callback) {
			this.cleanupCallbacks.add(callback);
		}

		removeCleanupCallback(callback) {
			this.cleanupCallbacks.delete(callback);
		}

		incrementRetry() {
			this.retryCount++;
			if (this.retryCount >= this.maxRetries) {
				this.hasReachedMaxRetries = true; // Set flag when max retries reached
			}
			return this.retryCount <= this.maxRetries;
		}

		resetRetry() {
			this.retryCount = 0;
			this.hasReachedMaxRetries = false; // Reset max retries flag
		}

		shouldRetry() {
			return !this.hasReachedMaxRetries && this.retryCount < this.maxRetries;
		}
	}

	function createSSEStore() {
		let _status = $state(ConnectionState.DISCONNECTED);
		let _messages = $state([]);
		let connectionManager = new ConnectionManager();
		let unmounted = false;

		function getSSEUrl() {
			const params = new URLSearchParams({
				connection_id: connectionManager.connectionId,
				timestamp: Date.now().toString(),
				retry_count: connectionManager.retryCount.toString()
			});
			return `/api/sse?${params.toString()}`;
		}

		async function connect() {
			if (
				!browser ||
				unmounted ||
				connectionManager.isCleaningUp ||
				connectionManager.eventSource ||
				connectionManager.isDestroyed ||
				connectionManager.hasReachedMaxRetries // Check max retries flag
			)
				return;

			try {
				await connectionManager.cleanup();
				_status = ConnectionState.CONNECTING;

				connectionManager.eventSource = new EventSource(getSSEUrl());

				// Set connection timeout
				connectionManager.connectionTimeout = setTimeout(() => {
					console.log('Connection timeout reached');
					if (connectionManager.eventSource) {
						connectionManager.cleanupSync();
						handleRetry();
					}
				}, 30000); // 30 second timeout

				connectionManager.eventSource.onopen = () => {
					if (unmounted || connectionManager.isDestroyed) {
						connectionManager.cleanupSync();
						return;
					}
					
					// Clear connection timeout on successful connection
					if (connectionManager.connectionTimeout) {
						clearTimeout(connectionManager.connectionTimeout);
						connectionManager.connectionTimeout = null;
					}
					
					_status = ConnectionState.CONNECTED;
					connectionManager.resetRetry();
				};

				connectionManager.eventSource.onmessage = (event) => {
					if (unmounted || connectionManager.isDestroyed) {
						connectionManager.cleanupSync();
						return;
					}

					try {
						const data = JSON.parse(event.data);
						_messages = Array.isArray(data) ? [...data, ..._messages] : [data, ..._messages];
					} catch (error) {
						console.error('Error parsing SSE message:', error);
					}
				};

				connectionManager.eventSource.onerror = async (error) => {
					console.error('SSE connection error:', error);
					_status = ConnectionState.ERROR;

					if (!unmounted && !connectionManager.isDestroyed) {
						await handleRetry();
					}
				};
			} catch (error) {
				console.error('Failed to create EventSource:', error);
				if (!unmounted && !connectionManager.isDestroyed) {
					await handleRetry();
				}
			}
		}

		async function handleRetry() {
			if (!browser || unmounted || connectionManager.isDestroyed || document.hidden) {
				console.log('Skipping retry attempt due to unmounted or hidden document.');
				return;
			}

			// Clear any existing connection timeout
			if (connectionManager.connectionTimeout) {
				clearTimeout(connectionManager.connectionTimeout);
				connectionManager.connectionTimeout = null;
			}

			if (connectionManager.shouldRetry()) {
				await connectionManager.cleanup(); // Ensure proper cleanup before retry
				connectionManager.resetConnectionFlags();
				_status = ConnectionState.RECONNECTING;
				connectionManager.incrementRetry();

				console.log(
					`Retry attempt ${connectionManager.retryCount}/${connectionManager.maxRetries}`
				);
				toastManager(
					TOAST_TYPE_RETRYING,
					`Reconnecting...${connectionManager.retryCount}/${connectionManager.maxRetries}`
				);

				const delay = Math.min(1000 * Math.pow(1.5, connectionManager.retryCount - 1), 15000);
				await new Promise((resolve) => setTimeout(resolve, delay));

				if (!unmounted && !connectionManager.isDestroyed) {
					console.log('Retrying connection...');
					await connect();
				}
			} else {
				await connectionManager.cleanup(); // Ensure cleanup when max retries reached
				toastManager(TOAST_TYPE_ERROR, 'Connection lost. Please refresh the page.');
				_status = ConnectionState.DISCONNECTED;
			}
		}

		async function handleVisibilityChange() {
			if (!browser || connectionManager.isDestroyed) return;

			if (document.hidden) {
				console.log('Tab hidden, closing connection...');
				await connectionManager.cleanup(); // Use full cleanup for visibility change
				_status = ConnectionState.DISCONNECTED;
			} else if (!connectionManager.eventSource && !connectionManager.isDestroyed && !connectionManager.hasReachedMaxRetries) {
				console.log('Tab visible, establishing new connection...');
				connectionManager.resetRetry();
				await connect();
			}
		}

		const store = {
			get status() {
				return _status;
			},
			get messages() {
				return _messages;
			},
			get count() {
				return _messages.length;
			},
			get budgetCount() {
				return _messages.filter((message) => message.NotificationType === 'budget').length;
			},
			updateMessageStatus: (notificationId, newStatus) => {
				_messages = _messages.map((message) => {
					if (message.notification_id === notificationId) {
						return { ...message, status: newStatus };
					}
					return message;
				});
			},
			deleteNotification: (notificationId) => {
				_messages = _messages.filter((message) => message.notification_id !== notificationId);
			},
			resetNotificationCount: () => {
				_messages = [];
			},
			reconnect: async () => {
				if (browser && !connectionManager.isDestroyed) {
					connectionManager.resetRetry(); // Reset retry count and max retries flag
					await connect();
				}
			},
			cleanup: () => connectionManager.cleanup(),
			initialize: () => {
				if (!browser) return;

				unmounted = false;
				connectionManager.isDestroyed = false;
				connectionManager.hasReachedMaxRetries = false; // Reset on initialize

				// Add event listeners
				const visibilityHandler = () => handleVisibilityChange();
				document.addEventListener('visibilitychange', visibilityHandler);

				// Use cleanup for unload events
				const handleImmediateUnload = () => {
					connectionManager.cleanupSync();
					_status = ConnectionState.DISCONNECTED;
				};
				
				window.addEventListener('beforeunload', handleImmediateUnload);
				window.addEventListener('unload', handleImmediateUnload);

				connect();

				return () => {
					window.removeEventListener('beforeunload', handleImmediateUnload);
					window.removeEventListener('unload', handleImmediateUnload);
					document.removeEventListener('visibilitychange', visibilityHandler);
					handleImmediateUnload();
				};
			},
			destroy: () => {
				unmounted = true;
				connectionManager.isDestroyed = true;
				connectionManager.cleanupSync();
				_status = ConnectionState.DISCONNECTED;
			}
		};

		return store;
	}

	// Component usage
	let { children, data } = $props();
	const sseStore = createSSEStore();

	onMount(() => {
		const cleanup = sseStore.initialize();
		return () => {
			if (cleanup) cleanup();
			sseStore.destroy();
		};
	});

	onDestroy(() => {
		sseStore.destroy();
		console.log('Component destroyed, connections cleaned up.');
	});

	setContext('sseMessages', sseStore);
	$inspect(sseStore);
</script>;

<Dashboardsidenav userInfo={data.userInformation} />;
{@render children()}