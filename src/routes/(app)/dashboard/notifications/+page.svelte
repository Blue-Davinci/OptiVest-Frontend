<script>
    import { onMount, onDestroy } from 'svelte';
    import { WebSocketClient } from '$lib/helpers/websockethelper.js';
    import { Bell, Wifi, WifiOff, Check, Trash2, ExternalLink } from 'lucide-svelte';

    let messages = $state([]);
    let status = $state('disconnected');
    let wsClient;

    onMount(() => {
        wsClient = new WebSocketClient('ws://localhost:4001/ws', 'ZSQVYCUFUEX3FWA3XVBA5CJ7PI');

        wsClient.onMessage((data) => {
            try {
                if (typeof data === 'object' && data !== null) {
                    messages = [...messages, {
                        notification_id: data.notification_id,
                        message: data.message,
                        meta: data.meta || {
                            url: '',
                            image_url: '',
                            tags: ''
                        },
                        read: false,
                        timestamp: new Date().toISOString()
                    }];
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        wsClient.onStatusChange((newStatus) => {
            status = newStatus;
        });

        wsClient.connect();
    });

    onDestroy(() => {
        wsClient?.disconnect();
    });

    function markAsRead(notificationId) {
        wsClient.sendMessage({
            type: 'mark_read',
            notification_id: notificationId
        });
        
        messages = messages.map(msg => 
            msg.notification_id === notificationId 
                ? {...msg, read: true}
                : msg
        );
    }

    function deleteNotification(notificationId) {
        wsClient.sendMessage({
            type: 'delete',
            notification_id: notificationId
        });
        
        messages = messages.filter(msg => msg.notification_id !== notificationId);
    }

    function getStatusColor() {
        switch (status) {
            case 'connected':
                return 'text-green-500';
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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="mx-auto max-w-4xl px-4 py-8">
        <!-- Header -->
        <div class="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="rounded-full bg-purple-50 p-3 dark:bg-purple-900/20 shadow-lg transition-all duration-200">
                    <Bell class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Stay updated with your latest alerts</p>
                </div>
            </div>
            <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md transition-all duration-200">
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
        <div class="space-y-4 mb-6">
            {#if messages.length === 0}
                <div class="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 transition-all duration-200">
                    <Bell class="h-12 w-12 text-purple-300 dark:text-purple-600/40 mb-4" />
                    <p class="text-gray-500 dark:text-gray-400 text-center">
                        No notifications yet.<br>
                        New notifications will appear here.
                    </p>
                </div>
            {:else}
                {#each messages as message}
                    <div class="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-200 hover:shadow-xl {message.read ? 'opacity-90' : ''}"
                         style="transform-origin: center;">
                        <div class="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        
                        <!-- Header -->
                        <div class="relative flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <span class="flex h-2 w-2">
                                    {#if !message.read}
                                        <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-purple-400 opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                    {/if}
                                </span>
                                <span class="font-medium text-gray-900 dark:text-white">
                                    #{message.notification_id}
                                </span>
                                <time class="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(message.timestamp)}
                                </time>
                            </div>
                            
                            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onclick={() => markAsRead(message.notification_id)}
                                    disabled={message.read}
                                    class="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 {message.read ? 'text-purple-500' : 'text-gray-500 dark:text-gray-400'}"
                                    title={message.read ? 'Already read' : 'Mark as read'}>
                                    <Check class="h-5 w-5" />
                                </button>
                                <button
                                    onclick={() => deleteNotification(message.notification_id)}
                                    class="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                                    title="Delete notification">
                                    <Trash2 class="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="relative space-y-4">
                            <p class="text-gray-700 dark:text-gray-200 leading-relaxed">
                                {message.message}
                            </p>

                            {#if message.meta?.url}
                                <a href={message.meta.url}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200">
                                    <ExternalLink class="h-4 w-4" />
                                    <span>View details</span>
                                </a>
                            {/if}

                            {#if message.meta?.image_url}
                                <div class="relative group/image overflow-hidden rounded-lg">
                                    <img src={message.meta.image_url}
                                         alt="Notification "
                                         class="rounded-lg shadow-md max-h-48 object-cover w-full transition-transform duration-200 group-hover/image:scale-105" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-200"></div>
                                </div>
                            {/if}

                            {#if message.meta?.tags}
                                <div class="flex flex-wrap gap-2">
                                    {#each message.meta.tags.split(',') as tag}
                                        <span class="px-3 py-1 text-sm rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 transition-colors duration-200">
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