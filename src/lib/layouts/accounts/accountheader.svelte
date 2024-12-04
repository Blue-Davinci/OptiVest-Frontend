<script>
	import {
		User,
		Award,
		TrendingUp,
		Camera,
		MapPin,
		Mail,
		CreditCard,
		Wallet,
		PieChart
	} from 'lucide-svelte';
	import { superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { avatarSchema } from '$lib/settings/schema.js';

	let { data, accountStats, user, accountRating } = $props();

	// Image selection related state
	let selectedFile = null;
	//$inspect(user, accountStats);
	let previewUrl = $state(user.profile_avatar_url);
	let showSuggestions = $state(false);
	let roboHashSuggestions = [1, 2, 3, 4].map(
		(num) => `https://robohash.org/${user.first_name || 'user'}${num}`
	);

	function selectRoboHashImage(url) {
		previewUrl = url;
		showSuggestions = false;
		// Here you would typically make an API call to update the profile image
	}

	function toggleSuggestions() {
		showSuggestions = !showSuggestions;
	}

	const form = superForm(data.avatarForm, {
		validators: zodClient(avatarSchema),
		invalidateAll: false,
		onUpdated({ form }) {
			if (form.message && form.message.success) {
				showSuggestions = false;
			}
		}
	});
	
	const { form: avatarForm, enhance: avatarEnhance, message: avatarMessage, delayed } = form;
	const file = fileProxy(avatarForm, 'image');

	// Watch for file changes and submit automatically
	$effect(() => {
		if ($file && $file.length > 0) {
			// Create preview URL for immediate feedback
			previewUrl = URL.createObjectURL($file[0]);
			// Get the form element and submit
			const formElement = document.querySelector('form');
			if (formElement) {
				formElement.requestSubmit();
			}
		}
	});

	// Handle file selection
	function handleFileSelect() {
		document.getElementById('imageUpload').click();
	}
</script>

<!-- Enhanced Header Section with Financial Overview -->
<header class="bg-gradient-to-r from-purple-600 to-purple-800 pb-32">
	<div class="container mx-auto px-4 py-8">
		<div class="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
			<div class="flex items-center gap-6">
				<div class="group relative">
					<div
						class="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-800"
					>
						<img src={previewUrl} alt="Profile" class="h-full w-full object-cover" />
					</div>
					<div class="absolute -bottom-2 right-0 flex gap-2">
						<button
							type="button"
							class="rounded-full bg-white p-2 text-purple-600 shadow-lg transition-colors hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700"
							onclick={handleFileSelect}
						>
							<Camera size={20} />
						</button>
						<button
							type="button"
							class="rounded-full bg-white p-2 text-purple-600 shadow-lg transition-colors hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700"
							onclick={toggleSuggestions}
						>
							<User size={20} />
						</button>
					</div>
					<form
						method="POST"
						enctype="multipart/form-data"
						use:avatarEnhance
					>
						<input
							type="file"
							id="imageUpload"
							name="image"
							class="hidden"
							accept="image/png, image/jpeg"
							bind:files={$file}
						/>
					</form>

					{#if showSuggestions}
						<div
							class="absolute left-1/2 top-full z-10 mt-4 w-64 -translate-x-1/2 transform rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800"
						>
							<h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
								Suggested Avatars
							</h3>
							<div class="grid grid-cols-2 gap-3">
								{#each roboHashSuggestions as suggestion}
									<button
										class="relative overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-purple-500"
										onclick={() => selectRoboHashImage(suggestion)}
									>
										<img
											src={suggestion}
											alt="Avatar suggestion"
											class="h-24 w-full object-cover"
										/>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
				<div>
					<h1 class="mb-1 text-3xl font-bold text-white">
						{user.first_name}
						{user.last_name}
					</h1>
					<div class="flex items-center gap-2 text-purple-100">
						<Mail size={16} />
						<span>{user.email}</span>
					</div>
					<div class="mt-1 flex items-center gap-2 text-purple-100">
						<MapPin size={16} />
						<span>{user.country_code}</span>
					</div>
				</div>
			</div>
			<!-- Enhanced Account Rating -->
			<div class="rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm">
				<div class="mb-2 flex items-center justify-center gap-3">
					<Award class="text-yellow-300" size={28} />
					<h2 class="text-xl font-semibold text-white">Account Rating</h2>
				</div>
				<p class="text-4xl font-bold text-white">
					{Number(accountRating).toFixed(2)}
				</p>
				<p class="mt-2 text-purple-100">Based on your activity</p>
			</div>
		</div>

		<!-- Financial Quick Stats -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
			<div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
				<div class="mb-2 flex items-center gap-2 text-purple-100">
					<Wallet size={20} />
					<span>Total Income</span>
				</div>
				<p class="text-2xl font-bold text-white">${accountStats.TotalIncomeAmount}</p>
			</div>
			<div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
				<div class="mb-2 flex items-center gap-2 text-purple-100">
					<CreditCard size={20} />
					<span>Total Expenses</span>
				</div>
				<p class="text-2xl font-bold text-white">${accountStats.TotalExpenseAmount}</p>
			</div>
			<div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
				<div class="mb-2 flex items-center gap-2 text-purple-100">
					<PieChart size={20} />
					<span>Active Budgets</span>
				</div>
				<p class="text-2xl font-bold text-white">{accountStats.TotalBudgets}</p>
			</div>
			<div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
				<div class="mb-2 flex items-center gap-2 text-purple-100">
					<TrendingUp size={20} />
					<span>Active Goals</span>
				</div>
				<p class="text-2xl font-bold text-white">{accountStats.TotalGoals}</p>
			</div>
		</div>
	</div>
</header>
