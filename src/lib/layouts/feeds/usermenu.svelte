<script>
    import { Settings, LogOut, User } from 'lucide-svelte';
    import { fly } from 'svelte/transition';
    
    let { userInfo, showMenu, onToggleMenu } = $props();
    
    function toggleMenu() {
      onToggleMenu?.();
    }
  </script>
  
  <div class="relative group">
    <button 
      onclick={toggleMenu}
      class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      <img
        src={userInfo.profile_url}
        alt="Profile"
        class="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400 group-hover:ring-blue-600"
      />
      <div class="hidden md:block text-left">
        <h2 class="text-sm font-medium text-gray-600 dark:text-gray-400">Welcome back</h2>
        <p class="text-base font-semibold text-gray-900 dark:text-white">
          {userInfo.first_name} {userInfo.last_name}
        </p>
      </div>
    </button>
  
    {#if showMenu}
      <div 
        class="absolute left-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5"
        transition:fly={{ y: -10, duration: 200 }}
      >
        <div class="py-1">
          <a href="/profile" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="w-4 h-4">
              <User />
            </div>
            Profile
          </a>
          <a href="/settings" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="w-4 h-4">
              <Settings />
            </div>
            Settings
          </a>
          <hr class="my-1 border-gray-200 dark:border-gray-700" />
          <button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="w-4 h-4">
              <LogOut />
            </div>
            Sign out
          </button>
        </div>
      </div>
    {/if}
  </div>