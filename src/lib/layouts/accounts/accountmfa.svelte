<script>
    import {
        ChevronRight,
        Shield,
        QrCode,
        AlertCircle,
        Loader2
    } from 'lucide-svelte';
    import { fade } from 'svelte/transition';
    import Recoverycodes from './recoverycodes.svelte';
    import { onMount } from 'svelte';
    import QRCode from 'qrcode';
    import { optinToMFA } from '$lib/dataservice/users/usersDataService.js';
    import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
    import * as Form from '$lib/components/ui/form';
    import { totpSchema } from '$lib/settings/schema.js';
    import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

    let {data} = $props();
    
    // MFA related state
    let mfaEnabled = $state(false);
    let showQRCode = $state(false);
    let verificationCode = $state('');
    let isLoading = $state(false);
    let qrCodeUrl = $state('');
    let isGeneratingQR = $state(false);
    let recovery_details = $state({});
    let isDrawerOpen = $state(false);
    
    // QR code canvas reference
    let qrCanvas = $state();;
    
    onMount(() => {
        if (qrCanvas && qrCodeUrl) {
            generateQRCode(qrCodeUrl);
        }
    });
    
    async function generateQRCode(text) {
        try {
            await QRCode.toCanvas(qrCanvas, text, {
                width: 192,
                margin: 1,
                color: {
                    dark: '#1a1a1a',
                    light: '#ffffff'
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
    
    // MFA related functions
    async function toggleMFA() {
        if (!mfaEnabled) {
            isLoading = true;
            try {
                // perform the MFA optin request
                const response = await optinToMFA();
                if (response.success && response.data.qr_code) {
                    isGeneratingQR = true;
                    qrCodeUrl = response.data.qr_code;
                    showQRCode = true;
                    // Small delay to ensure canvas is mounted
                    await new Promise(resolve => setTimeout(resolve, 100));
                    if (qrCanvas) {
                        await generateQRCode(qrCodeUrl);
                    }
                }else{
                    toastManager(TOAST_TYPE_ERROR, response.error);
                }
            } catch (error) {
                toastManager(TOAST_TYPE_ERROR, 'Failed to enable MFA. Please try again later.');
            } finally {
                isLoading = false;
                isGeneratingQR = false;
            }
        } else {
            // Handle MFA disable logic
            mfaEnabled = false;
            showQRCode = false;
            qrCodeUrl = '';
        }
    }

    const form = superForm(data.totpForm, {
        validators: zodClient(totpSchema),
		dataType: 'json',
        invalidateAll: true,
		onUpdated({ form }) {
            console.log("Totp confirmation:", form);
			if (form.message && form.message.success) {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				console.log('Form Data created:', form.message.data);
                mfaEnabled = true;
                showQRCode = false;
                verificationCode = '';
                recovery_details = form.message.data.recovery_details;
                isDrawerOpen = true;
			} else if (form.message && !form.message.success) {
                toastManager(TOAST_TYPE_ERROR, form.message.message);
			}
		}
    });
    const{form:totpForm, enhance:totpEnhance, message:totpMessage, delayed:totpDeleyed} = form;

</script>

{#if isLoading}
<div
    class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
    transition:fade={{ duration: 200 }}
>
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-3">
        <Loader2 class="animate-spin text-purple-600 dark:text-purple-400" size={24} />
        <span class="text-gray-900 dark:text-white">Processing...</span>
    </div>
</div>
{/if}

<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
    <h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <Shield /> Two-Factor Authentication
    </h2>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="space-y-6">
            <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div class="flex items-center gap-3">
                    <div class={`rounded-full p-2 ${mfaEnabled ? 'bg-green-100 dark:bg-green-900/50' : 'bg-yellow-100 dark:bg-yellow-900/50'}`}>
                        <Shield
                            class={`${mfaEnabled ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
                            size={24}
                        />
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">
                            {mfaEnabled ? 'MFA is Enabled' : 'MFA is Disabled'}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            {mfaEnabled ? 'Your account is secured with 2FA' : 'Enable 2FA for enhanced security'}
                        </p>
                    </div>
                </div>
                <button
                onclick={toggleMFA}
                disabled={isLoading || showQRCode}
                class={`rounded-lg px-4 py-2 font-medium inline-flex items-center gap-2 transition-all
                    ${mfaEnabled
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-400'
                    } 
                    ${(isLoading || showQRCode) ? 
                        'opacity-50 cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' 
                        : ''
                    }`}
            >
                {#if isLoading}
                    <Loader2 class="animate-spin" size={16} />
                    <span>Processing...</span>
                {:else}
                    {mfaEnabled ? 'Disable' : 'Enable'}
                {/if}
            </button>
            </div>

            {#if showQRCode}
            <div class="space-y-4" transition:fade={{ duration: 200 }}>
                <div class="mb-4 flex items-center gap-3">
                    <QrCode size={20} class="text-purple-600 dark:text-purple-400" />
                    <h3 class="font-medium text-gray-900 dark:text-white">Scan QR Code</h3>
                </div>
                <div class="mx-auto flex h-48 w-48 items-center justify-center rounded-lg border-2 border-gray-300 bg-white p-6 shadow-inner dark:border-gray-700 dark:bg-gray-900 relative">
                    {#if isGeneratingQR}
                    <div class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900" transition:fade={{ duration: 200 }}>
                        <Loader2 class="animate-spin text-purple-600 dark:text-purple-400" size={32} />
                    </div>
                    {/if}
                    <canvas
                        bind:this={qrCanvas}
                        class="w-full h-full"
                    ></canvas>
                </div>

                <div class="space-y-2">
                    <form method="POST" action="?/totpverification" use:totpEnhance>
                        <Form.Field {form} name="totp_code"> 
                            <Form.Control let:attrs>
                                <Form.Label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter Verification Code</Form.Label>
                                <input
                                    {...attrs}
                                    bind:value={$totpForm.totp_code}
                                    type="text"
                                    inputmode="numeric"
									pattern="[0-9]*"
                                    maxlength="6"
                                    class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
                                    placeholder="• • • • • •"
                                />
                            </Form.Control>
                            <Form.FieldErrors />
                        </Form.Field>
                        <Form.Button type="submit" disabled={$totpDeleyed} class="mt-2 w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800">
                            {#if $totpDeleyed}
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
                        Verify and Enable
						{/if}
                        </Form.Button>
                    </form>
                </div>
            </div>
            {/if}

            {#if !showQRCode}
                <div class="space-y-6">
                    <div
                        class="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-600 dark:bg-gray-700/50"
                    >
                        <div class="flex flex-col items-center justify-center text-center">
                            <div
                                class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50"
                            >
                                <Shield class="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>

                            <!-- Process Flow Visualization -->
                            <div class="mx-auto w-full max-w-2xl">
                                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <!-- Step 1: Enable -->
                                    <div class="relative">
                                        <div
                                            class="h-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                                                <span
                                                    class="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                                                >
                                                    Step 1
                                                </span>
                                            </div>
                                            <div class="mt-4 flex flex-col items-center space-y-3">
                                                <button
                                                    class="rounded-lg bg-purple-100 px-4 py-2 font-medium text-purple-600"
                                                >
                                                    Enable MFA
                                                </button>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                                    Click enable to start setup
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            class="absolute -right-4 top-1/2 hidden -translate-y-1/2 transform md:block"
                                        >
                                            <ChevronRight class="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>

                                    <!-- Step 2: Scan  -->
                                    <div class="relative">
                                        <div
                                            class="h-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                                                <span
                                                    class="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                                                >
                                                    Step 2
                                                </span>
                                            </div>
                                            <div class="mt-4 flex flex-col items-center space-y-3">
                                                <div
                                                    class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
                                                >
                                                    <QrCode class="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                                    Scan QR with authenticator
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            class="absolute -right-4 top-1/2 hidden -translate-y-1/2 transform md:block"
                                        >
                                            <ChevronRight class="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>

                                    <!-- Step 3: Verify -->
                                    <div class="relative">
                                        <div
                                            class="h-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                                                <span
                                                    class="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                                                >
                                                    Step 3
                                                </span>
                                            </div>
                                            <div class="mt-4 flex flex-col items-center space-y-3">
                                                <div
                                                    class="flex h-8 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
                                                >
                                                    <span class="font-mono text-gray-400">• • • • • •</span>
                                                </div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                                    Enter verification code
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- MFA Tips and Information -->
        <div class="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
            <div class="mb-4 flex items-center gap-3">
                <AlertCircle class="text-purple-600 dark:text-purple-400" size={24} />
                <h3 class="font-semibold text-purple-900 dark:text-purple-100">
                    Why Use Two-Factor Authentication?
                </h3>
            </div>
            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                <li class="flex items-start gap-2">
                    <span class="text-purple-600 dark:text-purple-400">•</span>
                    <span>Adds an extra layer of security to your account</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-purple-600 dark:text-purple-400">•</span>
                    <span>Protects against unauthorized access even if your password is compromised</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-purple-600 dark:text-purple-400">•</span>
                    <span>Required for certain high-security operations</span>
                </li>
            </ul>

            <div class="mt-6 space-y-3">
                <h4 class="font-medium text-purple-900 dark:text-purple-100">Getting Started:</h4>
                <ol class="space-y-2 text-gray-600 dark:text-gray-300">
                    <li class="flex items-start gap-2">
                        <span class="font-medium text-purple-600 dark:text-purple-400">1.</span>
                        <span>Download an authenticator app (Google Authenticator, Authy, etc.)</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-medium text-purple-600 dark:text-purple-400">2.</span>
                        <span>Scan the QR code with your authenticator app</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-medium text-purple-600 dark:text-purple-400">3.</span>
                        <span>Enter the 6-digit code to verify and enable MFA</span>
                    </li>
                </ol>
            </div>
        </div>
    </div>
</section>

{#if isDrawerOpen}
<Recoverycodes {recovery_details} {isDrawerOpen}  />    
{/if}