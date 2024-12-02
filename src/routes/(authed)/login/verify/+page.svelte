<script>
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { totpSchema } from '$lib/settings/schema.js';
	import { Input } from '$lib/components/ui/input';
    import { toastManager } from '$lib/helpers/utilities.js';
	import {
		TOAST_TYPE_ERROR,
		TOAST_TYPE_SUCCESS,
		TOAST_TYPE_LOADING
	} from '$lib/settings/constants.js';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';

	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { saveTimerState, getStoredTime, deleteStoredTime } from '$lib/store/storage';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Mfatutorial from '$lib/layouts/tutorials/mfatutorial.svelte';

	let { data } = $props();

	let codes = $state('');
	let timeLeft = $state(getStoredTime() || 600);
	let timer;
	let mounted = $state(false);
	let showTutorial = $state(false);
	let email = $page.url.searchParams.get('email') || '';
	let token = $page.url.searchParams.get('token') || '';
    let redirectTo = $page.url.searchParams.get('redirectTo') ?? '/dashboard'; // Redirect to the dashboard by default
	$inspect({ email, token, redirectTo });
    console.log("Direct redirectTo: ", redirectTo), " || Redirect via page: ", $page.url.searchParams.get('redirectTo');
	if (email === '' || token === '') {
		goto('/login');
	}
	onMount(() => {
		startTimer();
		mounted = true;
		return () => clearInterval(timer);
	});

	function startTimer() {
		timer = setInterval(() => {
			timeLeft--;
			saveTimerState(timeLeft);

			if (timeLeft <= 0) {
				clearInterval(timer);
				goto('/login'); // Automatically navigate to the login page
			}
		}, 1000);
	}

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function handleInput(event) {
		const value = event.target.value.replace(/\D/g, '').slice(0, 6);
		codes = value;
	}

	const form = superForm(data.form, {
		validators: zodClient(totpSchema),
		dataType: 'json',
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.message && form.message.success) {
				// if everything is successful, redirect to the dashboard
                let name = `${form.message.data.first_name} ${form.message.data.last_name}`;
				let message = `${form.message.message} Welcome back, ${name}!`;
				toastManager(TOAST_TYPE_SUCCESS, message);
                // delete the stored time
                deleteStoredTime();
                goto(redirectTo);
                return
			}else{
                console.log('Error:', form);
                // if error = "session_expired", redirect to the login page
                if (form.message.message === 'session_expired') {
                    toastManager(TOAST_TYPE_ERROR, 'Session expired. Please login again.');
                    deleteStoredTime();
                    goto('/login');
                    return
                }
                // if there is an error, show the error message
                toastManager(TOAST_TYPE_ERROR, form.message.message);
                return
            }
		}
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<div
	class="flex min-h-screen items-start justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 pt-8 dark:from-gray-900 dark:to-gray-800 sm:pt-16"
>
	{#if mounted}
		<div
			in:fly={{ y: 50, duration: 1000, delay: 200, easing: quintOut }}
			class="relative mx-4 w-full max-w-md space-y-8 overflow-hidden rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8"
		>
			<div
				in:scale={{ duration: 800, delay: 500, easing: quintOut }}
				class="mb-10 flex flex-col items-center"
			>
				<div class="relative mb-6 h-20 w-full max-w-[200px]">
					<img
						src="/optivest-high-resolution-logo-transparent.png"
						alt="Optivest Logo"
						class="h-full w-full object-contain"
					/>
				</div>
			</div>

			<div in:fade={{ duration: 800, delay: 800 }} class="space-y-3 text-center">
				<h2
					class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-blue-600 sm:text-3xl"
				>
					Two-Factor Authentication
				</h2>
				<p class="text-gray-600 dark:text-gray-300">
					Enter the 6-digit code from your authenticator app
					<button
						type="button"
						class="ml-1 text-blue-600 hover:text-blue-800 hover:underline focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
						onclick={() => (showTutorial = true)}
					>
						Need help?
					</button>
				</p>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
					Session expires in: {formatTime(timeLeft)}
				</p>
			</div>

			<form method="POST" use:enhance={enhance} class="mt-8 space-y-6">
				<!-- Hidden controls for token and email -->
				<input type="hidden" name="totp_token" value={token} />
				<input type="hidden" name="email" value={email} />

				<Form.Field {form} name="totp_code">
					<Form.Control let:attrs>
						<Form.Label>6-digit Code</Form.Label>
						<Input
							{...attrs}
							type="text"
							inputmode="numeric"
							pattern="[0-9]*"
							maxlength="6"
							bind:value={$formData.totp_code}
							oninput={handleInput}
							class="w-full rounded-lg border border-gray-300 bg-white py-3 
                                text-center text-lg font-semibold text-gray-900 
                                shadow-sm transition-all duration-200 hover:shadow-md
                                focus:ring-2
                                dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-xl md:text-2xl"
						/>
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-600 dark:text-red-500" />
				</Form.Field>
				<!-- Input field for 6-digit code -->

				<Form.Button
					type="submit"
					disabled={codes.length !== 6 || $delayed}
					class="group relative flex w-full transform justify-center rounded-lg border border-transparent
                           bg-gradient-to-r from-blue-600 to-blue-700 px-4 
                           py-3 text-sm font-medium text-white shadow-md
                           transition-all duration-300 hover:scale-[1.02] hover:from-blue-700
                           hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:ring-offset-2 
                           active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-blue-600
                           dark:hover:from-blue-600 dark:hover:to-blue-700"
				>
					{#if $delayed}
						<svg
							width="20"
							height="20"
							fill="currentColor"
							class="mr-2 animate-spin"
							viewBox="0 0 1792 1792"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
							>
							</path>
						</svg>
						Verifying...
						{toastManager(TOAST_TYPE_LOADING, 'Please wait...')}
					{:else}
						Verify
					{/if}
				</Form.Button>

				<p class="text-center text-xs text-gray-500 dark:text-gray-400">
					Didn't receive the code? Check your authenticator app
				</p>
			</form>
		</div>
	{/if}
</div>

<Mfatutorial bind:isOpen={showTutorial} />
