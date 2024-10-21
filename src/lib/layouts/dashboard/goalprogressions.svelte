<script>
    import { TargetIcon } from 'lucide-svelte'; 
    let { getProgressColor, goalsData } = $props();

    function convertToFixed(num) {
        let parsedNum = parseFloat(num);
        return parsedNum.toFixed(2);
    }
  </script>
  
  <div class="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
    <div class="flex items-center mb-4">
      <!-- Lucide icon for visual enhancement -->
      <TargetIcon class="w-6 h-6 text-blue-500 dark:text-blue-400" />
      <h2 class="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
        Savings Goals
      </h2>
    </div>
  
    <!-- Scrollable container for the goals, allowing more than 3 goals to fit -->
    <div class="max-h-full overflow-y-auto space-y-6">
      {#each goalsData as goal}
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
          <!-- Goal Name and Progress Percentage -->
          <div class="mb-2 flex items-center justify-between">
            <span class="font-medium text-gray-700 dark:text-gray-300">
              {goal.goals.name}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {convertToFixed(goal.progress_percentage)}%
            </span>
          </div>
  
          <!-- Progress Bar with dynamic color based on percentage -->
          <div class="mb-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
            <div
              class="{getProgressColor(goal.progress_percentage)} h-2 rounded-full"
              style="width: {goal.progress_percentage}%"
            ></div>
          </div>
  
          <!-- Current and Target Amount with improved badge -->
          <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Current: ${goal.goals.current_amount}</span>
            <span
              class="badge rounded-md bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-3 py-1 font-semibold"
            >
              Target: ${goal.goals.target_amount}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Styling to ensure scrollability and custom scrollbar appearance -->
  <style>
    .max-h-80 {
      max-height: 320px; /* Controls how many goals can be displayed before scrolling */
    }
  
    /* Custom scrollbars for light and dark modes */
    .max-h-80::-webkit-scrollbar {
      width: 6px;
    }
    .max-h-80::-webkit-scrollbar-thumb {
      background-color: rgba(75, 85, 99, 0.8); /* dark gray */
      border-radius: 9999px;
    }
    .max-h-80::-webkit-scrollbar-thumb:hover {
      background-color: rgba(55, 65, 81, 0.8); /* darker gray */
    }
  </style>
  