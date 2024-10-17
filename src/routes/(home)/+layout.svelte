<script>
	import LandingNav from '$lib/layouts/navs/landingnav.svelte';

	let { children, data } = $props()
	//let {data} = $props();

	console.log(data);
</script>

<LandingNav />
{@render children()} 