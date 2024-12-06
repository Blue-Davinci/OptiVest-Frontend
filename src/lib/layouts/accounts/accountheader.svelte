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
		RefreshCw,
		PieChart
	} from 'lucide-svelte';
	import { superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { avatarSchema, avatarUrlSchema } from '$lib/settings/schema.js';
	import { generateRobohashUrls } from '$lib/helpers/utilities.js';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';

	let { data, accountStats, user, accountRating } = $props();

	let previewUrl = $state(user.profile_avatar_url);
	let showSuggestions = $state(false);
	let bgSetIndex = 0;
	const bgSets = ['', 'bg1', 'bg2'];
	let roboHashSuggestions = $state(generateRobohashUrls(user.first_name, bgSetIndex, bgSets));

	const cycleBgSets = () => {
		bgSetIndex = (bgSetIndex + 1) % bgSets.length;
		roboHashSuggestions = generateRobohashUrls(user.first_name, bgSetIndex, bgSets);
	};

	async function selectRoboHashImage(url) {
		previewUrl = url;
		showSuggestions = false;
		console.log('Selected URL: ', url);
		
		// Update the form store directly
		$avatarUrlForm.imageUrl = url;
		submitAvatarUrlForm();
	}

	function toggleSuggestions() {
		showSuggestions = !showSuggestions;
	}

	const {
		form: avatarForm,
		enhance: avatarEnhance,
		submit: submitAvatarForm,
		delayed
	} = superForm(data.avatarForm, {
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.message?.success) {
				showSuggestions = false;
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
			} else if (form.message) {
				toastManager(TOAST_TYPE_ERROR, form.message.message);
			}
		}
	});

	const {
		form: avatarUrlForm,
		enhance: avatarUrlEnhance,
		submit: submitAvatarUrlForm,
		delayed: avatarUrlDelayed
	} = superForm(data.avatarUrlForm, {
		invalidateAll: true,
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message?.success) {
				showSuggestions = false;
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
			} else {
				console.log('Update URL form error: ', form);
			}
		}
	});

	const file = fileProxy(avatarForm, 'image');

	$effect(() => {
		if ($file && $file.length > 0) {
			previewUrl = URL.createObjectURL($file[0]);
			submitAvatarForm();
		}
	});
</script>

<header class="bg-gradient-to-r from-purple-600 to-purple-800 pb-32">
	<div class="container mx-auto px-4 py-8">
		<div class="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
			<div class="flex items-center gap-6">
				<div class="group relative">
					<div
						class="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-800"
					>
						<img src={previewUrl} alt="Profile" class="h-full w-full object-cover" />

						{#if $delayed || $avatarUrlDelayed}
							<div
								class="absolute inset-0 flex items-center justify-center rounded-full bg-purple-900/50 backdrop-blur-sm"
							>
								<div class="relative flex items-center justify-center">
									<div
										class="absolute h-12 w-12 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-2 border-purple-200/50"
									></div>
									<div
										class="h-8 w-8 animate-spin rounded-full border-2 border-b-transparent border-l-transparent border-r-transparent border-t-purple-200"
									></div>
								</div>
							</div>
						{/if}
					</div>
					<div class="absolute -bottom-2 right-0 flex gap-2">
						<label
							class="rounded-full bg-white p-2 text-purple-600 shadow-lg transition-colors hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700 cursor-pointer"
							for="fileInput"
						>
							<Camera size={20} />
						</label>
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
						action="?/uploadAvatarFile"
						enctype="multipart/form-data"
						use:avatarEnhance
					>
						<input
							bind:files={$file}
							id="fileInput"
							name="image"
							type="file"
							class="hidden"
							accept="image/png, image/jpeg"
						/>
					</form>
					<form
						method="POST"
						action="?/uploadAvatarURL"
						use:avatarUrlEnhance
					>
						<input type="hidden" name="imageUrl" bind:value={$avatarUrlForm.imageUrl} />
					</form>
					{#if showSuggestions}
						<div
							class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-200"
							onclick={toggleSuggestions}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									toggleSuggestions();
								}
							}}
							tabindex="0"
							aria-label="Close suggestions panel"
							role="button"
						></div>

						<div
							class="fixed left-1/2 top-1/2 z-50 mx-auto w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-white p-4 shadow-xl transition-all duration-200 ease-in-out dark:bg-gray-800 sm:w-96"
							role="dialog"
							aria-labelledby="suggestions-title"
						>
							<div class="mb-3 flex items-center justify-between">
								<h3
									id="suggestions-title"
									class="text-sm font-medium text-gray-900 dark:text-white"
								>
									Suggested Avatars
								</h3>
								<button
									class="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-purple-100 hover:text-purple-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-purple-400"
									onclick={cycleBgSets}
									aria-label="Generate new suggestions"
								>
									<RefreshCw
										class="h-5 w-5 transform transition-transform duration-300 hover:rotate-180"
									/>
								</button>
							</div>

							<div class="grid grid-cols-2 gap-3">
								{#each roboHashSuggestions as suggestion, index}
									<button
										class="group relative aspect-square overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
										onclick={() => selectRoboHashImage(suggestion)}
										aria-label={`Select avatar suggestion ${index + 1}`}
									>
										<img
											src={suggestion}
											alt={`Avatar suggestion ${index + 1}`}
											class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
										></div>
									</button>
								{/each}
							</div>

							<p class="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
								Click the refresh button to generate new suggestions
							</p>
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