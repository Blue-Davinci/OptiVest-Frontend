<script>
	import { goto } from '$app/navigation';

    
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">
        This Is The User Dashboard
      </h1>
      <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick={() => goto('/')}>
        Go Back
      </button>
    </div>
  </div>
