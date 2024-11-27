<script>
    import { fly, slide } from 'svelte/transition';
    
    let menuOpen = $state(false);
    let { isValidUser } = $props();
</script>

<header class="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-colors duration-300">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
        <div class="flex items-center">
            <img
                src="/optivest-high-resolution-logo-black-modified.png"
                alt="Optivest Logo"
                class="mr-2 h-8 w-auto dark:invert"
            />
            <span class="text-xl font-bold text-white dark:text-gray-100">Optivest</span>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="hidden space-x-6 md:flex">
            {#if !isValidUser}
                <a href="/" class="text-white/90 transition duration-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                    Home
                </a>
            {:else}
                <a href="/dashboard" class="text-white/90 transition duration-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                    Dashboard
                </a>
            {/if}
            <a href="/about" class="text-white/90 transition duration-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                About Us
            </a>
            <a href="#services" class="text-white/90 transition duration-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                Services
            </a>
            <a href="#contact" class="text-white/90 transition duration-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                Contact Us
            </a>
        </nav>

        <!-- Auth Buttons -->
        <div class="hidden items-center space-x-4 md:flex">
            {#if !isValidUser}
                <a href="/login" class="text-white/90 transition duration-300 hover:text-white dark:text-gray-300 dark:hover:text-white">
                    Log In
                </a>
                <a
                    href="/signup"
                    class="rounded-md bg-white px-4 py-2 font-semibold text-blue-700 transition duration-300 
                           hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700"
                >
                    Sign Up
                </a>
            {:else}
                <form method="POST" action="/logout">
                    <button
                        type="submit"
                        class="rounded-md bg-white px-4 py-2 font-semibold text-blue-700 transition duration-300 
                               hover:bg-blue-50 hover:text-blue-800 dark:bg-gray-800 dark:text-blue-300 
                               dark:hover:bg-gray-700 dark:hover:text-blue-200 shadow-md"
                    >
                        Logout
                    </button>
                </form>
            {/if}
        </div>

        <!-- Mobile Menu Button -->
        <button
            class="md:hidden p-2 rounded-md hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
            onclick={() => menuOpen = !menuOpen}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
        >
            <svg
                class="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                />
            </svg>
        </button>
    </div>

    <!-- Mobile Menu -->
    {#if menuOpen}
        <div
            transition:slide={{ duration: 300 }}
            class="md:hidden"
        >
            <div class="bg-white dark:bg-gray-800 shadow-lg rounded-b-lg mx-4 mb-4">
                {#if !isValidUser}
                    <a href="/" class="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Home
                    </a>
                {:else}
                    <a href="/dashboard" class="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Dashboard
                    </a>
                {/if}
                <a href="/about" class="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    About Us
                </a>
                <a href="#services" class="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Services
                </a>
                <a href="#contact" class="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Contact Us
                </a>
                
                <!-- Mobile Auth Buttons -->
                <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                    {#if !isValidUser}
                        <div class="space-y-3">
                            <a href="/login" class="block w-full text-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                Log In
                            </a>
                            <a href="/signup" class="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                                Sign Up
                            </a>
                        </div>
                    {:else}
                        <form method="POST" action="/logout">
                            <button
                                type="submit"
                                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            >
                                Logout
                            </button>
                        </form>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</header>