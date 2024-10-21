<script>
  import { AreaChart } from 'layerchart';

  // Incoming data from props
  let { chartData } = $props();

  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  // Helper function to map month names to numbers (January = 0, December = 11)
  const monthMap = {
    "January": 0, "February": 1, "March": 2, "April": 3, "May": 4,
    "June": 5, "July": 6, "August": 7, "September": 8, "October": 9,
    "November": 10, "December": 11
  };

  // Ensure data is correctly transformed for the chart
  let processedChartData = chartData.map(item => {
    // Default to 0 if parsing fails or the value is missing
    let income = parseFloat(item.income) || 0;
    let expenses = parseFloat(item.expenses) || 0;

    // Get the correct month number using the monthMap
    let monthNumber = monthMap[item.month] || 0; // Fallback to January (0) if month not found

    return {
      date: new Date(currentYear, monthNumber, 1),  // Use current year and month number
      income: income,
      expenses: expenses
    };
  });

  // Check the processed data in the console
  console.log("Processed Chart Data: ", processedChartData);
</script>

<div class="text-gray-500 dark:text-gray-300 w-full h-full">
  <p class="text-lg font-semibold mb-4 text-center">Performance Chart</p>

  <div class="chart-container">
    {#if processedChartData && processedChartData.length > 0}
      <div class="h-[400px] p-4 border rounded bg-white dark:bg-gray-800">
        <AreaChart
          data={processedChartData} 
          x="date"  
          series={[
            {
              key: "income",  // Plot income
              color: "hsl(218, 85%, 55%)",  // Light blue for income
            },
            {
              key: "expenses",  // Plot expenses
              color: "hsl(10, 80%, 55%)",  // Red for expenses
            },
          ]}
          seriesLayout="stackDiverging"  
          props={{
            xAxis: {
              class: 'text-gray-800 dark:text-gray-200',  // Customize x-axis label color
            },
            yAxis: {
              class: 'text-gray-800 dark:text-gray-200',  // Customize y-axis label color
            }
          }}
        />
      </div>
    {:else}
      <p>No data available for the chart.</p>
    {/if}
  </div>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 640px) {
    .chart-container {
      height: 320px;
    }
  }

  @media (min-width: 768px) {
    .chart-container {
      height: 400px;
    }
  }
</style>
