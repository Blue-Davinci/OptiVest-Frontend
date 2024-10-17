<script>
	import LandingNav from '$lib/layouts/navs/landingnav.svelte';

	let { children, data } = $props();
	//let {data} = $props();
	let isValidUser = $derived(!!(data.userInformation && data.userInformation.first_name && data.userInformation.last_name));
	$inspect(isValidUser);
</script>

<LandingNav {isValidUser}/>
{@render children()}
