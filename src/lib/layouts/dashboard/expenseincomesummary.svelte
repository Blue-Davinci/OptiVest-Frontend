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
  let currentMonth = expenseIncomeSummary[2]; // October
  let previousMonth = expenseIncomeSummary[1]; // September

  // Calculate income, expenses, and balance
  let income = parseFloat(currentMonth.total_income);
  let expenses = parseFloat(currentMonth.total_expenses);
  let budget = parseFloat(currentMonth.total_budget);
  let balance = calculateBalance(income, budget, expenses);
  $inspect(balance);
  // Previous month's values
  let prevIncome = parseFloat(previousMonth.total_income);
  let prevExpenses = parseFloat(previousMonth.total_expenses);
  let prevBudget = parseFloat(previousMonth.total_budget);

  // Calculate percentage changes
  let incomePercentageChange = calculatePercentageChange(income, prevIncome);
  let expensePercentageChange = calculatePercentageChange(expenses, prevExpenses);
  let previousBalance = calculateBalance(prevIncome, prevBudget, prevExpenses);
  $inspect(previousBalance);
  let budgetPercentageChange = calculatePercentageChange(balance, previousBalance);

</script>


<div class="grid grid-cols-3 gap-6 mb-8">
    <!-- Income Tile -->
    <IncomeTile {getArrowClass}{formatNumber} {income} {prevIncome} {incomePercentageChange}/>
    <!-- Expense Tile -->
    <Expensetile {getArrowClass}{formatNumber} {expenses} {expensePercentageChange}/>
    <!-- My Balance Tile -->
    <Balancestiles {getArrowClass}{formatNumber} {balance} {budgetPercentageChange}/>

</div>
  