<script>
	import { getContext } from 'svelte';
	import { Bell, Wifi, WifiOff, Check, Trash2, ExternalLink } from 'lucide-svelte';

    // Get the SSE context
	const sseContext = getContext('sseMessages');
    // Use $derived to create reactive variables from the context
	let messages = $derived(sseContext.messages);
	let status = $state(sseContext?.status ?? 'disconnected');


	$inspect({ 'New Messages': messages, Status: status });

	function markAsRead(notificationId) {
		console.log('markAsRead', notificationId);
	}

	function deleteNotification(notificationId) {
		console.log('deleteNotification', notificationId);
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
				<div
					class="rounded-full bg-purple-50 p-3 shadow-lg transition-all duration-200 dark:bg-purple-900/20"
				>
					<Bell class="h-6 w-6 text-purple-600 dark:text-purple-400" />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Stay updated with your latest alerts
					</p>
				</div>
			</div>
			<div
				class="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 dark:bg-gray-800/80"
			>
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
		<div class="mb-6 space-y-4">
			{#if messages.length === 0}
				<div
					class="flex h-64 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-200 dark:bg-gray-800/80"
				>
					<Bell class="mb-4 h-12 w-12 text-purple-300 dark:text-purple-600/40" />
					<p class="text-center text-gray-500 dark:text-gray-400">
						No notifications yet.<br />
						New notifications will appear here.
					</p>
				</div>
			{:else}
				{#each messages as message}
					<div
						class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl dark:bg-gray-800/90 {message.read
							? 'opacity-90'
							: ''}"
						style="transform-origin: center;"
					>
						<div
							class="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-purple-900/5 dark:to-transparent"
						></div>

						<!-- Header -->
						<div class="relative mb-4 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="flex h-2 w-2">
									{#if !message.read}
										<span
											class="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-purple-400 opacity-75"
										></span>
										<span class="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
									{/if}
								</span>
								<span class="font-medium text-gray-900 dark:text-white">
									#{message.notification_id}
								</span>
								<time class="text-sm text-gray-500 dark:text-gray-400">
									{formatDate(message.sent_at)}
								</time>
							</div>

							<div
								class="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							>
								<button
									onclick={() => markAsRead(message.notification_id)}
									disabled={message.read}
									class="rounded-full p-2 transition-colors duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 {message.read
										? 'text-purple-500'
										: 'text-gray-500 dark:text-gray-400'}"
									title={message.read ? 'Already read' : 'Mark as read'}
								>
									<Check class="h-5 w-5" />
								</button>
								<button
									onclick={() => deleteNotification(message.notification_id)}
									class="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
									title="Delete notification"
								>
									<Trash2 class="h-5 w-5" />
								</button>
							</div>
						</div>

						<!-- Content -->
						<div class="relative space-y-4">
							<p class="leading-relaxed text-gray-700 dark:text-gray-200">
								{message.message}
							</p>

							{#if message.meta?.url}
								<a
									href={message.meta.url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-2 text-purple-600 transition-colors duration-200 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
								>
									<ExternalLink class="h-4 w-4" />
									<span>View details</span>
								</a>
							{/if}

							{#if message.meta?.image_url}
								<div class="group/image relative overflow-hidden rounded-lg">
									<img
										src={message.meta.image_url}
										alt="Notification "
										class="max-h-48 w-full rounded-lg object-cover shadow-md transition-transform duration-200 group-hover/image:scale-105"
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/image:opacity-100"
									></div>
								</div>
							{/if}

							{#if message.meta?.tags}
								<div class="flex flex-wrap gap-2">
									{#each message.meta.tags.split(',') as tag}
										<span
											class="rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700 transition-colors duration-200 dark:bg-purple-900/30 dark:text-purple-300"
										>
											{tag.trim()}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
