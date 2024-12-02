<script>
    import { onMount } from 'svelte';
    import {FileQuestion} from 'lucide-svelte';
    import { fade, fly, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let { 
        pageName,
        title='Terms of Service',
        link='/sitedocs/privacy'
    } = $props();
    $inspect(pageName,"pageName");
    let  docName= $state("");
    let isLoading = $state(true);
    let showScrollTop = $state(false);

    // Handle scroll to show/hide back to top button
    function handleScroll() {
        showScrollTop = window.scrollY > 300;
    }

    // Scroll to top function
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Fetch the file on component load
    onMount(async () => {
        try {
            const response = await fetch(`/docs/${pageName}.html`);
            docName = await response.text();
        } catch (error) {
            console.error('Error loading terms of service:', error);
        } finally {
            isLoading = false;
        }

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sticky Header -->
    <header class="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm"
    in:fly={{ x: 200, duration: 1000 }} out:slide={{ duration: 300 }}>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Terms of Service
                </h1>
                <a href={link}
                   class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    Privacy Policy →
                </a>
            </div>
        </div>
    </header>

    <main class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        in:fly={{ x: -200, duration: 1000 }} out:slide={{ duration: 300 }}>
            {#if isLoading}
                <div class="animate-pulse space-y-4" transition:fade>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            {:else}
               {#if docName != ""}
                     <article class="bg-white dark:bg-gray-300 rounded-lg shadow-lg p-6 sm:p-8"
                         transition:fade={{ duration: 300 }}>
                    <div class="text-gray-900">
                        {@html docName}
                    </div>
                </article>
                {:else}
                <div class="min-h-[50vh] flex items-center justify-center px-4 py-12">
                    <div class="text-center">
                      <div class="flex justify-center mb-6">
                        <FileQuestion 
                          class="w-24 h-24 text-gray-400 dark:text-gray-500" 
                          strokeWidth={1.5}
                        />
                      </div>
                      <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
                        Documentation Not Found
                      </h2>
                      <p class="text-base leading-7 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Sorry, we couldn't find the documentation page you're looking for. Please check the URL or navigate back to the documentation home.
                      </p>
                      <div class="mt-8">
                        <a 
                          href="/" 
                          class="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
                        >
                          Back Home
                        </a>
                      </div>
                    </div>
                  </div>
                {/if}
            {/if}
        </div>

        <!-- Back to Top Button -->
        {#if showScrollTop}
            <button onclick={scrollToTop}
                    class="fixed bottom-8 right-8 bg-blue-600 dark:bg-blue-500 
                           text-white p-3 rounded-full shadow-lg hover:bg-blue-700 
                           dark:hover:bg-blue-600 transition-colors"
                    aria-label="Scroll to top"
                    transition:fade={{ duration: 200 }}>
                <svg class="w-6 h-6" fill="none" stroke-linecap="round" 
                     stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" 
                     stroke="currentColor">
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
            </button>
        {/if}
    </main>
</div>