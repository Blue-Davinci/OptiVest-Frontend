<script>
  import InvestmentHeader from '$lib/layouts/investments/investmentheader.svelte';
  import InvestmentTileConnector from '$lib/layouts/investments/investmenttileconnector.svelte';
  import InvestmentRedFlag from '$lib/layouts/investments/investmentredflag.svelte';
  import Investmentcharts from '$lib/layouts/investments/investmentcharts.svelte';
  import StockInvestmentSection from '$lib/layouts/investments/stockinvestmentsection.svelte';
  import BondInvestmentSection from '$lib/layouts/investments/bondinvestmentsection.svelte';
  import AlternativeInvestmentSection from '$lib/layouts/investments/alternativeinvestmentsection.svelte';
  import InvestmentLlmanAlysis from '$lib/layouts/investments/investmentllmanalysis.svelte';


	let { data } = $props();
	let defaultCurrency = $state(data.userInformation.currency_code);
	let alternativeInvestments = $derived(data?.alternativeData?.data?.alternative ?? []);
	let bondInvestments = $derived(data?.bondData?.data?.bond ?? []);
	let stockInvestments = $derived(data?.stockData?.data?.stock ?? []);
	let investmentAnalysis = $derived(data?.investmentAnalysis?.data?.llm_analysis ?? {});
  $inspect(data);
	// Add these state variables after your existing ones
	let stockSearchQuery = $state('');
	let bondSearchQuery = $state('');
	let altSearchQuery = $state('');

	function filterStocks(stocks) {
		return stocks.filter(
			(stock) =>
				stock.stock.stock_symbol.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
				stock.stock.sector.toLowerCase().includes(stockSearchQuery.toLowerCase())
		);
	}

	function filterBonds(bonds) {
		return bonds.filter((bond) =>
			bond.bond.bond_symbol.toLowerCase().includes(bondSearchQuery.toLowerCase())
		);
	}

	function filterAlternatives(alts) {
		return alts.filter(
			(alt) =>
				alt.alternative.investment_name.toLowerCase().includes(altSearchQuery.toLowerCase()) ||
				alt.alternative.investment_type.toLowerCase().includes(altSearchQuery.toLowerCase())
		);
	}

	function calculateTotalPortfolioValue() {
		const stockValue = stockInvestments.reduce(
			(acc, stock) => acc + parseFloat(stock.total_transactions_sum || 0),
			0
		);
		const bondValue = bondInvestments.reduce(
			(acc, bond) => acc + parseFloat(bond.total_transactions_sum || 0),
			0
		);
		const altValue = alternativeInvestments.reduce(
			(acc, alt) => acc + parseFloat(alt.total_valuation_sum || 0),
			0
		);
		return stockValue + bondValue + altValue;
	}

	// Calculate total portfolio value
	const totalPortfolioValue = calculateTotalPortfolioValue();

	// Format currency
	const formatCurrency = (amount) => {
		if (!amount || isNaN(amount)) return '$0.00';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: defaultCurrency
		}).format(amount);
	};

	// Format percentage
	const formatPercentage = (value) => {
		if (!value || isNaN(value)) return '0.00%';
		return `${(parseFloat(value) * 100).toFixed(2)}%`;
	};

	// Format date
	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	// Safe access to nested objects
	const safeGet = (obj, path, defaultValue = null) => {
		try {
			return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
		} catch {
			return defaultValue;
		}
	};

	// Get performance color class
	const getPerformanceColorClass = (value) => {
		if (!value || isNaN(value)) return 'text-gray-500';
		return parseFloat(value) >= 0 ? 'text-emerald-500' : 'text-rose-500';
	};

  // Add smooth transitions for data updates
  $effect(() => {
    // Trigger animations when data changes
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
      el.classList.add('animate-fade-in');
      setTimeout(() => el.classList.remove('animate-fade-in'), 300);
    });
  });
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
	<!-- Header -->
  <InvestmentHeader {data} />

	<div class="mx-auto max-w-7xl space-y-8 px-4 py-8">
    <InvestmentTileConnector {formatCurrency} {formatDate} {formatPercentage} {safeGet} {totalPortfolioValue }  {investmentAnalysis}/>
		<!-- Red Flags Section (if exists) -->
		<InvestmentRedFlag {formatCurrency} {formatPercentage} {safeGet} {investmentAnalysis} />
    <!-- Main Charts -->
		<Investmentcharts {stockInvestments} {bondInvestments} {alternativeInvestments} {calculateTotalPortfolioValue} {formatCurrency} {formatPercentage} {safeGet} />
		<!-- Stock Investments -->
		<StockInvestmentSection  {formatCurrency} {formatPercentage} {stockInvestments} {stockSearchQuery}  {getPerformanceColorClass} {filterStocks} />
		<!-- Bond Investments -->
		<BondInvestmentSection {formatCurrency} {formatPercentage} {bondInvestments} {bondSearchQuery} {filterBonds} {formatDate}/>
		<!-- Alternative Investments -->
		<AlternativeInvestmentSection {formatCurrency} {formatPercentage} {alternativeInvestments} {altSearchQuery} {filterAlternatives} {formatDate} />

		<!-- LLM Analysis -->
		<InvestmentLlmanAlysis {investmentAnalysis} {formatPercentage} {getPerformanceColorClass } />
	</div>
</main>

<style>
  /* Add custom animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Add custom scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: theme('colors.gray.100');
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: theme('colors.purple.500');
    border-radius: 4px;
  }

</style>
