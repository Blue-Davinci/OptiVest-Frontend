<script>
    import { Input } from '$lib/components/ui/input';
    import { Search } from 'lucide-svelte';


    let {searchQuery, handleInput} = $props();
    let searchInput = $state("");
    console.log('--Search Query:', searchQuery);
    function handleInput1(event) {
        console.log('Event:', event);
    }

    $inspect({searchQuery, searchInput});
  </script>
  
  <div class="relative mb-4">
    <Input
      bind:this={searchInput}
      oninput={() => handleInput1(searchInput)}
      placeholder="Search feeds..."
      class="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
    />
    <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
  </div>
  