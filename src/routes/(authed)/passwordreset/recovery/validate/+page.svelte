<script>
	import * as Form from '$lib/components/ui/form';
	import { recoverySchema } from '$lib/settings/schema.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
    import { goto } from '$app/navigation';
	import { 
		KeyRound, 
		ArrowRight, 
		ArrowLeft, 
		HelpCircle, 
		InfoIcon
	} from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Tooltip } from '$lib/components/ui/tooltip';

    let codes = $state(Array(5).fill(''));
    let { data } = $props();
    let activeCodeIndex = $state(0);
    let progressLevel = $state(1);
    
    // Create refs for input elements
    let codeInputs = Array(5).fill(null);

	// Function to check if all codes are filled
    function checkCodesCompletion() {
        const allCodesFilled = codes.every(code => code.length > 0);
        progressLevel = allCodesFilled ? 2 : 1;
        return allCodesFilled;
    }

    function handleKeyPress(event, index) {
        if (event.key === 'Backspace' && !codes[index] && index > 0) {
            codeInputs[index - 1]?.focus();
            activeCodeIndex = index - 1;
        } else if (codes[index]?.length === 4 && index < 5) {
            codeInputs[index + 1]?.focus();
            activeCodeIndex = index + 1;
        }
        checkCodesCompletion();
    }

    function handlePaste(event) {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text'); // Get the pasted data
    const cleanedData = pastedData.replace(/[^A-Za-z0-9]/g, ''); // Remove invalid characters
    
    const segmentLength = 26; // Desired length of each recovery code
    const numCodes = 6; // Number of recovery codes expected

    // Reset codes array
    for (let i = 0; i < Math.min(cleanedData.length, numCodes * segmentLength); i += segmentLength) {
        const index = Math.floor(i / segmentLength);
        codes[index] = cleanedData.substr(i, segmentLength);
    }

    codes = [...codes]; // Trigger reactivity if in a reactive framework
    checkCodesCompletion(); // Validate if all codes are completed
}


	const form = superForm(data.form, {
		validators: zodClient(recoverySchema),
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
                console.log("Form message: ", form.message);
				if (form.message.status === 'success') {
					progressLevel = 3;
					toastManager(TOAST_TYPE_SUCCESS, 'Your account has been successfully recovered. You can now proceed to reset your password.');
					goto('/passwordreset');
                    return
				} else {
					toastManager(TOAST_TYPE_ERROR, form.message.message);
				}
                return;
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<main class="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
	<div class="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
		<!-- Logo Section -->
		<div class="mb-8 flex flex-col items-center">
			<div class="relative h-16 w-48">
				<img
					src="/optivest-high-resolution-logo-transparent.png"
					alt="Optivest Logo"
					class="h-full w-full object-contain dark:brightness-200"
				/>
				<div class="absolute -bottom-1 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-primary/20 dark:bg-primary/40"></div>
			</div>
		</div>

		<!-- Header Section -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Account Recovery</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Please enter your recovery codes and security token to restore access
			</p>
		</div>

		<!-- Progress Indicator -->
        <div class="mb-8">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full {progressLevel >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}">1</div>
                    <div class="ml-2 text-gray-700 dark:text-gray-300">Codes</div>
                </div>
                <div class="h-0.5 w-16 {progressLevel >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}"></div>
                <div class="flex items-center">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full {progressLevel >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}">2</div>
                    <div class="ml-2 text-gray-700 dark:text-gray-300">Token</div>
                </div>
                <div class="h-0.5 w-16 {progressLevel >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}"></div>
                <div class="flex items-center">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full {progressLevel >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}">3</div>
                    <div class="ml-2 text-gray-700 dark:text-gray-300">Verify</div>
                </div>
            </div>
        </div>

		<form method="POST" use:enhance class="space-y-8">
			<!-- Recovery Codes Section -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Recovery Codes
						<Tooltip content="Enter the recovery codes you received when setting up 2FA. Format: XXXX-XXXX-XXXX">
							<HelpCircle class="ml-1 inline h-4 w-4 text-gray-400 dark:text-gray-500" />
						</Tooltip>
					</label>
				</div>

				<!-- Recovery Code Format Guide -->
				<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
					<div class="flex items-start space-x-3">
						<InfoIcon class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary dark:text-primary/90" />
						<div class="space-y-1">
							<p class="text-sm text-gray-700 dark:text-gray-300">
								Your recovery code should look like this:
							</p>
							<p class="font-mono text-sm text-gray-600 dark:text-gray-400">
								ABCD-1234-EFGH
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								Each code consists of 4 characters. You can use letters and numbers.
							</p>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
					{#each codes as code, i}
						<div class="relative">
							<Input
								type="text"
								bind:this={codeInputs[i]}
								bind:value={codes[i]}
								on:keyup={(e) => handleKeyPress(e, i)}
								on:paste={handlePaste}
								class="block w-full rounded-lg border border-gray-300 px-4 py-3 font-mono uppercase transition-all
									dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
									{activeCodeIndex === i ? 'border-primary ring-2 ring-primary/20 dark:ring-primary/40' : ''}
									{codes[i] ? 'bg-gray-50 dark:bg-gray-600' : ''}"
								placeholder="CODE"
								maxlength="4"
								required
							/>
							<span class="absolute right-3 top-3 text-sm text-gray-400 dark:text-gray-500">
								{i + 1}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Security Token Section -->
			<Form.Field {form} name="token_plaintext">
				<Form.Control let:attrs>
					<Form.Label class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Security Token
						<Tooltip content="Enter the 6-digit code from your authenticator app">
							<HelpCircle class="ml-1 inline h-4 w-4 text-gray-400 dark:text-gray-500" />
						</Tooltip>
					</Form.Label>
					<div class="relative">
						<Input
							{...attrs}
							bind:value={$formData.token_plaintext}
							class="block w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 transition-colors
								dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
								focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40"
							placeholder="Enter your security token"
							required
						/>
						<KeyRound class="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
					</div>
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-sm text-red-500 dark:text-red-400" />
			</Form.Field>

			<!-- Submit Button -->
			<Form.Button
				type="submit"
				class="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-white
					transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50
					dark:bg-primary/90 dark:hover:bg-primary"
				disabled={$delayed}
			>
				{#if $delayed}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					<span>Processing...</span>
				{:else}
					<span>Recover Account</span>
					<ArrowRight size={20} />
				{/if}
			</Form.Button>
		</form>

		<!-- Footer Links -->
		<div class="mt-8 flex flex-col items-center space-y-4 text-sm">
			<a 
				href="/passwordreset" 
				class="flex items-center text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
			>
				<ArrowLeft class="mr-1 h-4 w-4" />
				Have access to your device? Go back to password reset
			</a>
			
			<div class="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
				<InfoIcon class="h-4 w-4" />
				<span>Need help?</span>
				<a href="/support" class="font-medium text-primary hover:text-primary/90 dark:text-primary/90 dark:hover:text-primary">
					Contact Support
				</a>
			</div>
		</div>
	</div>
</main>

<style lang="postcss">
	:global(.tooltip) {
		@apply invisible absolute z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-all dark:bg-gray-700;
	}

	:global(.has-tooltip:hover .tooltip) {
		@apply visible opacity-100;
	}
</style>