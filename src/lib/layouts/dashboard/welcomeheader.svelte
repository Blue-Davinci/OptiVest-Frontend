<script>
  import { Search, Bell  } from 'lucide-svelte';

    let {firstName} = $props();
</script>


<header class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hi, {firstName}! Welcome back.</h1>
      <p class="text-gray-600 dark:text-gray-300">Manage your cards and review recent transactions.</p>
    </div>
    <div class="flex items-center space-x-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input type="text" placeholder="Search or type a command" class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
      </div>
      <button class="p-2 rounded-full shadow-md bg-gray-100 dark:bg-gray-800">
        <Bell size={20} class="text-gray-500 dark:text-gray-300" />
      </button>
    </div>
  </header>