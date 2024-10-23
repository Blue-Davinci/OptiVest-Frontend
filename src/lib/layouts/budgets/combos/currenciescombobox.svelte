<script>
  import { Check, SortAsc } from 'lucide-svelte';
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  export let currencyData = {};

  // Convert the currency data into an array of objects
  const currencies = Object.entries(currencyData).map(([code]) => ({
    value: code,
    label: code
  }));

  let open = false;
  let value = "";
  let searchTerm = ""; // Reactive variable for search input

  $: selectedValue =
    currencies.find((c) => c.value === value)?.label ?? "Select a currency...";

  // Reactive variable to filter currencies based on search term
  $: filteredCurrencies = currencies.filter(currency =>
    currency.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function closeAndFocusTrigger(triggerId) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[200px] justify-between"
    >
      {selectedValue}
      <SortAsc class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input
        placeholder="Search currency..."
        class="h-9"
        bind:value={searchTerm} 
      />
      <Command.Empty>No currency found.</Command.Empty>
      <Command.Group>
        {#each filteredCurrencies as currency}
          <Command.Item
            value={currency.value}
            onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                value !== currency.value && "text-transparent"
              )}
            />
            {currency.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
