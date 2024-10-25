<script>
    import { CreditCard, ChevronDown, ArrowLeft, ArrowRight, Info } from 'lucide-svelte';
    import { PieChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';

    let {debts = [], defaultCurrency} = $props();
    $inspect(debts);
    const prepareInterestVsPrincipal = () => {
    // Initialize totals
    let totalInterestPayment = 0;
    let totalPrincipalPayment = 0;

    // Only proceed if debts is an array
    if (Array.isArray(debts)) {
        debts.forEach(debt => {
            totalInterestPayment += parseFloat(debt.total_interest_payment);
            totalPrincipalPayment += parseFloat(debt.total_principal_payment);
        });
    }

    return [
        { name: 'Total Interest Paid', value: totalInterestPayment },
        { name: 'Total Principal Paid', value: totalPrincipalPayment }
    ];
};

function prepareTotalPaymentsAndDebtAmount() {
    let totalPaymentAmount = 0;
    let totalDebtAmount = 0;

    // Only proceed if debts is an array
    if (Array.isArray(debts)) {
        debts.forEach(debt => {
            totalPaymentAmount += parseFloat(debt.total_payment_amount); // Sum total payment amounts
            totalDebtAmount += parseFloat(debt.debt.amount); // Sum each debt's amount
        });
    }

    return [
        { name: 'Total Payment Amount', value: totalPaymentAmount },
        { name: 'Total Debt Amount', value: totalDebtAmount }
    ];
}


    let interestVsPrincipal = prepareInterestVsPrincipal();
    let totalPaymentsAndDebtAmount = prepareTotalPaymentsAndDebtAmount();

    // Enhanced tips array with more detailed information
 const tips = [
        {
            id: 1,
            method: "Snowball Method",
            description: "Pay off your smallest debts first while maintaining minimum payments on larger debts.",
            benefits: [
                "Quick wins boost motivation",
                "Simplified debt management",
                "Psychological advantage"
            ],
            bestFor: "Those who need motivation through quick victories"
        },
        {
            id: 2,
            method: "Avalanche Method",
            description: "Focus on paying off debts with the highest interest rates first.",
            benefits: [
                "Saves more money long-term",
                "Reduces total interest paid",
                "Mathematically optimal"
            ],
            bestFor: "Those focused on minimizing interest payments"
        },
        {
            id: 3,
            method: "Debt Consolidation",
            description: "Combine multiple debts into a single loan with potentially lower interest.",
            benefits: [
                "Single monthly payment",
                "Potentially lower interest rate",
                "Simplified management"
            ],
            bestFor: "Those with multiple high-interest debts"
        }
    ];

    // New state variables for enhanced functionality
    let currentTipIndex = $state(0);
    let selectedMethod = $state(null);
    let showMethodDetails = $state(false);

    // Functions for tip carousel
    const nextTip = () => {
        currentTipIndex = (currentTipIndex + 1) % tips.length;
    };

    const prevTip = () => {
        currentTipIndex = (currentTipIndex - 1 + tips.length) % tips.length;
    };

    // Function to toggle method details
    const toggleMethodDetails = (methodId) => {
        if (selectedMethod === methodId) {
            selectedMethod = null;
            showMethodDetails = false;
        } else {
            selectedMethod = methodId;
            showMethodDetails = true;
        }
    };
</script>

<!-- Top Cards Section --> 
<div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <!-- Main Card -->
        <div class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <CreditCard class="mr-2"></CreditCard>
                <span>Pay Down Total Debt</span>
            </h2>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- First Chart -->
                <div class="flex flex-col items-center h-80">
                    <PieChart
                        data={prepareInterestVsPrincipal()}
                        key="name"
                        value="value"
                        innerRadius={-10}
                        cornerRadius={5}
                        padAngle={0.02}
                        cRange={schemeTableau10}
                        class="w-[220px] h-[220px]"
                    ></PieChart>
                    <div class="text-center mt-4">
                        <p class="font-semibold text-gray-900 dark:text-gray-100">Principal vs Interest</p>
                        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>Principal: {defaultCurrency} {interestVsPrincipal[0].value}</p>
                            <p>Interest: {defaultCurrency} {interestVsPrincipal[1].value}</p>
                        </div>
                    </div>
                </div>

                <!-- Second Chart -->
                <div class="flex flex-col items-center h-80">
                    <PieChart
                        data={prepareTotalPaymentsAndDebtAmount()}
                        key="name"
                        value="value"
                        innerRadius={-20}
                        cornerRadius={5}
                        padAngle={0.02}
                        cRange={schemeTableau10}
                        class="w-[220px] h-[220px]"
                    ></PieChart>
                    <div class="text-center mt-4">
                        <p class="font-semibold text-gray-900 dark:text-gray-100">Payment Progress</p>
                        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>Paid: {defaultCurrency} {totalPaymentsAndDebtAmount[0].value}</p>
                            <p>Remaining: {defaultCurrency} {totalPaymentsAndDebtAmount[1].value}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tips Carousel -->
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mt-8">
                <div class="relative">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">Debt Management Tips</h3>
                        <div class="flex space-x-2">
                            <button 
                                onclick={() => prevTip()}
                                class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                aria-label="Previous tip"
                            >
                                <ArrowLeft size={20}></ArrowLeft>
                            </button>
                            <button 
                                onclick={() => nextTip()}
                                class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                aria-label="Next tip"
                            >
                                <ArrowRight size={20}></ArrowRight>
                            </button>
                        </div>
                    </div>
                    
                    <div class="min-h-[200px]" role="region" aria-label="Debt management tips carousel">
                        {#key currentTipIndex}
                        <div class="space-y-4">
                            <h4 class="font-semibold text-xl text-indigo-600 dark:text-indigo-400">
                                {tips[currentTipIndex].method}
                            </h4>
                            <p class="text-gray-600 dark:text-gray-300">
                                {tips[currentTipIndex].description}
                            </p>
                            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                <h5 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">Key Benefits:</h5>
                                <ul class="list-disc list-inside space-y-1">
                                    {#each tips[currentTipIndex].benefits as benefit}
                                        <li class="text-gray-600 dark:text-gray-400">{benefit}</li>
                                    {/each}
                                </ul>
                            </div>
                            <p class="text-sm text-gray-500 dark:text-gray-400 italic">
                                Best for: {tips[currentTipIndex].bestFor}
                            </p>
                        </div>
                        {/key}
                    </div>

                    <!-- Carousel Indicators -->
                    <div class="flex justify-center space-x-2 mt-4" role="navigation" aria-label="Tips navigation">
                        {#each tips as _, i}
                            <button 
                                onclick={() => currentTipIndex = i}
                                class="w-2 h-2 rounded-full transition-colors duration-200 {i === currentTipIndex ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-gray-300 dark:bg-gray-500'}"
                                aria-label={`Go to tip ${i + 1}`}
                                aria-current={i === currentTipIndex ? 'true' : 'false'}
                            ></button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Payoff Methods Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Info class="mr-2"></Info>
                <span>Payoff Methods</span>
            </h3>
            
            <div class="space-y-4">
                {#each tips as tip}
                    <div class="border dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow">
                        <button
                            class="w-full text-left p-4 flex justify-between items-center text-gray-900 dark:text-gray-100"
                            onclick={() => toggleMethodDetails(tip.id)}
                            aria-expanded={selectedMethod === tip.id ? 'true' : 'false'}
                            aria-controls={`method-details-${tip.id}`}
                        >
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                                <span class="font-semibold">{tip.method}</span>
                            </div>
                            <ChevronDown
                                class={`transform transition-transform duration-200 ${selectedMethod === tip.id ? 'rotate-180' : ''}`}
                            ></ChevronDown>
                        </button>
                        
                        {#if selectedMethod === tip.id}
                            <div 
                                id={`method-details-${tip.id}`}
                                class="p-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600"
                            >
                                <p class="text-gray-600 dark:text-gray-300 mb-3">{tip.description}</p>
                                <div class="space-y-2">
                                    <h4 class="font-semibold text-sm text-gray-700 dark:text-gray-300">Benefits:</h4>
                                    <ul class="list-disc list-inside space-y-1">
                                        {#each tip.benefits as benefit}
                                            <li class="text-sm text-gray-600 dark:text-gray-400">{benefit}</li>
                                        {/each}
                                    </ul>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        <span class="font-medium">Best for:</span> {tip.bestFor}
                                    </p>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    
</style>