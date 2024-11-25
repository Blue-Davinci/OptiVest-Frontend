<script>
	import { fly, slide } from 'svelte/transition';
	import Header from '$lib/layouts/landing/header.svelte';
	import Features from '$lib/layouts/landing/features.svelte';
	import AdvancedFeatures from '$lib/layouts/landing/advancedfeatures.svelte';
	import Services from '$lib/layouts/landing/services.svelte';
	import Plans from '$lib/layouts/landing/plans.svelte';
	import UserStories from '$lib/layouts/landing/userstories.svelte';
	import ContactUs from '$lib/layouts/landing/contactus.svelte';
	import Footer from '$lib/layouts/landing/footer.svelte';

	let { data } = $props();
</script>

<div transition:slide|global={{ x: 200, duration: 500 }}>
	<Header />
	<Features />
	<AdvancedFeatures />
	<Plans />
	<Services />
	<UserStories />
	<ContactUs {data} />
	<Footer />
</div>

<style>

</style>
