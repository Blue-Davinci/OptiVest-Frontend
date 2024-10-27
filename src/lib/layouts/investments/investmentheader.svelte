<script>
import {
    Briefcase,
    BadgeDollarSign,
} from 'lucide-svelte';

let {data, defaultCurrency} = $props();
</script>

<header class="bg-white shadow-lg dark:bg-gray-800">
    <div class="mx-auto max-w-7xl px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <h1 class="text-4xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
            Investment Portfolio
          </h1>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Briefcase class="text-purple-500" size={18} />
              <span class="font-medium text-gray-600 dark:text-gray-400">
                Welcome back, {data.userInformation?.first_name ?? 'User'}
              </span>
            </div>
            <div class="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div class="flex items-center gap-2">
              <BadgeDollarSign class="text-purple-500" size={18} />
              <span class="font-medium text-gray-600 dark:text-gray-400">
                {defaultCurrency}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
            <p class="font-medium text-purple-600 dark:text-purple-400">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          {#if data.userInformation?.profile_url}
            <img
              src={data.userInformation.profile_url}
              alt="Profile"
              class="h-14 w-14 rounded-full ring-2 ring-purple-500 transition-transform hover:scale-105"
            />
          {/if}
        </div>
      </div>
    </div>
  </header>