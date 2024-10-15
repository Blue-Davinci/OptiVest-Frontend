<script>
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { ModeWatcher } from 'mode-watcher';
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon, Users, Bell, Fingerprint } from 'lucide-svelte';


</script>

<div class="container" in:fly={{ x: -200, duration: 1000 }} out:slide={{ duration: 600 }}>
	<Button class="mb-2" on:click={toggleMode} variant="outline" size="icon">
		<Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
		<Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		<span class="sr-only">Toggle theme</span>
	</Button>
	<ModeWatcher />
	<slot />
</div>

