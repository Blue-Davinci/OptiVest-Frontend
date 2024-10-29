<script>
  import { Bell, BarChart, PieChart, CheckCircle, AlertCircle, Home } from 'lucide-svelte';
  import InvestmentAnalysisDrawer from '$lib/layouts/dashboard/investmentanalysisdrawer.svelte';

  let { userInfo, notificationCount } = $props();
  let firstName = $state(userInfo.first_name);
  let lastName = $state(userInfo.last_name);
  let currency = $state(userInfo.currency_code);
  let profileCompleted = $state(userInfo.profile_completed);
  let profileUrl = $state(userInfo.profile_url);
  notificationCount = 4;

  // Notification click handler (for routing or action)
  const handleNotificationClick = () => {
    // Add your navigation logic or action here
    alert("Navigating to notifications!");
  };
</script>

<header class="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8 md:space-y-0">
  <!-- Left side: user greeting and details -->
  <div class="flex flex-col md:flex-row items-center space-x-4 space-y-4 md:space-y-0">
    <img src={profileUrl} alt="User profile" class="w-16 h-16 rounded-full object-cover border-2 dark:border-gray-700 border-gray-300" />
    <div class="text-center md:text-left">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hi, {firstName} {lastName}! Welcome back.</h1>
      <p class="text-gray-600 dark:text-gray-300">Manage your cards and review recent transactions.</p>
      
      <!-- Currency display with badge style -->
      <div class="flex justify-center md:justify-start items-center space-x-2 mt-2 text-gray-500 dark:text-gray-400">
        <span class="font-semibold">Currency:</span>
        <span class="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-sm">{currency}</span>
      </div>

      <!-- Profile Status with icons and colors -->
      <div class="flex justify-center md:justify-start items-center space-x-2 mt-1 text-gray-500 dark:text-gray-400">
        <span class="font-semibold">Profile Status:</span>
        {#if profileCompleted === "true"}
          <span class="flex items-center text-green-500">
            <CheckCircle size={16} class="mr-1" /> Completed
          </span>
        {:else}
          <span class="flex items-center text-red-500">
            <AlertCircle size={16} class="mr-1" /> Incomplete
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Right side: action buttons and navigation -->
  <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
    <!-- Action buttons -->
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
      <button class="flex items-center p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
        <BarChart class="mr-2" size={20} />
        <span class="font-semibold">Personal Finance Analysis</span>
      </button>

      <InvestmentAnalysisDrawer />
    </div>

    <!-- Navigation icons -->
    <div class="flex items-center space-x-4">
      <!-- Home Link -->
      <a 
        href="/" 
        class="p-2 rounded-full shadow-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
        aria-label="Return to homepage"
      >
        <Home size={24} class="text-gray-500 dark:text-gray-300" />
      </a>

      <!-- Notification bell with dynamic badge -->
      <div class="relative flex justify-center">
        <button 
          class="p-2 rounded-full shadow-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out" 
          onclick={handleNotificationClick}
        >
          <Bell size={24} class="text-gray-500 dark:text-gray-300" />
        </button>
        {#if notificationCount > 0}
          <button 
            class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse cursor-pointer"
            onclick={handleNotificationClick}
            aria-label="View notifications"
          >
            {notificationCount}
          </button>
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  /* Add any custom styles if needed */
</style>