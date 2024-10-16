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
	import { formSchema } from '$lib/settings/schema.js';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { fly, slide, fade } from 'svelte/transition';

	let { data } = $props();
	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json',
		onUpdated({ form }) {
			//const action = result.data
			if (form.message) {
				// Display the message using a toast library
				//console.log(form.message.data);
				if (form.message.status === 'success') {
					let name = `${form.message.data.first_name} ${form.message.data.last_name}`;
					let message = `${form.message.message} Welcome back, ${name}!`;
					toastManager(TOAST_TYPE_SUCCESS, message);
					goto('/dashboard');
				} else {
					toastManager(TOAST_TYPE_ERROR, form.message.message);
				}
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
	console.log(data);

	function handleBack() {
		console.log('Back button clicked');
		goto('/');
	}
</script>

<div
	class="mt-3 flex h-screen w-full"
	transition:fly|global={{ y: -200,duration: 300 }}
>
	<!-- Image Panel Section -->
	<div class="relative hidden w-1/2 md:block">
		<img
			src="https://images.unsplash.com/photo-1640197618317-dc379a226fbe?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="Dashboard Preview"
			class="h-full w-full object-cover"
		/>
		<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6 text-white">
			<h3 class="mb-2 text-xl font-bold">Manage all your financial tasks using Optivest</h3>
			<p class="text-sm">
				The one-stop platform for all financial management of small and medium-sized businesses.
			</p>
		</div>
	</div>

	<!-- Login Form Section -->
	<div class="flex w-full flex-col justify-between p-8 md:w-1/2" in:fade={{ duration: 300 }}>
		<button
			onclick={handleBack}
			class="ml-auto self-start text-teal-500 hover:text-teal-600 dark:text-teal-400"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-1 inline-block h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					s
					troke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			Back
		</button>

		<div class="mx-auto flex w-full max-w-md flex-grow flex-col justify-center">
			<!-- Card Container -->
			<div class="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
				<div class="mb-6 text-center">
					<img
						src="/optivest-high-resolution-logo-transparent.png"
						alt="Optivest Logo"
						class="mx-auto h-16 w-auto"
					/>
				</div>

				<h2 class="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
					Login to your Optivest account
				</h2>

				<!-- Form using shadcn-svelte Form components -->
				<form method="POST" use:enhance>
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Form.Label>Email</Form.Label>
							<Input {...attrs} bind:value={$formData.email} placeholder="yourname@example.com" />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="password">
						<Form.Control let:attrs>
							<Form.Label>Password</Form.Label>
							<Input {...attrs} type="password" bind:value={$formData.password} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<input
								type="checkbox"
								id="remember-me"
								bind:checked={$formData.rememberMe}
								class="mb-4 mt-4 h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-teal-400"
							/>
							<label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
								>Remember me</label
							>
						</div>
						<div class="text-sm">
							<a href="#1" class="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400"
								>Forgot Password?</a
							>
						</div>
					</div>
					{#if $delayed}
						{toastManager(TOAST_TYPE_LOADING, 'Please wait...')}
					{/if}

					<Form.Button type="submit" class="w-full" disabled={$delayed}>Login</Form.Button>
				</form>

				<p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
					Don't have an account? <a
						href="#1"
						class="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400"
						>Register Here</a
					>
				</p>
			</div>
		</div>

		<footer class="mt-8 text-center text-sm text-gray-500 dark:text-gray-300">
			<p>&copy; 2024 Optivest. All rights reserved.</p>
			<div class="mt-2">
				<a href="/sitedocs/terms" class="text-teal-500 hover:text-teal-600 dark:text-teal-400"
					>Terms & Conditions</a
				>
				<span class="mx-2">|</span>
				<a href="/sitedocs/privacy" class="text-teal-500 hover:text-teal-600 dark:text-teal-400"
					>Privacy Policy</a
				>
			</div>
		</footer>
	</div>
</div>
