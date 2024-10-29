<script>
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
  
	let features = [
	  {
		title: 'Financial Management & Tracking',
		description: 'Unify your financial world in one place. Effortlessly manage your finances, set budgets and goals, and track expenses, incomes, and investment portfolios with our AI finance advisor.',
		image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFzdGVyJTIwY2FyZHN8ZW58MHx8MHx8fDA%3D',
		alt: 'Visa Card'
	  },
	  {
		title: 'Investment Portfolio',
		description: 'Track and manage your investment portfolio with powerful tools designed to optimize growth and provide insights into market trends.',
		image: 'https://images.unsplash.com/photo-1423666523292-b458da343f6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFjY291bnRpbmd8ZW58MHx8MHx8fDA%3D',
		alt: 'Investment Portfolio'
	  }
	];
  
	let visible = false;
  
	onMount(() => {
	  visible = true;
	});
  </script>
  
  <section class="bg-white py-20 dark:bg-gray-900">
	<div class="container mx-auto px-4 text-center">
	  {#if visible}
		<!-- Badge -->
		<span
		  transition:scale={{duration: 300}}
		  class="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
		>
		  Features
		</span>
  
		<!-- Titles -->
		<h2 
		  transition:fade={{delay: 200}}
		  class="mb-2 text-2xl font-bold text-black dark:text-white"
		>
		  Exploring the Comprehensive
		</h2>
		
		<h3
		  transition:fade={{delay: 400}}
		  class="bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-4xl font-bold text-transparent"
		>
		  Advanced Features
		</h3>
  
		<!-- Description -->
		<p 
		  transition:fade={{delay: 600}}
		  class="mx-auto mt-4 max-w-xl text-base text-gray-600 dark:text-gray-300"
		>
		  Dive into the tools and insights that will revolutionize your financial management, enabling
		  informed decision-making and empowering financial success.
		</p>
  
		<!-- Features Grid -->
		<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
		  {#each features as feature, i}
			<div 
			  transition:fade={{delay: 800 + (i * 200)}}
			  class="rounded-lg bg-white p-6 text-left shadow-lg dark:bg-gray-800"
			>
			  <h4 class="mb-4 text-lg font-semibold text-black dark:text-white">
				{feature.title}
			  </h4>
			  <p class="mb-6 text-sm font-light leading-relaxed text-gray-600 dark:text-gray-400">
				{feature.description}
			  </p>
			  <img
				src={feature.image}
				alt={feature.alt}
				class="h-64 w-full transform rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-105"
			  />
			</div>
		  {/each}
		</div>
  
		<!-- Horizontal Bottom Card -->
		<div
		  transition:fade={{delay: 1200}}
		  class="mt-12 flex flex-col items-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 md:flex-row"
		>
		  <div class="text-left md:w-1/2">
			<h4 class="mb-4 text-lg font-semibold text-black dark:text-white">
			  Streamlining Budgeting
			</h4>
			<p class="mb-6 text-sm font-light leading-relaxed text-gray-600 dark:text-gray-400">
			  Take full control of your budget with streamlined tools that help track spending, savings,
			  and investments in one place. Manage your expenses effortlessly and reach your financial
			  goals faster with personalized insights and forecasting.
			</p>
		  </div>
		  <div class="mt-4 md:mt-0 md:w-1/2">
			<img
			  src="https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?q=80&w=1168&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			  alt="Budgeting Tools"
			  class="h-64 w-full transform rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-105"
			/>
		  </div>
		</div>
	  {/if}
	</div>
  </section>