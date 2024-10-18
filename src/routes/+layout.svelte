<script>
	import Themer from '$lib/layouts/common/themer.svelte';
	import '../app.css';
	import { Toaster } from "$lib/components/ui/sonner";
	import { ModeWatcher } from 'mode-watcher';
</script>

<div class="container">
	<Themer/>
	<ModeWatcher/>
	<Toaster richColors position="top-right"/>
	<slot />
</div>

