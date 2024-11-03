<script>
	import { getContext, setContext } from 'svelte';
	import { Bell, Wifi, WifiOff, Check, Trash2, ExternalLink } from 'lucide-svelte';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import {updateNotificationStatus, deleteNotifications} from '$lib/dataservice/notifications/notificationsDataService';

    // Get the SSE context
	const sseContext = getContext('sseMessages');
    // Use $derived to create reactive variables from the context
	let messages = $derived(sseContext.messages);
	let status = $derived(sseContext?.status ?? 'disconnected');

        // reset the notification count when the page is loaded
        //sseContext.resetNotificationCount();
	//$inspect({ 'New Messages': messages, Status: status });

	async function markAsRead(notificationId) {
		console.log('markAsRead', notificationId);
		try {
			let response = await updateNotificationStatus(notificationId, 'read');
			if (response.success){
				toastManager(TOAST_TYPE_SUCCESS, 'Notification marked as read');
				sseContext.updateMessageStatus(notificationId, 'read');
			}else{
				console.error('Error updating notification status:', response);
				toastManager(TOAST_TYPE_ERROR, 'Error marking notification as read');
			}
		} catch (error) {
			console.error('Error updating notification status:', error);
		}
	}

	async function deleteNotification(notificationId) {
		console.log('deleteNotification', notificationId);
		try {
			let response = await deleteNotifications([notificationId]);
			if (response.success){
				toastManager(TOAST_TYPE_SUCCESS, 'Notification deleted');
				 // Use the deleteNotification method from sseContext
				sseContext.deleteNotification(notificationId);
			}else{
				toastManager(TOAST_TYPE_ERROR, 'Error deleting notification');
			}
		} catch (error) {
			console.error('Error deleting notification:', error);
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

	function formatDate(dateString) {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
			month: 'short',
			day: 'numeric'
		}).format(date);
	}
</script>

<div class="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
	<div class="mx-auto max-w-4xl px-4 py-8">
		<!-- Header -->
		<div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="flex items-center gap-3">
				<div class="rounded-full bg-purple-50 p-3 shadow-lg transition-all duration-200 dark:bg-purple-900/20">
					<Bell class="h-6 w-6 text-purple-600 dark:text-purple-400" />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Stay updated with your latest alerts
					</p>
				</div>
			</div>
			<div class="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 dark:bg-gray-800/80" role="status" aria-label="Connection status">
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

		<!-- Messages Container -->
        <div class="mb-6 space-y-4 sm:space-y-5" role="list" aria-label="Notifications">
            {#if messages.length === 0}
                <div class="flex h-64 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-200 dark:bg-gray-800/80">
                    <Bell class="mb-4 h-12 w-12 text-purple-300 dark:text-purple-600/40" />
                    <p class="text-center text-gray-500 dark:text-gray-400">
                        No notifications yet.<br />
                        New notifications will appear here.
                    </p>
                </div>
            {:else}
                {#each messages as message}
                    <div 
                        class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/90 
                        {message.status === 'read' ? 'bg-gray-50 dark:bg-gray-800/70' : ''}"
                        style="transform-origin: center;"
                        role="listitem"
                    >
                        <div 
                            class="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 
                            dark:from-purple-900/5 dark:to-transparent 
                            {message.status === 'read' ? 'from-gray-100/50 dark:from-gray-800/30' : ''}"
                        ></div>

                        <!-- Header -->
                        <div class="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex flex-wrap items-center gap-3">
                                <div class="flex items-center gap-2">
                                    {#if message.status !== 'read'}
                                        <span class="flex h-2 w-2">
                                            <span class="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-purple-400 opacity-75"></span>
                                            <span class="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                                        </span>
                                    {:else}
                                        <span class="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
                                            <Check class="h-4 w-4" />
                                            <span class="text-xs font-medium">Read</span>
                                        </span>
                                    {/if}
                                    <span class="font-medium {message.status === 'read' ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}">
                                        #{message.notification_id}
                                    </span>
                                </div>
                                <time class="text-sm {message.status === 'read' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}">
                                    {formatDate(message.sent_at)}
                                </time>
                            </div>

                            <div class="flex items-center gap-2 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100">
                                {#if message.status !== 'read'}
                                    <button 
                                        onclick={() => markAsRead(message.notification_id)}
                                        class="rounded-full p-2 text-gray-500 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md dark:text-gray-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                                        title="Mark as read"
                                        aria-label="Mark notification as read"
                                    >
                                        <Check class="h-5 w-5" />
                                    </button>
                                {/if}
                                <button 
                                    onclick={() => deleteNotification(message.notification_id)}
                                    class="rounded-full p-2 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:shadow-md dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                    title="Delete notification"
                                    aria-label="Delete notification"
                                >
                                    <Trash2 class="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="relative space-y-4">
                            <p class="leading-relaxed {message.status === 'read' ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'}">
                                {message.message}
                            </p>

                            {#if message.meta?.url}
                                <a 
                                    href={message.meta.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 text-purple-600 transition-all duration-200 hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
                                    aria-label="View details in new tab"
                                >
                                    <ExternalLink class="h-4 w-4" />
                                    <span>View details</span>
                                </a>
                            {/if}

                            {#if message.meta?.image_url}
                                <div class="group/image relative overflow-hidden rounded-lg">
                                    <img 
                                        src={message.meta.image_url}
                                        alt="Notification attachment"
                                        class="max-h-48 w-full rounded-lg object-cover shadow-md transition-all duration-300 group-hover/image:scale-105"
                                        loading="lazy"
                                    />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/image:opacity-100"></div>
                                </div>
                            {:else}
                                <div class="group/image relative flex h-32 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 dark:bg-gray-800/50 {message.status === 'read' ? 'bg-gray-50 dark:bg-gray-800/30' : ''}">
                                    <div class="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600">
                                        <Image class="h-8 w-8" />
                                        <span class="text-sm">No image available</span>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
	</div>
</div>