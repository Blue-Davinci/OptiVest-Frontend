<script>
	import { getContext } from 'svelte';
	import { Bell, Wifi, WifiOff, History } from 'lucide-svelte';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { updateNotificationStatus, deleteNotifications } from '$lib/dataservice/notifications/notificationsDataService';
    import NotificationCard from '$lib/layouts/notifications/notificationcard.svelte';
    import NotificationFilters from '$lib/layouts/notifications/notificationfilters.svelte';

    let { data } = $props();
    let activeTab = $state('new');
    let localNotifications = $state([]);
    
    // Get the SSE context
	const sseContext = getContext('sseMessages');
    // Use $derived to create reactive variables from the context
	let messages = $derived(sseContext.messages);
	let status = $derived(sseContext?.status ?? 'disconnected');
    let historicalNotifications = $derived(data?.notificationData?.data?.notifications ?? []);

    // Initialize local notifications when historical notifications change
    $effect(() => {
        localNotifications = [...historicalNotifications];
    });

	async function markAsRead(notificationId) {
		try {
			let response = await updateNotificationStatus(notificationId, 'read');
			if (response.success) {
				toastManager(TOAST_TYPE_SUCCESS, 'Notification marked as read');
				sseContext.updateMessageStatus(notificationId, 'read');
			} else {
				toastManager(TOAST_TYPE_ERROR, 'Error marking notification as read');
			}
		} catch (error) {
			console.error('Error updating notification status:', error);
		}
	}

	async function deleteNotification(notificationId) {
		try {
			let response = await deleteNotifications([notificationId]);
			if (response.success) {
				toastManager(TOAST_TYPE_SUCCESS, 'Notification deleted');
				sseContext.deleteNotification(notificationId);
			} else {
				toastManager(TOAST_TYPE_ERROR, 'Error deleting notification');
			}
		} catch (error) {
			console.error('Error deleting notification:', error);
		}
	}

    async function deleteHistoricalNotification(notificationId) {
        try {
            let response = await deleteNotifications([notificationId]);
            if (response.success) {
                toastManager(TOAST_TYPE_SUCCESS, 'Historical notification deleted');
                // Update the local state instead of the derived state
                localNotifications = localNotifications.filter(n => n.id !== notificationId);
            } else {
                toastManager(TOAST_TYPE_ERROR, 'Error deleting historical notification');
            }
        } catch (error) {
            console.error('Error deleting historical notification:', error);
        }
    }

	function getStatusColor() {
		switch (status) {
			case 'connected':
				return 'text-green-500';
            case 'reconnecting':
                return 'text-yellow-500';
			case 'error':
				return 'text-red-500';
			default:
				return 'text-gray-500';
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 transition-colors duration-200 dark:from-gray-900 dark:to-purple-900/20">
	<div class="mx-auto max-w-5xl px-4 py-8">
		<!-- Header -->
		<div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="flex items-center gap-4">
				<div class="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-lg shadow-purple-500/25 transition-all duration-200 dark:from-purple-600 dark:to-purple-700">
					<Bell class="h-8 w-8 text-white" />
				</div>
				<div>
					<h1 class="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-3xl font-bold text-transparent dark:from-purple-400 dark:to-purple-300">
                        Notifications
                    </h1>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Stay updated with your latest alerts
					</p>
				</div>
			</div>
			<div class="flex items-center gap-3 rounded-xl bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-200 dark:bg-gray-800/90" role="status">
				{#if status === 'connected'}
					<Wifi class={`h-5 w-5 ${getStatusColor()}`} />
				{:else}
					<WifiOff class={`h-5 w-5 ${getStatusColor()}`} />
				{/if}
				<span class="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">
					{status}
				</span>
			</div>
		</div>

        <!-- Tabs -->
        <div class="mb-6 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
                class={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 ${
                    activeTab === 'new'
                        ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onclick={() => activeTab = 'new'}
            >
                <Bell class="h-5 w-5" />
                New Notifications
                {#if messages.length > 0}
                    <span class="flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-100 px-2 text-xs font-semibold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        {messages.length}
                    </span>
                {/if}
            </button>
            <button
                class={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 ${
                    activeTab === 'history'
                        ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onclick={() => activeTab = 'history'}
            >
                <History class="h-5 w-5" />
                History
                {#if localNotifications.length > 0}
                    <span class="flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {localNotifications.length}
                    </span>
                {/if}
            </button>
        </div>

        <!-- Filters (Only shown in history tab) -->
        {#if activeTab === 'history'}
            <NotificationFilters />
        {/if}

		<!-- Messages Container -->
        {#if activeTab === 'new'}
            <div class="mb-6 space-y-4 sm:space-y-5" role="list">
                {#if messages.length === 0}
                    <div class="flex h-64 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-200 dark:bg-gray-800/90">
                        <Bell class="mb-4 h-12 w-12 text-purple-300 dark:text-purple-600/40" />
                        <p class="text-center text-gray-500 dark:text-gray-400">
                            No new notifications.<br />
                            New notifications will appear here.
                        </p>
                    </div>
                {:else}
                    {#each messages as message}
                        <NotificationCard 
                            notification={message}
                            type="new"
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                        />
                    {/each}
                {/if}
            </div>
        {:else}
            <!-- Historical Notifications -->
            <div class="mb-6 space-y-4 sm:space-y-5" role="list">
                {#if localNotifications.length === 0}
                    <div class="flex h-64 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-200 dark:bg-gray-800/90">
                        <History class="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600/40" />
                        <p class="text-center text-gray-500 dark:text-gray-400">
                            No historical notifications found.<br />
                            Past notifications will appear here.
                        </p>
                    </div>
                {:else}
                    {#each localNotifications as notification}
                        <NotificationCard 
                            notification={notification}
                            type="history"
                            onDelete={deleteHistoricalNotification}
                        />
                    {/each}
                {/if}
            </div>
        {/if}
	</div>
</div>