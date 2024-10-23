<script>
	import { Lightbulb, Asterisk } from 'lucide-svelte';

    let { 
        headerTitle = 'Budget Management',
        headerSubtitle = 'Effective budgeting is key to gaining control over your finances and planning for future goals.',
        headerSubSectionTitle = 'Why is Budgeting Important?',
        headerSubSectionDescription = 'Budgeting helps you track spending, manage savings, and prepare for both expected and unexpected financial events.',
        headerSubSectionQuote = `"Budgeting isn't about limiting your spending – it's about maximizing your freedom to spend without regret."`
     } = $props();

</script>

<!-- New Section with Logo, Explanation, and Quote -->

	<!-- Optivest Logo and Budget Explanation -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-4">
			<img
				src="/optivest-high-resolution-logo-transparent.png"
				alt="Optivest Logo"
				class="h-10 w-auto"
			/>
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{headerTitle}</h1>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					{headerSubtitle}
				</p>
			</div>
		</div>
		<!-- Icon (Bulb) -->
		<div class="hidden sm:flex items-center text-blue-600 dark:text-blue-400">
			<Asterisk class="h-8 w-8" />
		</div>
	</div>

	<!-- Explanation and Quote Section -->
	<div class="border-t border-gray-200 pt-4 dark:border-gray-700">
		<div class="flex items-center">
			<Lightbulb class="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
			<h2 class="text-lg font-medium text-gray-800 dark:text-gray-200">{headerSubSectionTitle}</h2>
		</div>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
			{headerSubSectionDescription}
		</p>
		<blockquote class="mt-3 text-base italic text-blue-600 dark:text-blue-400">
			{headerSubSectionQuote}
		</blockquote>
	</div>
