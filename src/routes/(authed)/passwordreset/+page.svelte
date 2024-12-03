<script>
	import * as Form from '$lib/components/ui/form';
	import { toastManager } from '$lib/helpers/utilities.js';
	import {
		TOAST_TYPE_ERROR,
		TOAST_TYPE_SUCCESS,
		TOAST_TYPE_LOADING,
		TOAST_TYPE_INFO
	} from '$lib/settings/constants.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { emailSchema } from '$lib/settings/schema.js';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let requireTotp = $state(false);
	let totpCode = $state('');

	const form = superForm(data.form, {
		validators: zodClient(emailSchema),
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toastManager(TOAST_TYPE_SUCCESS, form.message.message);
					goto('/login');
				} else {
					if (form.message.message === 'mfa_enabled') {
						if(requireTotp){
							toastManager(TOAST_TYPE_ERROR, 'Invalid TOTP code. Please recheck the code and try again.');
							return;
						}
						requireTotp = true;
						toastManager(TOAST_TYPE_INFO, 'TOTP is either missing or invalid. Please enter the 6-digit code or recheck.');
					} else {
						toastManager(TOAST_TYPE_ERROR, form.message.message);
					}
				}
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;

	function handleBack() {
		goto('/');
	}

	function handleTotpInput(event) {
		const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
		totpCode = value;
		$formData.totp_code = value;
	}
</script>

<div class="mt-3 flex h-screen w-full" transition:fly|global={{ y: -200, duration: 300 }}>
	<!-- Left Image Panel -->
	<div class="relative hidden md:flex md:w-1/2">
		<img
			src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7886.jpg?t=st=1729101457~exp=1729105057~hmac=4906a0a44addf4af15d8aa7128c3d119e2ee6160542e072e1168aecfbb4eb02d&w=740"
			alt="Password Recovery"
			class="h-full w-full object-cover"
		/>
		<div class="absolute bottom-0 left-0 right-0 rounded-t-lg bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm">
			<h3 class="text-xl font-semibold text-gray-800">Lost Your Password?</h3>
			<p class="mt-3 text-gray-600 leading-relaxed">
				Don't worry, we won't judge! We've all been there—pressing "forgot password" like it's a
				magic button to unlock your brain. Just enter your email, and we'll send you a reset link
				faster than you can say "Why did I ever choose that password?"
			</p>
		</div>
	</div>

	<!-- Form Section -->
	<div class="flex w-full flex-col justify-between p-8 md:w-1/2">
		<button
			onclick={handleBack}
			class="group ml-auto self-start flex items-center gap-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 transition-colors"
		>
			<span>Back</span>
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<div class="mx-auto flex w-full max-w-md flex-grow flex-col justify-center">
			<div class="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
				<h2 class="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
					Reset your password
				</h2>

				<form method="POST" use:enhance class="space-y-6">
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Form.Label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Form.Label>
							<div class="relative">
								<Input 
									{...attrs} 
									bind:value={$formData.email} 
									placeholder="yourname@example.com"
									class="mt-1 pl-10 block w-full rounded-md shadow-sm"
								/>
								<div class="absolute inset-y-0 left-3 flex items-center pointer-events-none mt-1">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
							</div>
						</Form.Control>
						<Form.FieldErrors class="text-sm text-red-500 mt-1" />
					</Form.Field>

					{#if requireTotp}
						<div class="mt-6" transition:fly={{ y: 20, duration: 300 }}>
							<Form.Field {form} name="totp_code">
								<Form.Control let:attrs>
									<Form.Label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
										TOTP Authentication Code
									</Form.Label>
									<div class="relative">
										<Input
											{...attrs}
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											maxlength="6"
											placeholder="• • • • • •"
											class="text-center tracking-[1em] text-xl font-semibold h-14 pl-12 pr-4 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200"
											bind:value={$formData.totp_code}
											on:input={handleTotpInput}
										/>
										<div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
											</svg>
										</div>
									</div>
									<p class="mt-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										Enter the 6-digit code from your authenticator app
									</p>
									<div class="mt-4 text-center">
										<a 
											href="/passwordreset/recovery" 
											class="group inline-flex items-center gap-2 px-4 py-2 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20"
										>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
											</svg>
											<span>Lost your authentication device?</span>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
											</svg>
										</a>
									</div>
								</Form.Control>
							</Form.Field>
						</div>
					{/if}

					<Form.Button 
						type="submit" 
						class="mt-6 w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
						disabled={$delayed}
					>
						{#if $delayed}
							<svg
								class="animate-spin h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span>Sending reset link...</span>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
							</svg>
							<span>Send Reset Link</span>
						{/if}
					</Form.Button>
				</form>

				<p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
					Remembered your password? 
					<a href="/login" class="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400 transition-colors">
						Login Here
					</a>
				</p>
			</div>
		</div>
	</div>
</div>