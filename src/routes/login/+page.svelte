<script>
     import * as Form from '$lib/components/ui/form';
     import { superForm } from 'sveltekit-superforms';
     import { zodClient } from 'sveltekit-superforms/adapters';
     import {formSchema} from '$lib/settings/schema.js';
    import { goto } from '$app/navigation';
    import { Input } from '$lib/components/ui/input';
    import { fly, slide, fade } from 'svelte/transition';

    let {data} = $props();
    const form = superForm(data, { 
        validators: zodClient(formSchema),
        dataType: 'json'  // Ensure nested data structures are handled as JSON
    });
    const { form: formData, enhance } = form;
    console.log(data);
  
    function handleBack() {
      console.log('Back button clicked');
      goto('/');
    }
</script>

<div class="flex w-full h-screen" div in:fly={{ x: -400, duration: 1000 }} out:slide={{ duration: 600 }}>
      <!-- Image Panel Section --> 
  <div class="hidden md:block w-1/2 relative">
    <img 
      src="https://images.unsplash.com/photo-1640197618317-dc379a226fbe?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
      alt="Dashboard Preview" 
      class="w-full h-full object-cover"
    />
    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
      <h3 class="text-xl font-bold mb-2">Manage all your financial tasks using Optivest</h3>
      <p class="text-sm">The one-stop platform for all financial management of small and medium-sized businesses.</p>
    </div>
  </div>

  <!-- Login Form Section -->
  <div class="w-full md:w-1/2 p-8 flex flex-col justify-between" in:fade={{ duration: 300 }}>
    <button
      onclick={handleBack}
      class="text-teal-500 hover:text-teal-600 self-start  ml-auto dark:text-teal-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" s  troke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>

    <div class="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
      <!-- Card Container -->
      <div class="shadow-lg rounded-lg p-8 bg-white dark:bg-gray-800">
        <div class="mb-6 text-center">
          <img src="/optivest-high-resolution-logo-transparent.png" alt="Optivest Logo" class="mx-auto h-16 w-auto" />
        </div>
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Login to your Optivest account</h2>

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
                  class="mt-4 mb-4 h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-teal-400"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
              </div>
              <div class="text-sm">
                <a href="#1" class="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400">Forgot Password?</a>
              </div>
            </div>
  
            <Form.Button type="submit" class="w-full">Login</Form.Button>
          </form>

        <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account? <a href="#1" class="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400">Register Here</a>
        </p>
      </div>
    </div>

    <footer class="text-center text-sm text-gray-500 dark:text-gray-300 mt-8">
      <p>&copy; 2024 Optivest. All rights reserved.</p>
      <div class="mt-2">
        <a href="#1" class="text-teal-500 hover:text-teal-600 dark:text-teal-400">Terms & Conditions</a>
        <span class="mx-2">|</span>
        <a href="#1" class="text-teal-500 hover:text-teal-600 dark:text-teal-400">Privacy Policy</a>
      </div>
    </footer>
  </div>
</div>
