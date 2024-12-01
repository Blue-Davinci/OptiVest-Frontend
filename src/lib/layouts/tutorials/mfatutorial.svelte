<script>
    import { scale } from 'svelte/transition';
    import { X, Smartphone, Plus, QrCode, KeyRound } from 'lucide-svelte';
    import { onMount } from 'svelte';

    export let isOpen = false;

    let modalElement;
    let closeButton;

    onMount(() => {
        if (isOpen) {
            closeButton?.focus();
        }
    });

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            isOpen = false;
        }
    }

    const steps = [
        {
            title: 'Download an Authenticator App',
            description: `Install Google Authenticator, Microsoft Authenticator, or any other authenticator app from your device\\'s app store.`,
            icon: 'smartphone'
        },
        {
            title: 'Open the App',
            description: 'Launch your authenticator app and tap the + or Add button to add a new account.',
            icon: 'plus'
        },
        {
            title: 'Scan QR Code',
            description: `Use your authenticator app to scan the QR code provided during setup. If you\\'ve already done this, you can skip this step.`,
            icon: 'qrcode'
        },
        {
            title: 'Enter the Code',
            description: 'A 6-digit code will appear in your authenticator app. Enter this code in the input fields above.',
            icon: 'key'
        }
    ];

    function getIconComponent(iconName) { // eslint-disable-line no-unused-vars
        switch (iconName) {
            case 'smartphone':
                return Smartphone;
            case 'plus':
                return Plus;
            case 'qrcode':
                return QrCode;
            case 'key':
                return KeyRound;
            default:
                return Smartphone;
        }
    }
</script>

{#if isOpen}
<div
    role="dialog"
    aria-labelledby="modal-title"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
>
    <button
        type="button"
        class="fixed inset-0 bg-black bg-opacity-50"
        on:click={() => isOpen = false}
        on:keydown={handleKeyDown}
        aria-label="Close modal overlay"
    ></button>
    
    <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative"
        transition:scale="{{ duration: 200 }}"
        role="document"
        bind:this={modalElement}
    >
        <div class="flex justify-between items-center mb-6">
            <h3 id="modal-title" class="text-xl font-bold text-gray-900 dark:text-white">
                How to Use Authenticator Apps
            </h3>
            <button
                type="button"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                on:click={() => isOpen = false}
                on:keydown={handleKeyDown}
                aria-label="Close modal"
                bind:this={closeButton}
            >
                <X class="w-6 h-6" />
            </button>
        </div>

        <div class="space-y-6">
            {#each steps as step, index}
                <div class="flex gap-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {#if step.icon === 'smartphone'}
                            <Smartphone class="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        {:else if step.icon === 'plus'}
                            <Plus class="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        {:else if step.icon === 'qrcode'}
                            <QrCode class="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        {:else if step.icon === 'key'}
                            <KeyRound class="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        {/if}
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {index + 1}. {step.title}
                        </h4>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                            {step.description}
                        </p>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-6 text-center">
            <button
                type="button"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium px-4 py-2"
                on:click={() => isOpen = false}
                on:keydown={handleKeyDown}
            >
                Got it, thanks!
            </button>
        </div>
    </div>
</div>
{/if}