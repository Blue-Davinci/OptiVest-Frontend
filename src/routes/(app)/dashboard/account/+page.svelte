<script>
	import {
		Settings,
		Edit3,
	} from 'lucide-svelte';
    import Accountheader from '$lib/layouts/accounts/accountheader.svelte';
    import Accountoverview from '$lib/layouts/accounts/accountoverview.svelte';
    import Accountactivity from '$lib/layouts/accounts/accountactivity.svelte';
    import Accountawards from '$lib/layouts/accounts/accountawards.svelte';
	import Investmentpreferences from '$lib/layouts/accounts/investmentpreferences.svelte';
	import Accountmfa from '$lib/layouts/accounts/accountmfa.svelte';

	let { data } = $props();
    $inspect(data);
	let accountStats = $derived(data?.data?.accountStats?.AccountStats || {});
    let accountRating = $derived(data?.data?.accountStats?.AccountRating || {});
	let awards = $derived(data?.data?.awards);
	let userInfo = $derived(data?.userInformation || {});
	let user = $derived(data?.data?.user || {});

	function updateProfile(event) {
		console.log('Profile update triggered');
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Enhanced Header Section with Financial Overview -->
     <Accountheader {data} {accountStats} {user} {accountRating} />

	<main class="container mx-auto -mt-24 px-4">
        <!-- Overview Stats -->
        <Accountoverview {accountStats} />
		<!-- Activity Timeline -->
        <Accountactivity />

		<!-- Enhanced Awards Section -->
        <Accountawards {awards} />

		<!-- Enhanced Investment Preferences -->
		<Investmentpreferences {user} />

		<!-- MFA Section-->
		<Accountmfa {data} />

		<!-- Enhanced Profile Settings -->
		<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
			<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
				<Settings />
				Profile Settings
			</h2>
			<form onsubmit={updateProfile} class="space-y-8">
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div>
						<label for="first_name" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>First Name</label
						>
						<input
							id="first_name"
							type="text"
							value={userInfo.first_name}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Last Name</label
						>
						<input
							type="text"
							value={userInfo.last_name}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Phone Number</label
						>
						<input
							type="tel"
							value={user.phone_number}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Date of Birth</label
						>
						<input
							type="date"
							value={user.dob?.split('T')[0]}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Country</label
						>
						<select
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
							value={userInfo.country_code}
						>
							<option value="KE">Kenya</option>
							<option value="US">United States</option>
							<option value="GB">United Kingdom</option>
						</select>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Currency</label
						>
						<select
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
							value={userInfo.currency_code}
						>
							<option value="USD">USD</option>
							<option value="EUR">EUR</option>
							<option value="GBP">GBP</option>
							<option value="KES">KES</option>
						</select>
					</div>
					<div class="md:col-span-2">
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Address</label
						>
						<input
							type="text"
							value={user.address}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
				</div>
				<div class="flex justify-end">
					<button
						type="submit"
						class="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-medium text-white transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
					>
						<Edit3 size={20} />
						Save Changes
					</button>
				</div>
			</form>
		</section>
	</main>
</div>

<style>
	/* additional custom styles */
</style>
