
<script>
    import { fly, slide } from 'svelte/transition';
    let userName = "John Doe"; // Replace with dynamic user name if available
  </script>
  
  <!-- Main Container -->
  <div class="container mx-auto p-8"
  in:fly={{ y: 200, duration: 400 }}
  out:slide={{ y: -200, duration: 400 }}
  >
    <!-- Header Section -->
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome, {userName}!
      </h1>
      <p class="text-lg text-gray-700 dark:text-gray-300">
        Here you can manage your financial goals and track your progress.
      </p>
    </header>
  
    <!-- Goals Introduction Section -->
    <section class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Your Goals
      </h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Setting financial goals is crucial for achieving financial stability and success. Whether you're saving for a new home, planning for retirement, or just trying to manage your expenses better, having clear goals can help you stay on track.
      </p>
      <p class="text-gray-700 dark:text-gray-300">
        Use this section to create, view, and manage your financial goals. Track your progress and make adjustments as needed to ensure you reach your targets.
      </p>
    </section>
  </div>
  
  <style>
    /* Add any additional styles here */
  </style>