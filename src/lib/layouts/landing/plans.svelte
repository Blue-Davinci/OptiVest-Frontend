<script>
	import { fly } from 'svelte/transition';

	// Visibility states
	let headerVisible = false;
	let plansVisible = [false, false, false];

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
</script>

<section id="plans" class="py-20">
	<div class="container mx-auto px-4">
		<!-- Title and Badge -->
		<div 
			class="mb-12 text-center"
			use:inView
			on:enter={() => headerVisible = true}
		>
			{#if headerVisible}
				<div in:fly="{{ y: -30, duration: 800, delay: 0 }}">
					<span class="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
						Plans
					</span>
				</div>

				<div in:fly="{{ y: -20, duration: 800, delay: 200 }}">
					<h2 class="bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-4xl font-bold text-transparent">
						Customize Your Financial Destiny
					</h2>
				</div>

				<div in:fly="{{ y: -10, duration: 800, delay: 400 }}">
					<p class="text-xl">With Transparent Pricing Plans Tailored Just For You</p>
				</div>
			{/if}
		</div>

		<!-- Plans Section -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Free Plan -->
			<div
				use:inView
				on:enter={() => plansVisible[0] = true}
			>
				{#if plansVisible[0]}
					<div
						in:fly="{{ y: 50, duration: 1000, delay: 200 }}"
						class="transform rounded-lg border border-gray-200 p-8 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
					>
						<h3 class="mb-4 text-2xl font-semibold">Free Plan</h3>
						<p class="mb-4 text-4xl font-bold">
							$0
							<span class="text-lg font-normal text-gray-600">/month</span>
						</p>
						<ul class="mb-8">
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Multi-account integration
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Basic budgeting tools
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Monthly financial reports
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								3 months historical data
							</li>
						</ul>
						<a href="#1" class="block w-full rounded-md bg-blue-500 py-2 text-center text-white hover:bg-blue-600">
							Get Started
						</a>
					</div>
				{/if}
			</div>

			<!-- Annual Plan (Now in center) -->
			<div
				use:inView
				on:enter={() => plansVisible[1] = true}
			>
				{#if plansVisible[1]}
					<div
						in:fly="{{ y: 50, duration: 1000, delay: 400 }}"
						class="relative scale-105 transform rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 p-8 text-white shadow-xl transition-transform duration-300 ease-in-out hover:scale-110"
					>
						<div class="absolute -top-4 left-1/2 -translate-x-1/2 transform">
							<span class="inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-blue-900">
								Best Value
							</span>
						</div>
						<h3 class="mb-4 text-2xl font-semibold">Annual Plan</h3>
						<div class="mb-4">
							<p class="text-4xl font-bold">
								$199.99
								<span class="text-lg font-normal">/year</span>
							</p>
							<p class="mt-2 text-sm font-medium text-yellow-300">Save ~16% compared to monthly</p>
							<p class="text-sm text-blue-100">Only $16.67/month, billed annually</p>
						</div>
						<ul class="mb-8">
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Everything in Monthly Plan
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Advanced investment tracking
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Long-term goal planning
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Portfolio diversification
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Premium resources
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Early access features
							</li>
						</ul>
						<a href="#1" class="block w-full rounded-md bg-yellow-400 py-2 text-center text-blue-900 font-semibold hover:bg-yellow-300 transition-colors">
							Get Best Value
						</a>
					</div>
				{/if}
			</div>

			<!-- Monthly Plan (Now on right) -->
			<div
				use:inView
				on:enter={() => plansVisible[2] = true}
			>
				{#if plansVisible[2]}
					<div
						in:fly="{{ y: 50, duration: 1000, delay: 600 }}"
						class="transform rounded-lg border border-gray-200 p-8 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
					>
						<h3 class="mb-4 text-2xl font-semibold">Monthly Plan</h3>
						<p class="mb-4 text-4xl font-bold">
							$19.99
							<span class="text-lg font-normal text-gray-600">/month</span>
						</p>
						<ul class="mb-8">
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Everything in Free Plan
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Advanced analytics
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Personalized financial advice
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Priority support
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Investment insights
							</li>
							<li class="mb-2 flex items-center">
								<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Budget alerts
							</li>
						</ul>
						<a href="#1" class="block w-full rounded-md bg-blue-500 py-2 text-center text-white hover:bg-blue-600">
							Get Started
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>