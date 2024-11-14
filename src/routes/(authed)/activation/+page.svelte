<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { emailSchema } from '$lib/settings/schema.js';
	import { Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-svelte';

	let { data } = $props();

	let countdown = $state(0);
	let interval;

	function startCountdown(seconds) {
		countdown = seconds;
		interval = setInterval(() => {
			countdown -= 1;
			if (countdown <= 0) {
				clearInterval(interval);
			}
		}, 1000);
	}

	const form = superForm(data.form, {
		validators: zodClient(emailSchema),
		dataType: 'json',
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.message && form.message.success) {
				startCountdown(60);
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				console.log('Email sent:', form.message.data);
			} else if (form.message && !form.message.success) {
				toastManager(TOAST_TYPE_ERROR, form.message.message);
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<div class="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-md">
		<!-- Logo Section -->
		<div class="mb-8 text-center">
			<img
				src="/optivest-high-resolution-logo-transparent.png"
				alt="OptiVest Logo"
				class="mx-auto h-16 w-auto"
			/>
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-lg bg-white shadow-xl">
			<!-- Purple Header -->
			<div class="border-l-4 border-purple-600 bg-purple-100 p-4">
				<div class="flex items-center">
					<AlertCircle class="mr-2 h-5 w-5 text-purple-600" />
					<p class="font-medium text-purple-700">Account Activation Required</p>
				</div>
				<p class="mt-2 text-sm text-purple-600">
					Please reactivate your account to access all features
				</p>
			</div>

			<!-- Form Section -->
			<div class="p-6">
				<form method="POST" use:enhance class="space-y-6">
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Form.Label class="block text-sm font-medium text-gray-700">Email Address</Form.Label>
							<div class="relative mt-1 rounded-md shadow-sm">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail class="h-5 w-5 text-gray-400" />
								</div>
								<Input
									{...attrs}
									placeholder="Enter your email address..."
									bind:value={$formData.email}
									class="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-purple-500 focus:ring-purple-500"
								/>
							</div>
						</Form.Control>
						<Form.FieldErrors class="mt-2 text-sm text-red-600" />
					</Form.Field>

					<!-- Action Button -->
					<button
						type="submit"
						class="flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-purple-300"
						disabled={$delayed || countdown > 0}
					>
						{#if $delayed}
							<Loader2 class="-ml-1 mr-2 h-5 w-5 animate-spin" />
							Sending Email...
						{:else if countdown > 0}
							<div class="w-full">
								<div class="flex items-center justify-center space-x-2">
									<span>Resend in {countdown}s</span>
								</div>
								<div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-purple-200">
									<div
										class="h-full bg-purple-600 transition-all duration-1000 ease-linear"
										style="width: {(countdown / 60) * 100}%"
									></div>
								</div>
							</div>
						{:else}
							<Mail class="-ml-1 mr-2 h-5 w-5" />
							Send Activation Email
						{/if}
					</button>

					<!-- Help Text -->
					{#if $message?.success}
						<div class="mt-4 rounded-md bg-green-50 p-4">
							<div class="flex">
								<CheckCircle2 class="h-5 w-5 text-green-400" />
								<div class="ml-3">
									<h3 class="text-sm font-medium text-green-800">Email Sent Successfully</h3>
									<div class="mt-2 text-sm text-green-700">
										<p>Please check your email for the activation link.</p>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Additional Information -->
					<div class="mt-4 text-sm text-gray-500">
						<p class="text-center">
							Can't find the email? Check your spam folder or try again after the countdown.
						</p>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
