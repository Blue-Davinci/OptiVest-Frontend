<script>
    import { Heart, Share2, Calendar, ExternalLink } from 'lucide-svelte';
  
    // Props received from parent
    let { post, onFavorite } = $props();
    let isFavorited = $state(post.is_favorited);
    // Function to format dates
    function formatDate(dateStr) {
      try {
        const date = new Date(dateStr.replace(' EAT', '+0300'));
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(date);
      } catch (error) {
        console.error('Date parsing error:', error);
        return 'Date unavailable';
      }
    }
  
    // Function to truncate text
    function truncateText(text, length) {
      const strippedText = text.replace(/<[^>]*>/g, '');
      return strippedText.length > length 
        ? strippedText.substring(0, length) + '...' 
        : strippedText;
    }
  
    // Share button handler
    function handleShare() {
      const shareUrl = post.rss_feed.Channel.Item[0].Link;
      const shareData = {
        title: post.rss_feed.Channel.Item[0].Title,
        text: truncateText(post.rss_feed.Channel.Item[0].Content, 100),
        url: shareUrl
      };
  
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    }
  
    // Favorite (heart) button handler
    function handleFavorite() {
      // Toggle the post's favorited state
      isFavorited = !isFavorited;
  
      // Call the onFavorite function with the post ID to handle any backend update
      onFavorite?.(post.rss_feed.id);
    }
  </script>
  
  <article class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div class="relative h-56 w-full overflow-hidden">
      <img
        src={post.rss_feed.Channel.Item[0].ImageURL}
        alt={post.rss_feed.Channel.Item[0].Title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
  
      <div class="absolute top-4 right-4 flex gap-2">
        <button
          onclick={handleShare}
          class="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 transform hover:scale-110"
        >
          <div class="w-5 h-5 text-gray-700 dark:text-gray-300">
            <Share2 />
          </div>
        </button>
        <button
          onclick={handleFavorite}
          class="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 transform hover:scale-110"
        >
          <Heart 
            class="w-5 h-5"
            color={post.is_favorited ? '#ef4444' : '#374151'}
            fill={post.is_favorited ? '#ef4444' : 'none'}
          />
        </button>
      </div>
    </div>
  
    <div class="p-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
          {post.rss_feed.Channel.Title}
        </span>
      </div>
      
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
        <a href={'/dashboard/feeds/' + post.rss_feed.id}>
          {post.rss_feed.Channel.Item[0].Title}
        </a>
      </h2>
      
      <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {truncateText(post.rss_feed.Channel.Item[0].Content, 150)}
      </p>
  
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center text-gray-500 dark:text-gray-400">
          <div class="w-4 h-4 mr-2">
            <Calendar />
          </div>
          <span class="text-sm">
            {formatDate(post.rss_feed.Channel.Item[0].PubDate)}
          </span>
        </div>
        
        <a
          href={'/dashboard/feeds/' + post.rss_feed.id}
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
        >
          Read More
          <div class="w-4 h-4">
            <ExternalLink />
          </div>
        </a>
      </div>
    </div>
  </article>
  