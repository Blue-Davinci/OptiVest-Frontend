<script>
    import {
      MessageCircle,
      X,
      ThumbsUp,
      ThumbsDown,
      Reply,
      Minimize2,
      Send,
      XCircle
    } from 'lucide-svelte';
  
    let isOpen = $state(false);
    let newMessage = $state('');
    let replyingTo = $state(null); // Track which message we're replying to
  
    let messages = $state([
      {
        id: '1',
        user: {
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        },
        content: "Hey everyone! How's it going?",
        timestamp: '2024-03-20T10:00:00',
        likes: 2,
        dislikes: 0,
        replies: []
      },
      {
        id: '2',
        user: {
          name: 'Jane Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
        },
        content: 'Great! Just joined the group.',
        timestamp: '2024-03-20T10:05:00',
        likes: 1,
        dislikes: 0,
        replies: [
          {
            id: '2-1',
            user: {
              name: 'John Doe',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
            },
            content: 'Welcome to the group!',
            timestamp: '2024-03-20T10:06:00',
            likes: 1,
            dislikes: 0,
            replies: [],
            isReply: true
          }
        ]
      }
    ]);
  
    function handleSendMessage() {
      if (!newMessage.trim()) return;
  
      const message = {
        id: Date.now().toString(),
        user: {
          name: 'Current User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current'
        },
        content: newMessage,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: []
      };
  
      if (replyingTo) {
        // Add reply to the parent message
        messages = messages.map(msg => {
          if (msg.id === replyingTo.id) {
            return {
              ...msg,
              replies: [...msg.replies, { ...message, isReply: true }]
            };
          }
          return msg;
        });
        replyingTo = null; // Clear reply state
      } else {
        // Add new top-level message
        messages = [...messages, message];
      }
      
      newMessage = '';
    }
  
    function handleReply(message) {
      replyingTo = message;
      // Focus the input field when replying
      document.querySelector('#messageInput')?.focus();
    }
  
    function cancelReply() {
      replyingTo = null;
      newMessage = '';
    }
  
    function handleLike(messageId) {
      messages = messages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, likes: msg.likes + 1 };
        }
        // Check replies
        if (msg.replies.length > 0) {
          return {
            ...msg,
            replies: msg.replies.map(reply => 
              reply.id === messageId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          };
        }
        return msg;
      });
    }
  
    function handleDislike(messageId) {
      messages = messages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, dislikes: msg.dislikes + 1 };
        }
        // Check replies
        if (msg.replies.length > 0) {
          return {
            ...msg,
            replies: msg.replies.map(reply => 
              reply.id === messageId 
                ? { ...reply, dislikes: reply.dislikes + 1 }
                : reply
            )
          };
        }
        return msg;
      });
    }
  
    function formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  </script>
  
  <div class="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
    {#if !isOpen}
      <button
        onclick={() => isOpen = true}
        class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-purple-700 active:scale-95 sm:h-14 sm:w-14"
      >
        <MessageCircle class="h-6 w-6 sm:h-7 sm:w-7" />
      </button>
    {/if}
  
    {#if isOpen}
      <div class="flex h-[85vh] w-[95vw] flex-col overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-300 dark:bg-gray-800 sm:h-[500px] sm:w-[350px] md:w-[400px]">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center gap-3">
            <MessageCircle class="h-5 w-5 text-purple-600" />
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Group Chat
            </h3>
          </div>
          <div class="flex items-center gap-2">
            <button
              onclick={() => isOpen = false}
              class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Minimize2 class="h-5 w-5 text-gray-500" />
            </button>
            <button
              onclick={() => isOpen = false}
              class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
  
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {#each messages as message (message.id)}
            <div class="mb-6 flex gap-3 last:mb-2">
              <img
                src={message.user.avatar}
                alt={message.user.name}
                class="h-8 w-8 rounded-full ring-2 ring-purple-100 dark:ring-purple-900"
              />
              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {message.user.name}
                  </span>
                  <span class="text-xs text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div class="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-2 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {message.content}
                </div>
                <div class="flex items-center gap-4 px-2">
                  <button
                    onclick={() => handleLike(message.id)}
                    class="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-purple-600"
                  >
                    <ThumbsUp class="h-4 w-4" />
                    <span class="text-xs">{message.likes}</span>
                  </button>
                  <button
                    onclick={() => handleDislike(message.id)}
                    class="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-purple-600"
                  >
                    <ThumbsDown class="h-4 w-4" />
                    <span class="text-xs">{message.dislikes}</span>
                  </button>
                  <button 
                    onclick={() => handleReply(message)}
                    class="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-purple-600"
                  >
                    <Reply class="h-4 w-4" />
                    <span class="text-xs">Reply</span>
                  </button>
                </div>
  
                {#if message.replies.length > 0}
                  {#each message.replies as reply (reply.id)}
                    <div class="ml-6 mt-3 flex gap-3 border-l-2 border-gray-100 pl-3 dark:border-gray-700">
                      <img
                        src={reply.user.avatar}
                        alt={reply.user.name}
                        class="h-6 w-6 rounded-full ring-2 ring-purple-100 dark:ring-purple-900"
                      />
                      <div class="flex-1 space-y-1">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-semibold text-gray-900 dark:text-white">
                            {reply.user.name}
                          </span>
                          <span class="text-xs text-gray-500">
                            {formatTimestamp(reply.timestamp)}
                          </span>
                        </div>
                        <div class="rounded-2xl rounded-tl-none bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                          {reply.content}
                        </div>
                        <div class="flex items-center gap-4 px-2">
                          <button
                            onclick={() => handleLike(reply.id)}
                            class="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-purple-600"
                          >
                            <ThumbsUp class="h-3 w-3" />
                            <span>{reply.likes}</span>
                          </button>
                          <button
                            onclick={() => handleDislike(reply.id)}
                            class="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-purple-600"
                          >
                            <ThumbsDown class="h-3 w-3" />
                            <span>{reply.dislikes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
          {/each}
        </div>
  
        <!-- Input -->
        <div class="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          {#if replyingTo}
            <div class="mb-3 flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/30">
              <div class="flex items-center gap-2">
                <Reply class="h-4 w-4 text-purple-600" />
                <span class="text-sm text-purple-700 dark:text-purple-300">
                  Replying to {replyingTo.user.name}
                </span>
              </div>
              <button
                onclick={cancelReply}
                class="rounded-full p-1 text-gray-500 transition-colors hover:bg-purple-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-purple-800 dark:hover:text-gray-300"
              >
                <XCircle class="h-4 w-4" />
              </button>
            </div>
          {/if}
          <div class="flex items-center gap-2">
            <input
              id="messageInput"
              type="text"
              bind:value={newMessage}
              placeholder={replyingTo ? 'Type your reply...' : 'Type a message...'}
              class="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-colors placeholder:text-gray-500 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              onkeypress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onclick={handleSendMessage}
              disabled={!newMessage.trim()}
              class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-purple-600"
            >
              <Send class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <style>
    /* Custom scrollbar styles */
    .scrollbar-thin {
      scrollbar-width: thin;
    }
    
    .scrollbar-thin::-webkit-scrollbar {
      width: 6px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background-color: #CBD5E1;
      border-radius: 20px;
    }
    
  </style>