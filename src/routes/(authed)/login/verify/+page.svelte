<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { saveTimerState, getStoredTime } from '$lib/store/storage';
    import { goto } from '$app/navigation';
    import Mfatutorial from '$lib/layouts/tutorials/mfatutorial.svelte';

    let inputRefs = Array(6).fill(null);
    let codes = $state(Array(6).fill(''));
    let timeLeft = $state(getStoredTime() || 600);
    let timer;
    let error = $state('');
    let success = $state(false);
    let mounted = $state(false);
    let showTutorial = $state(false);

    $effect(() => {
        if (codes.every(code => code !== '')) {
            validateCode();
        }
    });

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

    function handleInput(index, event) {
        const value = event.target.value.replace(/\D/g, '');
        if (value.length <= 1) {
            codes[index] = value;
            // Move to next input if a digit was entered and there is a next input
            if (value !== '' && index < 5) {
                inputRefs[index + 1].focus();
            }
        } else if (value.length > 1) {
            // Handle case where multiple digits are entered/pasted into a single input
            const digits = value.split('');
            let currentIndex = index;

            for (let i = 0; i < digits.length && currentIndex < 6; i++) {
                codes[currentIndex] = digits[i];
                if (currentIndex < 5) {
                    currentIndex++;
                }
            }

            // Focus the next empty input or the last input
            if (currentIndex < 6) {
                inputRefs[currentIndex].focus();
            } else {
                inputRefs[5].focus();
            }
        }
    }

    function handleKeyDown(index, event) {
        if (event.key === 'Backspace' && !codes[index] && index > 0) {
            codes[index - 1] = '';
            inputRefs[index - 1].focus();
        } else if (event.key === 'ArrowLeft' && index > 0) {
            inputRefs[index - 1].focus();
        } else if (event.key === 'ArrowRight' && index < 5) {
            inputRefs[index + 1].focus();
        }
    }

    function handlePaste(event) {
        event.preventDefault();
        const pastedText = (event.clipboardData || window.clipboardData)
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);

        codes = Array(6).fill('').map((_, index) => pastedText[index] || '');

        // Focus the next empty input or the last filled input
        const nextEmptyIndex = codes.findIndex(code => code === '');
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs[focusIndex].focus();
    }

    async function validateCode() {
        const fullCode = codes.join('');
        if (fullCode.length !== 6) {
            error = 'Please enter a 6-digit code';
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            success = true;
            error = '';
        } catch (err) {
            error = 'Invalid code. Please try again.';
            success = false;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        validateCode();
    }
</script>

<div class="min-h-screen flex items-start justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 pt-8 sm:pt-16">
    {#if mounted}
        <div
            in:fly="{{ y: 50, duration: 1000, delay: 200, easing: quintOut }}"
            class="w-full max-w-md space-y-8 p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl mx-4 relative overflow-hidden"
        >
            <div
                in:scale="{{ duration: 800, delay: 500, easing: quintOut }}"
                class="flex flex-col items-center mb-10"
            >
                <div class="w-full max-w-[200px] h-20 relative mb-6">
                    <img
                        src="/optivest-high-resolution-logo-transparent.png"
                        alt="Optivest Logo"
                        class="w-full h-full object-contain"
                    />
                </div>
            </div>

            <div
                in:fade="{{ duration: 800, delay: 800 }}"
                class="text-center space-y-3"
            >
                <h2 class="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                    Two-Factor Authentication
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                    Enter the 6-digit code from your authenticator app
                    <button
                        type="button"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-1 focus:outline-none hover:underline"
                        onclick={() => showTutorial = true}
                    >
                        Need help?
                    </button>
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Session expires in: {formatTime(timeLeft)}
                </p>
            </div>

            <form class="mt-8 space-y-6" onsubmit={handleSubmit}>
                <div class="grid grid-cols-6 gap-1 sm:gap-2 px-2">
                    {#each Array(6) as _, index}
                        <input
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            maxlength="1"
                            bind:value={codes[index]}
                            bind:this={inputRefs[index]}
                            oninput={(e) => handleInput(index, e)}
                            onkeydown={(e) => handleKeyDown(index, e)}
                            onpaste={index === 0 ? handlePaste : null}
                            class="w-full aspect-square text-center text-lg sm:text-xl md:text-2xl font-semibold 
                            border rounded-lg border-gray-300 dark:border-gray-600 
                            text-gray-900 dark:text-white bg-white dark:bg-gray-700
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                            transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    {/each}
                </div>

                {#if error}
                    <p
                        in:fly="{{ y: 20, duration: 300 }}"
                        class="text-red-500 dark:text-red-400 text-sm text-center" 
                        role="alert"
                    >
                        {error}
                    </p>
                {/if}

                {#if success}
                    <p
                        in:scale="{{ duration: 300 }}"
                        class="text-green-500 dark:text-green-400 text-sm text-center" 
                        role="alert"
                    >
                        Code verified successfully!
                    </p>
                {/if}

                <button
                    type="submit"
                    disabled={!codes.every(code => code !== '') || success}
                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent
                           text-sm font-medium rounded-lg text-white 
                           bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                           dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           shadow-md hover:shadow-lg"
                >
                    Verify Code
                </button>

                <p class="text-xs text-center text-gray-500 dark:text-gray-400">
                    Didn't receive the code? 
                    <button
                        type="button"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300
                               font-medium focus:outline-none hover:underline
                               transition-colors duration-200"
                    >
                        Resend
                    </button>
                </p>
            </form>
        </div>
    {/if}
</div>

<Mfatutorial bind:isOpen={showTutorial} />