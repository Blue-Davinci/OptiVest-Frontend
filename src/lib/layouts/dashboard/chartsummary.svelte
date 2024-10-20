<script>
    import { Chart, Svg, Axis, Bars, Tooltip, Rule } from 'layerchart';
    import { scaleBand } from 'd3-scale'; // Layerchart uses d3 for scales
    let { chartData } = $props();
    console.log("Chart Data: ", chartData, " || Chart Data Length: ", chartData.length);
  </script>
  
  <!-- Chart container with explicit height for LayerCake -->
  <div class="text-gray-700 dark:text-gray-200 w-full">
    <p class="text-xl font-bold mb-4 text-center">Monthly Performance Chart</p>
    
    <!-- Explicit height on this div to satisfy LayerCake's requirement -->
    <div class="chart-container">
      {#if chartData && chartData.length > 0}
        <Chart
          data={chartData}
          x="month"
          xScale={scaleBand().padding(0.3)}
          y={["income", (d) => d.expenses]}
          yNice={4}
          padding={{ left: 48, bottom: 40, right: 16 }} 
          tooltip={{ mode: "bisect-x" }}
        >
          <Svg>
            <!-- Left Y-axis with gridlines -->
            <Axis
              placement="left"
              grid
              rule
              format={(d) => `$${Math.abs(d)}`}
              class="text-gray-600 dark:text-gray-400"
              ticks={5} 
              line={{ stroke: "gray", strokeWidth: 1 }} 
              tickSize={6} 
              tickPadding={10} 
              tickFormat={(d) => `$${Math.abs(d).toLocaleString()}`} 
              tickClass="text-sm font-medium text-gray-600 dark:text-gray-400"
              gridLine={{
                stroke: "gray",
                strokeWidth: 0.5,
                strokeDasharray: "2 2"  
              }}
            />
            
            <!-- Bottom X-axis for months -->
            <Axis
              placement="bottom"
              format={(d) => d}
              class="text-gray-600 dark:text-gray-400"
              tickClass="text-sm font-medium text-gray-600 dark:text-gray-400"
              line={{ stroke: "gray", strokeWidth: 1 }} 
              tickSize={6} 
              tickPadding={8} 
              tickRotate={-20} 
            />
  
            <!-- Bars for income (positive) -->
            <Bars
              y="income"
              radius={4}
              rounded="top"
              strokeWidth={1}
              class="fill-blue-500 hover:fill-blue-600 transition-colors duration-300"
              opacity={0.8} 
            />
  
            <!-- Bars for expenses (negative) --> 
            <Bars
              y={(d) => d.expenses}
              radius={4}
              rounded="bottom"
              strokeWidth={1}
              class="fill-red-400 hover:fill-red-500 transition-colors duration-300"
              opacity={0.8}
            />
  
            <!-- Zero line (rule) -->
            <Rule y={0} strokeWidth={1.5} strokeDasharray="4 2" class="stroke-gray-300 dark:stroke-gray-600" />
          </Svg>
          
          <!-- Tooltip to display values -->
          <Tooltip.Root let:data class="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg">
            <Tooltip.Header class="text-gray-900 dark:text-gray-100 font-semibold">{data.month}</Tooltip.Header>
            <Tooltip.List class="text-gray-800 dark:text-gray-200">
              <Tooltip.Item label="Income" value={`$${data.income.toLocaleString()}`} />
              <Tooltip.Item label="Expenses" value={`$${Math.abs(data.expenses).toLocaleString()}`} />
            </Tooltip.List>
          </Tooltip.Root>
        </Chart>
      {:else}
        <p class="text-center">No data available for the chart.</p>
      {/if}
    </div>
  </div>
  
  <style>
    /* Ensure the chart container has defined width and height */
    .chart-container {
      width: 100%;
      height: 300px; /* Explicit height for LayerCake compatibility */
      position: relative;
    }
  
    /* Adjust responsive heights */
    @media (min-width: 640px) {
      .chart-container {
        height: 350px;
      }
    }
  
    @media (min-width: 768px) {
      .chart-container {
        height: 450px;
      }
    }
  </style>
  