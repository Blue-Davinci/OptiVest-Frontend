<script>
	import { fly, fade } from 'svelte/transition';
	
	// Visibility states for animations
	let titleVisible = false;
	let storiesVisible = [false, false, false];
	
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
	
	// Star rating component to reduce repetition
	const StarRating = () => `
		<div class="flex text-yellow-400">
			${Array(5).fill().map(() => `
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
				</svg>
			`).join('')}
		</div>
	`;
	</script>
	
	<section class="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 py-24 dark:from-gray-900 dark:to-gray-800">
		<div class="absolute inset-0 bg-grid-gray-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-gray-700/50"></div>
		<div class="container relative mx-auto px-4">
			<!-- Animated Title -->
			<div use:inView on:enter={() => titleVisible = true}>
				{#if titleVisible}
					<div class="mb-16 text-center">
						<h2 
							in:fly="{{ y: -30, duration: 800, delay: 0 }}"
							class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent dark:from-gray-100 dark:to-gray-400 md:text-5xl"
						>
							Success Stories from Our Community
						</h2>
						<p 
							in:fly="{{ y: 20, duration: 800, delay: 200 }}"
							class="mt-4 text-gray-600 dark:text-gray-300"
						>
							Discover how Optivest is transforming financial futures
						</p>
					</div>
				{/if}
			</div>
	
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!-- Success Story 1 -->
				<div use:inView on:enter={() => storiesVisible[0] = true}>
					{#if storiesVisible[0]}
						<div
							in:fly="{{ x: -30, y: 30, duration: 1000, delay: 200 }}"
							class="group relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
						>
							<div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 transition-transform group-hover:scale-150"></div>
							<div class="mb-6 flex items-center">
								<img
									src="https://i.pravatar.cc/48?img=1"
									alt="Michael Reed"
									class="mr-4 h-14 w-14 rounded-full border-2 border-blue-100 object-cover shadow-md dark:border-blue-800"
								/>
								<div>
									<h3 class="font-bold text-gray-900 dark:text-white">Michael Reed</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">Investment Analyst</p>
									{@html StarRating()}
								</div>
							</div>
							<p class="relative text-gray-600 dark:text-gray-300">
								"Optivest has completely transformed the way I manage my finances. The intuitive interface
								and powerful analytics have helped me make smarter financial decisions and achieve my
								goals faster than I ever thought possible."
							</p>
						</div>
					{/if}
				</div>
	
				<!-- Success Story 2 -->
				<div use:inView on:enter={() => storiesVisible[1] = true}>
					{#if storiesVisible[1]}
						<div
							in:fly="{{ y: 30, duration: 1000, delay: 400 }}"
							class="group relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
						>
							<div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 transition-transform group-hover:scale-150"></div>
							<div class="mb-6 flex items-center">
								<img
									src="https://i.pravatar.cc/48?img=5"
									alt="Emily Chen"
									class="mr-4 h-14 w-14 rounded-full border-2 border-purple-100 object-cover shadow-md dark:border-purple-800"
								/>
								<div>
									<h3 class="font-bold text-gray-900 dark:text-white">Emily Chen</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">Small Business Owner</p>
									{@html StarRating()}
								</div>
							</div>
							<p class="relative text-gray-600 dark:text-gray-300">
								"The personalized insights I've gained through Optivest are second to none. I can now
								confidently make decisions that align with my financial goals and grow my business sustainably."
							</p>
						</div>
					{/if}
				</div>
	
				<!-- Success Story 3 (New) -->
				<div use:inView on:enter={() => storiesVisible[2] = true}>
					{#if storiesVisible[2]}
						<div
							in:fly="{{ x: 30, y: 30, duration: 1000, delay: 600 }}"
							class="group relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
						>
							<div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 transition-transform group-hover:scale-150"></div>
							<div class="mb-6 flex items-center">
								<img
									src="https://i.pravatar.cc/48?img=12"
									alt="David Martinez"
									class="mr-4 h-14 w-14 rounded-full border-2 border-green-100 object-cover shadow-md dark:border-green-800"
								/>
								<div>
									<h3 class="font-bold text-gray-900 dark:text-white">David Martinez</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">Retirement Planner</p>
									{@html StarRating()}
								</div>
							</div>
							<p class="relative text-gray-600 dark:text-gray-300">
								"As a retirement planner, I've seen many financial tools, but Optivest stands out. 
								Its comprehensive analytics and retirement planning features have become indispensable 
								for both my practice and clients. The ROI forecasting is particularly impressive."
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>
	