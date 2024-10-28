<script>
    import { Search, Bell, Menu, Bookmark } from 'lucide-svelte';
    import FeedCard from '$lib/layouts/feeds/feedcard.svelte';
    import UserMenu from '$lib/layouts/feeds/usermenu.svelte';
    
    let { data } = $props();
    let feedPosts = $derived(data?.feedData?.data?.posts ?? []);
    //feedPosts[1].is_favorited = true;
    let userInfo = data?.userInformation;
    let searchQuery = $state('');
    let selectedFilter = $state('all');
    let showUserMenu = $state(false);
    
    function getFilteredPosts() {
      return feedPosts.filter(post => {
        const matchesSearch = post.rss_feed.Channel.Item[0].Title.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          post.rss_feed.Channel.Item[0].Content.toLowerCase()
          .includes(searchQuery.toLowerCase());
        
        if (selectedFilter === 'all') return matchesSearch;
        if (selectedFilter === 'favorited') return matchesSearch && post.is_favorited;
        return matchesSearch;
      });
    }

    function handleFavorite(postId) {
    data = {
      ...data,
      feedData: {
        ...data.feedData,
        data: {
          ...data.feedData.data,
          posts: data.feedData.data.posts.map(post => 
            post.rss_feed.id === postId
              ? { ...post, is_favorited: !post.is_favorited }
              : post
          )
        }
      }
    };
  }

    function handleToggleMenu() {
      showUserMenu = !showUserMenu;
    }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
  <div class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center gap-4">
          <UserMenu 
            {userInfo} 
            showMenu={showUserMenu} 
            onToggleMenu={handleToggleMenu}
          />
        </div>
        
        <div class="flex items-center gap-3">
          <button 
            class="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <div class="w-6 h-6">
              <Bell />
            </div>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors md:hidden"
            aria-label="Menu"
          >
            <div class="w-6 h-6">
              <Menu />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        Your RSS Feed
        <span class="text-sm font-normal px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full">
          {getFilteredPosts().length} posts
        </span>
      </h1>
      
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="relative flex-1">
          <div class="relative group">
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search feeds..."
              class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
            <div class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500">
              <Search />
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-4">
          <select
            bind:value={selectedFilter}
            class="px-6 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value="all">All Posts</option>
            <option value="favorited">Favorited</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each getFilteredPosts() as post (post.rss_feed.id)}
        <FeedCard {post} onFavorite={handleFavorite} />
      {/each}
    </div>

    {#if getFilteredPosts().length === 0}
      <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div class="max-w-md mx-auto">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <div class="w-8 h-8 text-gray-400 dark:text-gray-500">
              <Bookmark />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
          <p class="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(::-webkit-scrollbar) {
    width: 8px;
  }

  :global(::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: #cbd5e1;
    border-radius: 4px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: #94a3b8;
  }

  @media (prefers-color-scheme: dark) {
    :global(::-webkit-scrollbar-thumb) {
      background: #475569;
    }

    :global(::-webkit-scrollbar-thumb:hover) {
      background: #64748b;
    }
  }
</style>