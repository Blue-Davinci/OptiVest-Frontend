<script>
    import * as Dialog from '$lib/components/ui/dialog';
  import { onMount, onDestroy } from 'svelte';
  import { WebSocketClient } from '$lib/helpers/websockethelper.js';
  import { Bell, Wifi, WifiOff, Check, Trash2, ExternalLink } from 'lucide-svelte';
  import { notificationStore } from '$lib/stores/notificationStore.js';

  let messages = $state([]);
  let status = $state('disconnected');
  let unreadCount = $state(0);
  let isDialogOpen = $state(false);
  let isOpen = (false); // Receive isOpen prop from parent
  let {namelabel="Notifications"} =  $props();
  let wsClient;

  onMount(() => {
      wsClient = new WebSocketClient('ws://localhost:4001/ws', 'ZSQVYCUFUEX3FWA3XVBA5CJ7PI');

      wsClient.onMessage((data) => {
          try {
              if (typeof data === 'object' && data !== null) {
                  const newMessage = {
                      notification_id: data.notification_id,
                      message: data.message,
                      meta: data.meta || {
                          url: '',
                          image_url: '',
                          tags: ''
                      },
                      read: false,
                      timestamp: new Date().toISOString()
                  };
                  
                  messages = [...messages, newMessage];
                  unreadCount++;
                  
                  notificationStore.set({
                      messages,
                      unreadCount,
                      status
                  });
              }
          } catch (error) {
              console.error('Error processing message:', error);
          }
      });

      wsClient.onStatusChange((newStatus) => {
          status = newStatus;
          notificationStore.set({
              messages,
              unreadCount,
              status
          });
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
      
      unreadCount = messages.filter(msg => !msg.read).length;
      
      notificationStore.set({
          messages,
          unreadCount,
          status
      });
  }

  function deleteNotification(notificationId) {
      wsClient.sendMessage({
          type: 'delete',
          notification_id: notificationId
      });
      
      messages = messages.filter(msg => msg.notification_id !== notificationId);
      unreadCount = messages.filter(msg => !msg.read).length;
      
      notificationStore.set({
          messages,
          unreadCount,
          status
      });
  }

  function getStatusColor() {
      switch (status) {
          case 'connected':
              return 'text-green-500 dark:text-green-400';
          case 'error':
              return 'text-red-500 dark:text-red-400';
          default:
              return 'text-gray-500 dark:text-gray-400';
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

<!-- Notification Bell Trigger -->
<li>
    <button
        class="flex w-full items-center px-4 py-2 text-[13px] text-gray-600 transition-colors duration-200 hover:rounded-lg hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700"
        onclick={() => isDialogOpen = true}
    >
        <div class="relative">
            <Bell class="h-5 w-5 {isOpen ? 'mr-2' : 'mx-auto'}" />
            {#if unreadCount > 0 && !isOpen}
                <span
                    class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white"
                >
                    {unreadCount}
                </span>
            {/if}
        </div>
        {#if isOpen}
            <span>{namelabel}</span>
            {#if unreadCount > 0}
                <span
                    class="ml-auto rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white"
                >
                    {unreadCount}
                </span>
            {/if}
        {/if}
    </button>
</li>

<!-- Notification Dialog -->
<Dialog.Root bind:open={isDialogOpen}>
  <Dialog.Content class="max-w-4xl max-h-[80vh] overflow-y-auto">
      <Dialog.Header>
          <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                  <div class="rounded-full bg-purple-50 dark:bg-purple-900/20 p-3">
                      <Bell class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                      <Dialog.Title>Notifications</Dialog.Title>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                          Stay updated with your latest alerts
                      </p>
                  </div>
              </div>
              
              <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800">
                  {#if status === 'connected'}
                      <Wifi class={getStatusColor()} />
                  {:else}
                      <WifiOff class={getStatusColor()} />
                  {/if}
                  <span class="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">
                      {status}
                  </span>
              </div>
          </div>
      </Dialog.Header>

      <div class="space-y-4 mt-6">
          {#if messages.length === 0}
              <div class="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                  <Bell class="h-12 w-12 text-purple-300 dark:text-purple-700 mb-4" />
                  <p class="text-gray-500 dark:text-gray-400 text-center">
                      No notifications yet.<br />
                      New notifications will appear here.
                  </p>
              </div>
          {:else}
              {#each messages as message}
                  <div class="group relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 p-6 {message.read ? 'opacity-90' : ''}">
                      <div class="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div class="relative flex items-center justify-between mb-4">
                          <div class="flex items-center gap-3">
                              {#if !message.read}
                                  <span class="flex h-2 w-2">
                                      <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-purple-400 opacity-75"></span>
                                      <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span> 
                                  </span>
                              {/if}
                              <span class="font-medium">#{message.notification_id}</span>
                              <time class="text-sm text-gray-500">
                                  {formatDate(message.timestamp)}
                              </time>
                          </div>
                          
                          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                              <button
                                  onclick={() => markAsRead(message.notification_id)}
                                  disabled={message.read}
                                  class="p-2 rounded-full hover:bg-purple-100 {message.read ? 'text-purple-500' : 'text-gray-500'}"
                              >
                                  <Check class="h-5 w-5" />
                              </button>
                              <button
                                  onclick={() => deleteNotification(message.notification_id)}
                                  class="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500"
                              >
                                  <Trash2 class="h-5 w-5" />
                              </button>
                          </div>
                      </div>

                      <div class="relative space-y-4">
                          <p class="text-gray-700 dark:text-gray-200">
                              {message.message}
                          </p>

                          {#if message.meta?.url}
                              <a
                                  href={message.meta.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                              >
                                  <ExternalLink class="h-4 w-4" />
                                  <span>View details</span>
                              </a>
                          {/if}

                          {#if message.meta?.image_url}
                              <div class="relative overflow-hidden rounded-lg">
                                  <img
                                      src={message.meta.image_url}
                                      alt="Notification"
                                      class="rounded-lg shadow-md max-h-48 object-cover w-full"
                                  />
                              </div>
                          {/if}

                          {#if message.meta?.tags}
                              <div class="flex flex-wrap gap-2">
                                  {#each message.meta.tags.split(',') as tag}
                                      <span class="px-3 py-1 text-sm rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700">
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
  </Dialog.Content>
</Dialog.Root>