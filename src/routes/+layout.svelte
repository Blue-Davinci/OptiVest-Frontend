<script>
	import '../app.css';
	import { Toaster } from "$lib/components/ui/sonner";
	import { ModeWatcher } from 'mode-watcher';
</script>

<div class="container">
	<ModeWatcher/>
	<Toaster richColors position="top-right"/>
	<slot />
</div>

