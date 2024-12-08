<script>
	import { Wallet, Bell, Fingerprint } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
  
	// Custom action for intersection observer
	function inView(node, params = {}) {
	  const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
		  if (entry.isIntersecting) {
			node.dispatchEvent(new CustomEvent('enter'));
			if (!params.persistent) {
			  observer.unobserve(node);
			}
		  }
		});
	  }, {
		threshold: params.threshold || 0.1,
		rootMargin: params.rootMargin || '0px'
	  });
  
	  observer.observe(node);
  
	  return {
		destroy() {
		  observer.unobserve(node);
		}
	  };
	}
  
	// State for each feature card visibility
	let feature1Visible = false;
	let feature2Visible = false;
	let feature3Visible = false;
  </script>
  
  <section id="features" class="bg-gradient-to-b from-gray-50 to-gray-100 py-24 dark:from-gray-900 dark:to-gray-800">
	<div class="container mx-auto px-4">
	  <!-- Section Title -->
	  <h2 
		class="mb-16 text-center text-4xl font-bold text-gray-800 dark:text-white"
		use:inView
		on:enter={() => feature1Visible = true}
	  >
		{#if feature1Visible}
		  <div in:fly="{{ y: 50, duration: 1000, delay: 0 }}">
			Our Core Features
		  </div>
		{/if}
	  </h2>
  
	  <!-- Features Grid -->
	  <div class="grid grid-cols-1 gap-10 md:grid-cols-3">
		<!-- Feature 1 -->
		<div 
		  class="feature-card group"
		  use:inView
		  on:enter={() => feature1Visible = true}
		>
		  {#if feature1Visible}
			<div in:fly="{{ y: 50, duration: 1000, delay: 200 }}">
			  <div class="feature-gradient"></div>
			  <div class="relative">
				<div class="mb-8 flex items-center justify-center">
				  <div class="feature-icon-wrapper">
					<Wallet class="feature-icon" />
				  </div>
				</div>
				<h3 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
				  AI Financial Management
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
				  Effortlessly manage your finances and optimize portfolios with our advanced AI finance advisor. Get personalized recommendations and insights.
				</p>
			  </div>
			</div>
		  {/if}
		</div>
  
		<!-- Feature 2 -->
		<div 
		  class="feature-card group"
		  use:inView
		  on:enter={() => feature2Visible = true}
		>
		  {#if feature2Visible}
			<div in:fly="{{ y: 50, duration: 1000, delay: 400 }}">
			  <div class="feature-gradient"></div>
			  <div class="relative">
				<div class="mb-8 flex items-center justify-center">
				  <div class="feature-icon-wrapper">
					<Bell class="feature-icon" />
				  </div>
				</div>
				<h3 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
				  Smart Notifications
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
				  Stay informed with intelligent alerts and real-time updates on your financial activities, market changes, and goal progress.
				</p>
			  </div>
			</div>
		  {/if}
		</div>
  
		<!-- Feature 3 -->
		<div 
		  class="feature-card group"
		  use:inView
		  on:enter={() => feature3Visible = true}
		>
		  {#if feature3Visible}
			<div in:fly="{{ y: 50, duration: 1000, delay: 600 }}">
			  <div class="feature-gradient"></div>
			  <div class="relative">
				<div class="mb-8 flex items-center justify-center">
				  <div class="feature-icon-wrapper">
					<Fingerprint class="feature-icon" />
				  </div>
				</div>
				<h3 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
				  Bank-Grade Security
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
				  Rest assured with military-grade encryption, biometric authentication, and advanced security protocols protecting your financial data.
				</p>
			  </div>
			</div>
		  {/if}
		</div>
	  </div>
	</div>
  </section>
  
  <style lang="postcss">
	.feature-card {
	  @apply relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800;
	}
  
	.feature-gradient {
	  @apply absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-900/20;
	}
  
	.feature-icon-wrapper {
	  @apply relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-green-400 transition-transform duration-300 group-hover:scale-110;
	}
  </style>
  