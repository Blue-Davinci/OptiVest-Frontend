<script>
    import { browser } from "$app/environment";
    import { fade, fly } from 'svelte/transition';
    
    let {data} = $props();
    let userInfo = $derived(data.userInformation);
    let postData = $derived(data?.postData?.post ?? {});
    let channel = $derived(postData?.Channel ?? {});
    let post = $derived(channel?.Item?.[0] ?? {});
    
    function nav_back() {
        if (browser) window.history.back();
    }
    
    // Format date function
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    </script>
    
    <div 
        class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 200 }}
    >
        <!-- Header with user information -->
        <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between">
                    <!-- Back Button -->
                    <button 
                        onclick={nav_back}
                        aria-label="Go back to previous page"
                        class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                        in:fly={{ x: -20, duration: 300 }}
                    >
                        <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span class="sr-only">Go back</span>
                    </button>
    
                    <div class="flex items-center space-x-4">
                        <img 
                            src={userInfo.profile_url} 
                            alt={`${userInfo.first_name} ${userInfo.last_name}'s profile picture`}
                            class="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            in:fade
                        />
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                {userInfo.first_name} {userInfo.last_name}
                            </h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {userInfo.user_role} • {userInfo.country_code}
                            </p>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        {userInfo.currency_code}
                    </div>
                </div>
            </div>
        </header>
    
        <!-- Main content -->
        <main 
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            in:fly={{ y: 20, duration: 300, delay: 200 }}
        >
            <!-- Channel information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300">
                <div class="flex items-start justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {channel.Title}
                        </h1>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {channel.Description}
                        </p>
                        <a 
                            href={channel.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit channel page in new tab"
                            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm inline-flex items-center transition-colors duration-200"
                        >
                            Visit Channel
                            <svg 
                                class="w-4 h-4 ml-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        ID: {postData.id}
                    </div>
                </div>
            </div>
    
            <!-- Post content -->
            <article class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
                {#if post.ImageURL}
                <div class="w-full h-[400px] relative">
                    <img 
                        src={post.ImageURL} 
                        alt={post.Title}
                        class="w-full h-full object-cover"
                        in:fade={{ duration: 300 }}
                    />
                </div>
                {/if}
                
                <div class="p-6">
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {post.Title}
                    </h2>
                    
                    <div class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-6">
                        {@html post.Content}
                    </div>
    
                    <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                        <div class="flex items-center space-x-4">
                            <time datetime={post.PubDate}>Posted: {formatDate(post.PubDate)}</time>
                            <span aria-hidden="true">•</span>
                            <time datetime={postData.updated_at}>Updated: {formatDate(postData.updated_at)}</time>
                        </div>
                        
                        <div class="flex space-x-4">
                            <a 
                                href={post.Link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View original post in new tab"
                                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center transition-colors duration-200"
                            >
                                Original Post
                                <svg 
                                    class="w-4 h-4 ml-1" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        </main>
    </div>