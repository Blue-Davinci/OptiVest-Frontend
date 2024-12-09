<script>
    import Accountheader from '$lib/layouts/accounts/accountheader.svelte';
    import Accountoverview from '$lib/layouts/accounts/accountoverview.svelte';
    import Accountactivity from '$lib/layouts/accounts/accountactivity.svelte';
    import Accountawards from '$lib/layouts/accounts/accountawards.svelte';
	import Investmentpreferences from '$lib/layouts/accounts/investmentpreferences.svelte';
	import Accountmfa from '$lib/layouts/accounts/accountmfa.svelte';
	import Accountprofile from '$lib/layouts/accounts/accountprofile.svelte';

	let { data } = $props();
    $inspect(data);
	let accountStats = $derived(data?.data?.accountStats?.AccountStats || {});
    let accountRating = $derived(data?.data?.accountStats?.AccountRating || {});
	let currencies = $derived(data?.currencies?.data?.currencies?.conversion_rates ?? {});
	let awards = $derived(data?.data?.awards);
	let userInfo = $derived(data?.userInformation || {});
	let user = $derived(data?.data?.user || {});
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
		<Investmentpreferences {data} {user} />

		<!-- MFA Section-->
		<Accountmfa {data} {user} />

		<!-- Enhanced Profile Settings -->
		<Accountprofile {data} {userInfo} {user} {currencies} />
	</main>
</div>

<style>
	/* additional custom styles */
</style>
