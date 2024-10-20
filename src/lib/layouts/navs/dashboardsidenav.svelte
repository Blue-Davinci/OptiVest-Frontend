<script>
    import { onMount } from 'svelte';
    import Themer from '../common/themer.svelte';
    import { 
      LayoutDashboard, DollarSign, Target, PiggyBank, Wallet, Home,
      Users, UserPlus, Bell, Settings, HelpCircle, Moon, Sun, Newspaper, GraduationCap,
      ChevronsLeft, ChevronsRight
    } from 'lucide-svelte';
    export let userInfo;

    let profile_url = userInfo.profile_url;
    let full_name = `${userInfo.first_name} ${userInfo.last_name}`;
    let userEmail = userInfo.user_role;
    //console.log("Data found: ", userInfo);
    let isOpen = true;
    let activeItem = 'Dashboard';
    let isDarkMode = false;
  
    const navSections = [
      {
        name: 'Main',
        shortLabel: 'Main',
        items: [
          { name: 'Home', icon: Home, url: '/' },
          { name: 'Dashboard', icon: LayoutDashboard, url: '#1' },
        ]
      },
      {
        name: 'Finance Management',
        shortLabel: 'Finance',
        items: [
          { name: 'Budget Manager', icon: DollarSign, url: '#1' },
          { name: 'Goal Manager', icon: Target, url: '#1' },
        ]
      },
      {
        name: 'Finance Tracker',
        shortLabel: 'Trackers',
        items: [
          { name: 'Expense Manager', icon: PiggyBank, url: '#1' },
          { name: 'Debt Manager', icon: Wallet, url: '#1' },
        ]
      },
      {
        name: 'Groups',
        shortLabel: 'Groups',
        items: [
          { name: 'Group Manager', icon: UserPlus, url: '#1' },
          { name: 'Groups', icon: Users, url: '#1' },
        ]
      },
      {
        name: 'News',
        shortLabel: 'News',
        items: [
          { name: 'Finance News', icon: Newspaper, url: '#1' },
          { name: 'Education', icon: GraduationCap, url: '#1' },
        ]
      },
    ];
  
    const bottomItems = [
      { name: 'Notifications', icon: Bell, badge: 4, url: '#1' },
      { name: 'Settings', icon: Settings, url: '#1' },
      { name: 'Support', icon: HelpCircle, url: '#1' },
    ];
  
    function toggleSidebar() {
      isOpen = !isOpen;
    }
  
    function setActiveItem(item) {
      activeItem = item;
    }
  
    function toggleTheme() {
      isDarkMode = !isDarkMode;
    }
  
    onMount(() => {
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      const handleMediaQueryChange = (e) => {
        isOpen = !e.matches;
      };
      mediaQuery.addEventListener('change', handleMediaQueryChange);
      handleMediaQueryChange(mediaQuery);
  
      return () => {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      };
    });
  </script>
  
  <nav class="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out {isOpen ? 'w-64' : 'w-20'} flex flex-col text-gray-700 dark:text-gray-400">
    <div class="flex items-center justify-between p-4 bg-blue-100 dark:bg-gray-800">
      {#if isOpen}
        <div class="flex items-center space-x-2">
          <img src="optivest-cropped.png" alt="OptiVest Logo" class="w-10 h-10 rounded-full">
          <span class="font-bold text-lg text-blue-800 dark:text-blue-300">OptiVest</span>
        </div>
      {:else}
        <img src="optivest-cropped.png" alt="OptiVest Logo" class="w-8 h-8 mx-auto">
      {/if}
      <button on:click={toggleSidebar} class="text-gray-500 hover:text-gray-700 dark:text-gray-300">
        {#if isOpen}
          <ChevronsLeft class="h-5 w-5" />
        {:else}
          <ChevronsRight class="h-5 w-5" />
        {/if}
      </button>
    </div>
  
    <div class="flex-grow overflow-y-auto">
      <div class="mt-2 space-y-1">
        {#each navSections as section}
          <div>
            {#if isOpen}
              <h3 class="px-4 py-1 text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.name}
              </h3>
            {:else}
              <!-- Display short label for collapsed view -->
              <p class="text-center text-gray-500 dark:text-gray-400 text-[10px] uppercase font-semibold tracking-wider mb-2">
                {section.shortLabel}
              </p>
            {/if}
            <ul>
              {#each section.items as item}
                <li>
                  <a href={item.url} class="w-full flex items-center px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:rounded-lg transition-colors duration-200 {activeItem === item.name ? 'bg-blue-200 dark:bg-gray-800 text-blue-600 dark:text-white rounded-lg' : ''}"
                    on:click={() => setActiveItem(item.name)}>
                    <svelte:component this={item.icon} class="w-5 h-5 {isOpen ? 'mr-3' : 'mx-auto'}" />
                    {#if isOpen}
                      <span>{item.name}</span>
                    {/if}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  
    <div class="p-3">
      <ul>
        {#each bottomItems as item}
          <li>
            <a href={item.url} class="w-full flex items-center px-4 py-2 text-[13px] text-gray-600 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:rounded-lg transition-colors duration-200 {activeItem === item.name ? 'bg-blue-200 dark:bg-gray-800 text-blue-600 dark:text-white rounded-lg' : ''}"
              on:click={() => setActiveItem(item.name)}>
              <div class="relative">
                <svelte:component this={item.icon} class="w-5 h-5 {isOpen ? 'mr-2' : 'mx-auto'}" />
                {#if item.badge && !isOpen}
                  <span class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">{item.badge}</span>
                {/if}
              </div>
              {#if isOpen}
                <span>{item.name}</span>
                {#if item.badge}
                  <span class="ml-auto bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                {/if}
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  
    <div class="p-3 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg mx-3 mb-4">
      <div class="flex items-center space-x-3 {isOpen ? '' : 'justify-center'}">
        <img src={profile_url} alt="User Avatar" class="w-10 h-10 rounded-full object-cover">
        {#if isOpen}
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{full_name}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
          </div>
          <Themer />
        {/if}
      </div>
      {#if isOpen}
      <!-- Logout Form -->
      <div class="mt-4">
        <form method="POST" action="/logout">
          <button type="submit" class="w-full flex items-center justify-center px-4 py-2 text-[13px] font-medium text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 hover:rounded-lg transition-colors duration-200">
            Logout
          </button>
        </form>
      </div>
    {/if}
    </div>
  </nav>
  
  
  <style>
    nav {
      z-index: 1000;
      font-family: 'Inter', sans-serif;
    }
  </style>
  