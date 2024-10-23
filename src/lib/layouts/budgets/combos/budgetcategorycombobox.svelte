<script>
    import {Check, ChevronsUpDown} from 'lucide-svelte';
    import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import { tick } from "svelte";
  
    // Your data
    const categories = [
      {
        id: 1,
        category: "Technology",
      },
    ];
  
    let open = false;
    let value = "";
  
    // Find the selected value or display a placeholder
    $: selectedValue =
      categories.find((c) => c.category === value)?.category ?? "Select a category...";
  
    // Close popover and focus trigger
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
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
      <Command.Root>
        <Command.Input placeholder="Search category..." />
        <Command.Empty>No category found.</Command.Empty>
        <Command.Group>
          {#each categories as category}
            <Command.Item
              value={category.category}
              onSelect={(currentValue) => {
                value = currentValue;
                closeAndFocusTrigger(ids.trigger);
              }}
            >
              <Check
                class={"mr-2 h-4 w-4 " + (value !== category.category ? "text-transparent" : "")}
              />
              {category.category}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
  