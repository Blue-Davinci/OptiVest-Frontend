<script>
	import {
		getGroupComments,
		addGroupComment
	} from '$lib/dataservice/coments/commentsDataService.js';
	import {
		addCommentReaction,
		deleteCommentReaction
	} from '$lib/dataservice/coments/commentReactionDataService.js';
	import {
		MessageCircle,
		X,
		ThumbsUp,
		Reply,
		Minimize2,
    Maximize2,
		Send,
		XCircle,
		Shield,
		ShieldCheck,
		User
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { groupID, userInformation, currentUser } = $props();
	let isOpen = $state(false);
	let newMessage = $state('');
	let replyingTo = $state(null);
	let groupMessages = $state({});
	let messagesContainer = $state(); // Reference to the messages container
  let isMaximized = $state(false); 

	$inspect(userInformation, currentUser());

	// Function to scroll to bottom
  function scrollToBottom() {
    if (messagesContainer) {
        // Wait for next tick to ensure content is rendered
        setTimeout(() => {
            try {
                messagesContainer.scrollTo({
                    top: messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });
            } catch (error) {
                // Fallback for older browsers
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 50); // Reduced timeout for better responsiveness
    }
}

//handle scroll on new message
function handleNewMessage() {
    // Get current scroll position
    const isAtBottom = 
        messagesContainer.scrollHeight - messagesContainer.scrollTop 
        <= messagesContainer.clientHeight + 100; // 100px threshold

    // Only auto-scroll if user is already near bottom
    if (isAtBottom) {
        scrollToBottom();
    }
}

	function getRoleIcon(role) {
		switch (role.toLowerCase()) {
			case 'admin':
				return ShieldCheck;
			case 'moderator':
				return Shield;
			default:
				return User;
		}
	}

	function getRoleColor(role) {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'text-red-500 dark:text-red-400';
			case 'moderator':
				return 'text-blue-500 dark:text-blue-400';
			default:
				return 'text-gray-500 dark:text-gray-400';
		}
	}

  async function sendMessage(message, groupID, parentID = 0) {
		// if it is a reply, then we include the parentID
		// otherwise, we do not include the parentID 
		console.log('Message: ', message);
		let responseData;
		if (parentID !== 0) {
			// if it is a reply, then we include the parentID
			responseData = await addGroupComment(message, 'group', groupID, parentID);
		} else {
			responseData = await addGroupComment(message, 'group', groupID);
		}
		if (responseData.success) {
			console.log('Successs Comment: ', responseData);
			return {
        success: true,
        data: responseData.data
      };
		} else {
			console.log('Comment Error: ', responseData);
			return false, responseData.error;
		}
	}

  async function handleSendMessage() {
    if (!newMessage.trim()) return;

    const message = {
        id: Date.now(),
        content: newMessage,
        parent_id: replyingTo ? replyingTo.comment.id : 0,
        created_at: new Date().toISOString()
    };

    if (replyingTo) {
        const parentId = replyingTo.comment.parent_id || replyingTo.comment.id;
        let result = await sendMessage(message.content, groupID, parentId);
        if (result.success) {
            message.id = result.data.comment.id;
            if (groupMessages.comments[parentId]) {
                groupMessages.comments[parentId].replies = [
                    ...groupMessages.comments[parentId].replies,
                    {
                        user_name: `${userInformation.first_name} ${userInformation.last_name}`,
                        user_avatar: userInformation.profile_url,
                        user_role: currentUser(),
                        has_user_liked: false,
                        reaction_count: 0,
                        comment: message
                    }
                ];
                handleNewMessage();
            }
        }
        replyingTo = null;
    } else {
        let result = await sendMessage(message.content, groupID);
        if (result) {
            message.id = result.data.comment.id;
            groupMessages.comments[message.id] = {
                parent: {
                    user_name: `${userInformation.first_name} ${userInformation.last_name}`,
                    user_avatar: userInformation.profile_url,
                    user_role: currentUser(),
                    has_user_liked: false,
                    reaction_count: 0,
                    comment: message
                },
                replies: []
            };
            handleNewMessage();
        }
    }
    newMessage = '';
}

	function handleReply(message) {
		replyingTo = message;
		document.querySelector('#messageInput')?.focus();
	}

	function cancelReply() {
		replyingTo = null;
		newMessage = '';
	}

	function handleLike(message, has_user_liked) {
		console.log('Message: ', has_user_liked);
		const isParent = !message.parent_id;
		if (!has_user_liked) {
			addCommentReaction(message.id);
		} else {
			deleteCommentReaction(message.id);
		}
		if (isParent) {
			groupMessages.comments[message.id].parent.has_user_liked =
				!groupMessages.comments[message.id].parent.has_user_liked;
			groupMessages.comments[message.id].parent.reaction_count += groupMessages.comments[message.id]
				.parent.has_user_liked
				? 1
				: -1;
		} else {
			const parentMessage = groupMessages.comments[message.parent_id];
			const reply = parentMessage.replies.find((r) => r.comment.id === message.id);
			if (reply) {
				reply.has_user_liked = !reply.has_user_liked;
				reply.reaction_count += reply.has_user_liked ? 1 : -1;
			}
		}
	}

	function formatTimestamp(timestamp) {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Watch for isOpen changes to scroll to bottom when chat is opened
	$effect(() => {
		if (isOpen) {
			scrollToBottom();
		}
	});

	onMount(async () => {
		let responseData = await getGroupComments({}, groupID);
		if (responseData.success) {
			groupMessages = responseData?.data ?? {};
			scrollToBottom(); // Scroll to bottom on initial load
		}
	});
</script>

<div class="fixed bottom-4 right-4 z-10 sm:bottom-6 sm:right-6">
	{#if !isOpen}
		<button
			onclick={() => (isOpen = true)}
			class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-purple-700 active:scale-95 sm:h-14 sm:w-14"
		>
			<MessageCircle class="h-6 w-6 sm:h-7 sm:w-7" />
		</button>
	{/if}

	{#if isOpen}
  <div
  class={`
      fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col overflow-hidden rounded-lg 
      bg-white shadow-2xl dark:bg-gray-800
      transition-all duration-300 ease-in-out transform
      ${isMaximized 
          ? 'w-[calc(100%-2rem)] h-[calc(100vh-2rem)] max-w-5xl sm:w-[calc(100%-3rem)] sm:h-[calc(100vh-3rem)] md:w-[calc(100%-4rem)] md:h-[calc(100vh-4rem)]' 
          : 'h-[85vh] w-[95vw] sm:h-[500px] sm:w-[350px] md:w-[400px]'
      }
  `}
>
  <!-- Header -->
  <div
      class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 
             shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
      <div class="flex items-center gap-3">
          <MessageCircle class="h-5 w-5 text-purple-600" />
          <h3 class="font-semibold text-gray-900 dark:text-white">Group Chat</h3>
      </div>
      <div class="flex items-center gap-2">
          <button
              onclick={() => (isMaximized = !isMaximized)}
              class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isMaximized ? "Minimize" : "Maximize"}
          >
              {#if isMaximized}
                  <Minimize2 class="h-5 w-5 text-gray-500" />
              {:else}
                  <Maximize2 class="h-5 w-5 text-gray-500" />
              {/if}
          </button>
          <button
              onclick={() => (isOpen = false)}
              class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
              <X class="h-5 w-5 text-gray-500" />
          </button>
      </div>
  </div>

			<!-- Messages -->
			<div
				bind:this={messagesContainer}
				class="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto p-4"
			>
				{#each Object.entries(groupMessages?.comments ?? {}) as [id, messageData] (id)}
					<div class="mb-6 flex gap-3 last:mb-2">
						<div class="relative inline-block h-8 w-8">
							<img
								src={messageData.parent.user_avatar}
								alt={messageData.parent.user_name}
								class="h-full w-full rounded-full ring-2 ring-purple-100 dark:ring-purple-900"
							/>
							{#if messageData.parent.user_role === 'admin'}
								<ShieldCheck
									class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white p-0.5 dark:bg-gray-800 {getRoleColor(
										'admin'
									)}"
								/>
							{:else if messageData.parent.user_role === 'moderator'}
								<Shield
									class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white p-0.5 dark:bg-gray-800 {getRoleColor(
										'moderator'
									)}"
								/>
							{:else}
								<User
									class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white p-0.5 dark:bg-gray-800 {getRoleColor(
										'member'
									)}"
								/>
							{/if}
						</div>
						<div class="flex-1 space-y-1">
							<div class="flex items-center gap-2">
								<span class="font-semibold {getRoleColor(messageData.parent.user_role)}">
									{messageData.parent.user_name}
								</span>
								<span class="text-xs text-gray-500">
									{formatTimestamp(messageData.parent.comment.created_at)}
								</span>
							</div>
							<div
								class="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-2 text-gray-700 transition-colors dark:bg-gray-700 dark:text-gray-300 {messageData
									.parent.has_user_liked
									? 'ring-2 ring-purple-500/50 dark:ring-purple-400/50'
									: ''}"
							>
								{messageData.parent.comment.content}
							</div>
							<div class="flex items-center gap-4 px-2">
								<button
									onclick={() =>
										handleLike(messageData.parent.comment, messageData.parent.has_user_liked)}
									class="flex items-center gap-1 text-sm transition-colors {messageData.parent
										.has_user_liked
										? 'text-purple-600 dark:text-purple-400'
										: 'text-gray-500 hover:text-purple-600 dark:hover:text-purple-400'}"
								>
									<ThumbsUp class="h-4 w-4" />
									<span class="text-xs">{messageData.parent.reaction_count}</span>
								</button>
								<button
									onclick={() => handleReply(messageData.parent)}
									class="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-purple-600 dark:hover:text-purple-400"
								>
									<Reply class="h-4 w-4" />
									<span class="text-xs">Reply</span>
								</button>
							</div>

							{#if messageData.replies.length > 0}
								{#each messageData.replies as reply (reply.comment.id)}
									<div
										class="ml-6 mt-3 flex gap-3 border-l-2 border-gray-100 pl-3 dark:border-gray-700"
									>
										<div class="relative inline-block h-6 w-6">
											<img
												src={reply.user_avatar}
												alt={reply.user_name}
												class="h-full w-full rounded-full ring-2 ring-purple-100 dark:ring-purple-900"
											/>
											{#if reply.user_role === 'admin'}
												<ShieldCheck
													class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white p-0.5 dark:bg-gray-800 {getRoleColor(
														'admin'
													)}"
												/>
											{:else if reply.user_role === 'moderator'}
												<Shield
													class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white p-0.5 dark:bg-gray-800 {getRoleColor(
														'moderator'
													)}"
												/>
											{:else}
												<User
													class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white p-0.5 dark:bg-gray-800 {getRoleColor(
														'member'
													)}"
												/>
											{/if}
										</div>
										<div class="flex-1 space-y-1">
											<div class="flex items-center gap-2">
												<span class="text-sm font-semibold {getRoleColor(reply.user_role)}">
													{reply.user_name}
												</span>
												<span class="text-xs text-gray-500">
													{formatTimestamp(reply.comment.created_at)}
												</span>
											</div>
											<div
												class="rounded-2xl rounded-tl-none bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors dark:bg-gray-700/50 dark:text-gray-300 {reply.has_user_liked
													? 'ring-2 ring-purple-500/50 dark:ring-purple-400/50'
													: ''}"
											>
												{reply.comment.content}
											</div>
											<div class="flex items-center gap-4 px-2">
												<button
													onclick={() => handleLike(reply.comment, reply.has_user_liked)}
													class="flex items-center gap-1 text-xs transition-colors {reply.has_user_liked
														? 'text-purple-600 dark:text-purple-400'
														: 'text-gray-500 hover:text-purple-600 dark:hover:text-purple-400'}"
												>
													<ThumbsUp class="h-3 w-3" />
													<span>{reply.reaction_count}</span>
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
					<div
						class="mb-3 flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/30"
					>
						<div class="flex items-center gap-2">
							<Reply class="h-4 w-4 text-purple-600" />
							<span class="text-sm text-purple-700 dark:text-purple-300">
								Replying to {replyingTo.user_name}
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
		background-color: #cbd5e1;
		border-radius: 20px;
	}

  .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
</style>
