<script>
	import LandingNav from '$lib/layouts/navs/landingnav.svelte';
	import { onMount } from 'svelte';
	import Themer from '$lib/layouts/common/themer.svelte';
	let { children, data } = $props();
	let isLoading = $state(true);
	//let {data} = $props();
	let isValidUser = $derived(
		!!(data.userInformation && data.userInformation.first_name && data.userInformation.last_name)
	);
	$inspect(isValidUser);
	onMount(() => {
		// Small delay to ensure all components are properly mounted
		setTimeout(() => {
			isLoading = false;
		}, 500);
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="/css/loader.css" />
</svelte:head>

{#if isLoading}
	<div class="loader-container">
		<div class="loader"></div>
	</div>
{:else}
	<Themer />
	<LandingNav {isValidUser} />
	{@render children()}
{/if}
