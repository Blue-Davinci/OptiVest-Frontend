<!-- ServicesSection.svelte -->
<script>
    import {
      BarChart3,
      DollarSign,
      LineChart,
      Bell,
      Shield,
      GraduationCap
    } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';
  
    const services = [
      {
        title: 'Smart Investment Management',
        description: 'Gain personalized, AI-driven insights to optimize your portfolio. From automated rebalancing to top-performing asset recommendations, we help you grow your wealth effectively.',
        icon: BarChart3,
        gradient: 'from-blue-500 to-indigo-500'
      },
      {
        title: 'Financial Planning & Budgeting',
        description: 'Set financial goals, manage budgets, and track progress with tools designed to simplify planning for life\'s milestones.',
        icon: DollarSign,
        gradient: 'from-emerald-500 to-teal-500'
      },
      {
        title: 'Financial Tracking & Monitoring',
        description: 'Monitor your income and expenses effortlessly with tools that provide insights into spending habits and ensure better financial control.',
        icon: LineChart,
        gradient: 'from-violet-500 to-purple-500'
      },
      {
        title: 'Real-Time Market Alerts & Custom Feeds',
        description: 'Stay informed with tailored news feeds, live updates, and market alerts personalized to your portfolio and financial interests.',
        icon: Bell,
        gradient: 'from-orange-500 to-red-500'
      },
      {
        title: 'Debt & Risk Management',
        description: 'Take control of your finances with strategies for efficient debt repayment and tools to diversify investments while minimizing risks.',
        icon: Shield,
        gradient: 'from-cyan-500 to-blue-500'
      },
      {
        title: 'Financial Education & Tools',
        description: 'Empower yourself with resources to improve financial literacy and make smarter decisions for a secure future.',
        icon: GraduationCap,
        gradient: 'from-pink-500 to-rose-500'
      }
    ];
  
    let visible = false;
    let cardVisibility = Array(services.length).fill(false);
  
    // Enhanced Intersection Observer action
    function inView(node, options = {}) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            node.dispatchEvent(new CustomEvent('enter'));
            if (!options.persistent) {
              observer.unobserve(node);
            }
          }
        });
      }, {
        threshold: options.threshold || 0.2,
        rootMargin: options.rootMargin || '50px'
      });
  
      observer.observe(node);
  
      return {
        destroy() {
          observer.disconnect();
        }
      };
    }
  </script>
  
  <section id="services" class="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Background Pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute w-[500px] h-[500px] -top-20 -left-20 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute w-[500px] h-[500px] -bottom-20 -right-20 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>
  
    <div class="container mx-auto px-4 relative">
      <!-- Header -->
      <div 
        use:inView
        on:enter={() => visible = true}
        class="text-center mb-20"
      >
        {#if visible}
          <div in:fly="{{ y: -20, duration: 800 }}" class="mb-4">
            <span class="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 inline-block">
              Our Services
            </span>
          </div>
          <h2 
            in:fly="{{ y: 20, duration: 800, delay: 200 }}"
            class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            Comprehensive Financial Solutions
          </h2>
          <p 
            in:fly="{{ y: 20, duration: 800, delay: 400 }}"
            class="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg"
          >
            Empower your financial journey with our suite of advanced tools and services
          </p>
        {/if}
      </div>
  
      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each services as service, index}
          <div
            use:inView
            on:enter={() => cardVisibility[index] = true}
          >
            {#if cardVisibility[index]}
              <div
                in:fly="{{ y: 50, x: (index % 3 - 1) * 20, duration: 800, delay: index * 100 }}"
                class="group h-full bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
              >
                <div class={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${service.gradient} text-white transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <svelte:component 
                    this={service.icon}
                    class="w-6 h-6"
                    strokeWidth={1.5}
                  />
                </div>
                
                <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
  
                <div class="mt-6 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  Learn more
                  <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <style>
    /* Smooth transitions for dark mode */
    :global(.dark) {
      color-scheme: dark;
    }
  
    section {
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 25%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 25%);
    }
  
    section, div {
      transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    }
  </style>