<script>
    import { Users } from 'lucide-svelte';
    
    let { title, description, icon = Users } = $props();
    const Icon = icon;
  </script>
  
  <div class="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
    <div class="mx-auto max-w-md">
      <Icon class="mx-auto mb-4 h-16 w-16 text-purple-600 dark:text-purple-400" />
      <h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p class="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  </div>