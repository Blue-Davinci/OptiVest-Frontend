<script>
	let menuOpen = $state(false);
	import { fly, slide } from 'svelte/transition';

	// props for isLogged in to control showing of login and signup buttons
	let { isValidUser } = $props();
	//console.log("In Nav Link: ",isValidUser);
</script>

<header class="bg-gradient-to-r from-blue-700 to-blue-900 shadow-sm">
	<div class="container mx-auto flex items-center justify-between px-4 py-4">
		<div class="flex items-center">
			<img
				src="/optivest-high-resolution-logo-black-modified.png"
				alt="Optivest Logo"
				class="mr-2 h-8 w-auto"
			/>
			<span class="text-xl font-bold text-white">Optivest</span>
		</div>
		<nav class="hidden space-x-6 md:flex">
			{#if !isValidUser}
				<a href="/" class="text-white transition duration-300 hover:text-blue-300">Home</a>
			{:else}
				<a href="/dashboard" class="text-white transition duration-300 hover:text-blue-300"
					>Dashboard</a
				>
			{/if}
			<a href="#about" class="text-white transition duration-300 hover:text-blue-300">About Us</a>
			<a href="#services" class="text-white transition duration-300 hover:text-blue-300">Services</a
			>
			<a href="#contact" class="text-white transition duration-300 hover:text-blue-300"
				>Contact Us</a
			>
		</nav>
		<div class="flex items-center space-x-4">
			{#if !isValidUser}
				<a href="/login" class="text-white transition duration-300 hover:text-blue-300">Log In</a>
				<a
					href="/signup"
					class="rounded-md bg-white px-4 py-2 font-semibold text-blue-700 transition duration-300 hover:bg-gray-100"
					>Sign Up</a
				>
			{:else}
				<!-- Log out -->
				<a
					href="/logout"
					class="rounded-md bg-white px-4 py-2 font-semibold text-blue-700 transition duration-300 hover:bg-gray-100"
					>Log Out</a
				>
			{/if}
		</div>
		<button
			class="md:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-expanded={menuOpen}
			aria-label="Toggle menu"
		>
			<svg
				class="h-6 w-6 text-white"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16m-7 6h7"
				></path>
			</svg>
		</button>
	</div>

	<!-- Mobile Menu -->
	<div v-if="menuOpen" class="bg-white py-2 md:hidden">
		<a href="#home" class="block px-4 py-2 hover:bg-gray-100">Home</a>
		<a href="#about" class="block px-4 py-2 hover:bg-gray-100">About Us</a>
		<a href="#services" class="block px-4 py-2 hover:bg-gray-100">Services</a>
		<a href="#contact" class="block px-4 py-2 hover:bg-gray-100">Contact Us</a>
	</div>
</header>
