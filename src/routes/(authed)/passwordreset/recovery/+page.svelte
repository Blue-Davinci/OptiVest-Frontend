<script>
import * as Form from '$lib/components/ui/form';
import { toastManager } from '$lib/helpers/utilities.js';
import {
    TOAST_TYPE_ERROR,
    TOAST_TYPE_SUCCESS,
} from '$lib/settings/constants.js';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { emailSchema } from '$lib/settings/schema.js';
import { goto } from '$app/navigation';
import { Input } from '$lib/components/ui/input';
import { fly } from 'svelte/transition';

let { data } = $props();
const form = superForm(data.form, {
    validators: zodClient(emailSchema),
    dataType: 'json',
    onUpdated({ form }) {
        if (form.message) {
            if (form.message.status === 'success') {
                toastManager(TOAST_TYPE_SUCCESS, form.message.message);
                goto('/login');
            } else {
                toastManager(TOAST_TYPE_ERROR, form.message.message);
            }
        }
    }
});
const { form: formData, enhance, message, delayed } = form;

function handleBack() {
    goto('/');
}
</script>

<div class="mt-3 flex h-screen w-full" transition:fly|global={{ y: -200, duration: 300 }}>
    <!-- Left Image Panel -->
    <div class="relative hidden md:flex md:w-1/2">
        <img
            src="https://i.ibb.co/XSjw91G/Untitled-design-4.png"
            alt="Password Recovery"
            class="h-full w-full object-cover"
        />
        <!-- Updated text section with new quote -->
        <div class="absolute bottom-0 left-0 right-0 rounded-t-lg bg-white bg-opacity-80 p-6 shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">Account Amnesia?</h3>
            <p class="mt-2 text-gray-600">
                Welcome to the "I swear I remember my password" support group! Don't worry, even Einstein 
                would probably forget his password in today's digital jungle. Let's get you back into 
                your account faster than you can say "password123" (which, by the way, should never be 
                your actual password!)
            </p>
        </div>
    </div>

    <!-- Form Section -->
    <div class="flex w-full flex-col justify-between p-8 md:w-1/2">
        <!-- Back button -->
        <button
            onclick={handleBack}
            class="ml-auto self-start text-teal-500 hover:text-teal-600 dark:text-teal-400"
        >
            Back
        </button>

        <!-- Reset Form Section -->
        <div class="mx-auto flex w-full max-w-md flex-grow flex-col justify-center">
            <div class="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                <h2 class="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Recover Your Account
                </h2>

                <!-- New Tips Section -->
                <div class="mb-6 rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20">
                    <h4 class="text-sm font-semibold text-teal-800 dark:text-teal-200">Quick Tips:</h4>
                    <ul class="mt-2 text-sm text-teal-700 dark:text-teal-300">
                        <li class="flex items-center space-x-2">
                            <span>•</span>
                            <span>Check your spam folder for the reset email</span>
                        </li>
                        <li class="flex items-center space-x-2">
                            <span>•</span>
                            <span>Reset link expires in 30 minutes</span>
                        </li>
                        <li class="flex items-center space-x-2">
                            <span>•</span>
                            <span>Use the email associated with your account</span>
                        </li>
                    </ul>
                </div>

                <!-- Form using shadcn-svelte Form components -->
                <form method="POST" use:enhance>
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

                    <Form.Button type="submit" class="mt-4 w-full" disabled={$delayed}>
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
                            Sending reset link...
                        {:else}
                            Send Reset Link
                        {/if}
                    </Form.Button>
                </form>

                <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Remembered your password? <a
                        href="/login"
                        class="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400">Login Here</a
                    >
                </p>
            </div>
        </div>
    </div>
</div>