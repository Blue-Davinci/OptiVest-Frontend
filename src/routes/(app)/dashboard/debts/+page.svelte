<script>
    import DebtsTileConnector from '$lib/layouts/debts/debtstileconnector..svelte';
    import DebtsNotFound from '$lib/layouts/debts/notfound/debtsnotfound.svelte';
    import { CreditCard,Search} from 'lucide-svelte';
    import DebtCard from '$lib/layouts/debts/debtcard.svelte';
    import CreateDebt from '$lib/layouts/debts/createdebt.svelte';


    let { data } = $props();
    let defaultCurrency = data.userInformation.currency_code;
    let debts = $derived(data?.debtsResponse?.data?.debts ?? []);
    let searchQuery = $state('');
    let expandedDebt = $state(null);
    let fallback = $derived(debts.length === 0);
    $inspect(data);


  </script>

<DebtsTileConnector {debts} />
<CreateDebt {data} {defaultCurrency}/>
<!-- Main Container -->
<div class="max-w-6xl mx-auto p-4">
    

    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <CreditCard class="mr-2" />
      Debts for {data?.userName || 'User'}
    </h1>

    <!-- Responsive Card Container -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700">
      <!-- Header with Search Input -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold dark:text-gray-200">Your Debts Overview</h2>
        
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search debts"
            bind:value={searchQuery}
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
          <Search class="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
  
    <!-- Fallback if no data is available -->
    {#if fallback}
        <DebtsNotFound />
    {/if}
  
    <!-- Debt Cards -->
    {#each debts as debtItem}
        <DebtCard {debtItem} {expandedDebt} {searchQuery}/>
    {/each}
  </div>
</div>
  

<style>

/* Ensure full width coverage */
.max-w-6xl {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
}

</style>
