
<script>
	import { Button } from '$lib/components/ui/button';
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon } from 'lucide-svelte';
</script>


<Button 
  class="mb-2 p-2 rounded-full shadow-lg transition-all 
         bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
         hover:from-blue-500 hover:via-purple-600 hover:to-pink-600
         focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800
         w-8 h-8 flex items-center justify-center relative" 
  on:click={toggleMode} 
  variant="outline" 
  size="icon"
>
  <!-- Sun Icon -->
  <Sun class="h-4 w-4 text-yellow-400 transition-transform transform 
             dark:text-gray-400 dark:opacity-0 rotate-0 dark:rotate-90" />
  <!-- Moon Icon -->
  <Moon class="absolute h-4 w-4 text-gray-900 dark:text-yellow-400 
               transition-transform transform opacity-0 dark:opacity-100 
               rotate-90 dark:rotate-0" />
  <span class="sr-only">Toggle theme</span>
</Button>


