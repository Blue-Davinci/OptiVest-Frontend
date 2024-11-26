<script>
import {ArrowDown, ArrowUp, MoreHorizontal} from 'lucide-svelte';
import IncomeTile from '$lib/layouts/dashboard/tiles/incometile.svelte';
import Expensetile from '$lib/layouts/dashboard/tiles/expensetile.svelte';
import Balancestiles from '$lib/layouts/dashboard/tiles/balancestiles.svelte';
let {expenseIncomeSummary} = $props();

// formatNumber function to format numbers with commas
function formatNumber(value) {
    return parseFloat(value).toLocaleString();
  }

  // calculateBalance function to calculate the balance
  function calculateBalance(income, budget, expenses) {
    return income - (budget - expenses);
  }

  // calculatePercentageChange function to calculate the percentage change between two values
  function calculatePercentageChange(current, previous) {
    if (previous === 0) return 0; // Avoid division by zero
    return ((current - previous) / previous) * 100;
  }

  // getArrowClass function to determine the color of the arrow
  function getArrowClass(percentage) {
    if (percentage > 0) return 'text-green-500';
    if (percentage < 0) return 'text-red-500';
    return 'text-yellow-500';
  }


  // Fetching current and previous month data
  let currentMonth = 0
  let previousMonth = 0
  // if expenseIncomeSummary is not empty, set currentMonth and previousMonth
  if (expenseIncomeSummary.length > 0) {
     currentMonth = expenseIncomeSummary[2]; // October
    previousMonth = expenseIncomeSummary[1]; // September
  }

// Safely parse values, defaulting to 0 if invalid or not available
let income = isNaN(parseFloat(currentMonth?.total_income)) ? 0 : parseFloat(currentMonth?.total_income);
let expenses = isNaN(parseFloat(currentMonth?.total_expenses)) ? 0 : parseFloat(currentMonth?.total_expenses);
let budget = isNaN(parseFloat(currentMonth?.total_budget)) ? 0 : parseFloat(currentMonth?.total_budget);

// Calculate balance
let balance = calculateBalance(income, budget, expenses);
$inspect(balance);

// Safely handle previous month's values
let prevIncome = isNaN(parseFloat(previousMonth?.total_income)) ? 0 : parseFloat(previousMonth?.total_income);
let prevExpenses = isNaN(parseFloat(previousMonth?.total_expenses)) ? 0 : parseFloat(previousMonth?.total_expenses);
let prevBudget = isNaN(parseFloat(previousMonth?.total_budget)) ? 0 : parseFloat(previousMonth?.total_budget);


  // Calculate percentage changes
  let incomePercentageChange = calculatePercentageChange(income, prevIncome);
  let expensePercentageChange = calculatePercentageChange(expenses, prevExpenses);
  let previousBalance = calculateBalance(prevIncome, prevBudget, prevExpenses);
  $inspect(previousBalance);
  let budgetPercentageChange = calculatePercentageChange(balance, previousBalance);

</script>

  
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <!-- Income Tile -->
  <IncomeTile {getArrowClass}{formatNumber} {income} {prevIncome} {incomePercentageChange} />
  
  <!-- Expense Tile -->
  <Expensetile {getArrowClass}{formatNumber} {expenses} {expensePercentageChange} />
  
  <!-- My Balance Tile -->
  <Balancestiles {getArrowClass}{formatNumber} {balance} {budgetPercentageChange} />
</div>
