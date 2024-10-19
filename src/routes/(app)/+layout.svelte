<script>
import Dashboardsidenav from "$lib/layouts/navs/dashboardsidenav.svelte";
let { children, data } = $props();
</script>


<Dashboardsidenav userInfo={data.userInformation} />
{@render children()}