<script>
	import { CheckCircle, AlertCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
    import { goto } from '$app/navigation';

	let isSuccess = $state(false);
	let data = $props();

	if (data.data.status === 'success') {
		isSuccess = true;
	} else {
		isSuccess = false;
	}

    let full_name = `${data.data.info.first_name} ${data.data.info.last_name}`;
	console.log('Data:', data.data.info);
	function navigate(route) {
        goto(route);
	}
</script>

<div class="flex min-h-screen">
	<!-- Left Image Panel (only visible on medium screens and above) -->
	<div
		class="relative hidden bg-cover bg-center md:flex md:w-1/2"
		style="background-image: url('https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration-enter-application-mobile-screen-user-login-form-website-page-interface-ui-new-profile-registration-email-account_335657-936.jpg?t=st=1729094173~exp=1729097773~hmac=a196db897af02d2006ca3327f5a658e3d114bf4b17776f3e90e495b450101741&w=740');"
	>
		<div
			class="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 p-6 text-white backdrop-blur-sm"
		>
			<h2 class="mb-2 text-2xl font-bold">Welcome to OptiVest!</h2>
			<p class="text-sm leading-relaxed">
				At OptiVest, we provide personalized financial advice tailored to your goals. Whether you're
				investing in stocks, bonds, or alternative assets, we've got you covered with AI-driven
				insights and real-time data.
			</p>
		</div>
	</div>

	<!-- Right Activation Panel with Dark Mode Support -->
	<div class="flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2">
		<div
			class="w-full max-w-sm rounded-lg border border-gray-300 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="text-center text-black dark:text-white">
				{#if isSuccess}
					<!-- Success Message -->
					<CheckCircle class="mx-auto mb-4 h-24 w-24 text-green-500" />
					<h2 class="mb-4 text-2xl font-bold">Congratulations! 🎉</h2>
					<p class="mb-6">Your account has been successfully activated <strong class="font-semibold text-base">{full_name}</strong>.</p>
					<Button
						class="w-full rounded-lg bg-green-500 px-6 py-3 text-white transition-all duration-200 hover:bg-green-600"
						onclick={() => navigate('/login')}
					>
						Go to Login
					</Button>
				{:else}
					<!-- Error Message -->
					<AlertCircle class="mx-auto mb-4 h-24 w-24 text-red-500" />
					<h2 class="mb-4 text-2xl font-bold">Oops! Something went wrong.</h2>
					<p class="mb-6">We were unable to activate your account. Please try again later.</p>
					<Button
						class="w-full rounded-lg bg-red-500 px-6 py-3 text-white transition-all duration-200 hover:bg-red-600"
						onclick={() => navigate('/')}
					>
						Return to Home
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
