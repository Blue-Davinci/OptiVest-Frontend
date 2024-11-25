<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { BookOpen, Target } from 'lucide-svelte';

	let features = [
		{
			title: 'Educational Resources',
			description:
				'A collaborative platform for sharing financial knowledge. Connect with others through chats, access interactive tutorials, explore a library of educational content, and customize financial feeds to stay updated on topics that matter most to you.',
			image:
				'https://images.unsplash.com/photo-1511376868136-742c0de8c9a8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			alt: 'Educational Resources',
			icon: BookOpen
		},
		{
			title: 'Custom Feeds & Group Financial Planning',
			description:
				'Enhance your financial journey with personalized feeds tailored to your interests in budgets, investments, and financial trends. Collaborate in groups for shared financial goals, leveraging AI-driven advising to optimize strategies and decision-making.',
			image:
				'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			alt: 'Custom Feeds & Group Planning',
			icon: Target
		}
	];

	let horizontalFeatures = [
		{
			title: 'AI Advisor Insights',
			description:
				'Harness the power of cutting-edge AI to elevate your financial strategy. Gain actionable insights, personalized recommendations, and detailed forecasts tailored to your unique financial goals. Analyze trends, identify opportunities, and make data-driven decisions to maximize growth and minimize risks, all with the support of an intelligent advisor that learns and adapts to your needs.',
			image:
				'https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?q=80&w=1168&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			alt: 'AI Advisor'
		}
	];

	let headerVisible = false;
	let descriptionVisible = false;
	let featureVisibility = features.map(() => false);
	let bottomCardVisible = false;

	function inView(node, params = {}) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.dispatchEvent(new CustomEvent('enter'));
						if (!params.persistent) {
							observer.unobserve(node);
						}
					}
				});
			},
			{
				threshold: params.threshold || 0.2,
				rootMargin: params.rootMargin || '50px'
			}
		);

		observer.observe(node);

		return {
			destroy() {
				observer.unobserve(node);
			}
		};
	}

	function loadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(src);
			img.onerror = reject;
			img.src = src;
		});
	}

	onMount(async () => {
		await Promise.all(
			[...features, ...horizontalFeatures].map((feature) => loadImage(feature.image))
		);
	});
</script>

<section
	id="advanced-features"
	class="relative bg-gradient-to-b from-white to-gray-50 py-24 dark:from-gray-900 dark:to-gray-800"
>
	<div class="container mx-auto px-4 text-center">
		<div class="pointer-events-none absolute inset-0 overflow-hidden">
			<div
				class="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/10"
			></div>
		</div>

		<div use:inView on:enter={() => (headerVisible = true)} class="relative">
			{#if headerVisible}
				<span
					in:fly={{ y: -20, duration: 800, delay: 0 }}
					class="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm transition-all duration-300 hover:shadow-md dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-300"
				>
					Our Advance Features
				</span>

				<h2
					in:fly={{ y: 20, duration: 800, delay: 200 }}
					class="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
				>
					Exploring the Comprehensive
				</h2>

				<h3
					in:fly={{ y: 20, duration: 800, delay: 400 }}
					class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
				>
					Advanced Features
				</h3>
			{/if}
		</div>

		<div use:inView on:enter={() => (descriptionVisible = true)} class="relative">
			{#if descriptionVisible}
				<p
					in:fly={{ y: 30, duration: 800, delay: 200 }}
					class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
				>
					Dive into the tools and insights that will revolutionize your financial management,
					enabling informed decision-making and empowering financial success.
				</p>
			{/if}
		</div>

		<div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each features as feature, i}
				<div use:inView on:enter={() => (featureVisibility[i] = true)} class="group relative">
					{#if featureVisibility[i]}
						<div
							in:fly={{ x: i % 2 === 0 ? -30 : 30, y: 30, duration: 1000, delay: 200 }}
							class="h-full overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl dark:bg-gray-800/50 dark:backdrop-blur-xl"
						>
							<div class="mb-6 flex items-center justify-between">
								<h4 class="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
								<div
									class="rounded-full bg-blue-50 p-2 transition-all duration-300 group-hover:bg-blue-100 dark:bg-gray-700 dark:group-hover:bg-gray-600"
								>
									<svelte:component
										this={feature.icon}
										class="h-6 w-6 text-blue-600 transition-all duration-300 group-hover:scale-110 dark:text-blue-400"
									/>
								</div>
							</div>

							<p class="mb-8 text-base leading-relaxed text-gray-600 dark:text-gray-300">
								{feature.description}
							</p>

							<div class="relative overflow-hidden rounded-xl">
								<img
									src={feature.image}
									alt={feature.alt}
									class="h-72 w-full transform object-cover shadow-md transition-all duration-500 group-hover:scale-105"
									loading="lazy"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"
								></div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div use:inView on:enter={() => (bottomCardVisible = true)} class="relative mt-16">
			{#if bottomCardVisible}
				{#each horizontalFeatures as feature, i}
					<div
						in:fly={{ y: 50, duration: 1000, delay: i * 200 }}
						class="group mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl dark:from-gray-800/50 dark:to-gray-700/50 dark:backdrop-blur-xl"
					>
						<div class="flex flex-col gap-8 md:flex-row md:items-center">
							<div class="flex-1 text-left">
								<h4 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
									{feature.title}
								</h4>
								<p class="text-base leading-relaxed text-gray-600 dark:text-gray-300">
									{feature.description}
								</p>
								<button
									class="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
								>
									Learn More
								</button>
							</div>
							<div class="flex-1">
								<div class="relative overflow-hidden rounded-xl">
									<img
										src={feature.image}
										alt={feature.alt}
										class="h-80 w-full transform object-cover shadow-md transition-all duration-500 group-hover:scale-105"
										loading="lazy"
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"
									></div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	:global(.dark) {
		color-scheme: dark;
	}

	section {
		background-image: radial-gradient(
				circle at 20% 20%,
				rgba(99, 102, 241, 0.05) 0%,
				transparent 25%
			),
			radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 25%);
	}
</style>
