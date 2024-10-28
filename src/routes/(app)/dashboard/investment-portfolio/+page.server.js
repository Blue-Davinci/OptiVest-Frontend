import {
	VITE_API_BASE_INVESTMENTS_STOCKS,
	VITE_API_BASE_INVESTMENTS_BONDS,
	VITE_API_BASE_INVESTMENTS_ALTERNATIVE
} from '$env/static/private';
import {
	getAllStocks,
	getAllBonds,
	getAllAlternativeInvestments,
	getInvestmentAnalysisSummary
} from '$lib/dataservice/investments/investmentDataService.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { stockSchema, bondSchema, investmentSchema } from '$lib/settings/schema.js';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	try {
		let stockDataResponse = await getAllStocks({ fetch }, 0, 10, '');
		let bondDataResponse = await getAllBonds({ fetch }, 0, 10, '');
		let alternativeDataResponse = await getAllAlternativeInvestments({ fetch }, 0, 10, '');
		let investmentAnalysisResponse = await getInvestmentAnalysisSummary({ fetch });
		let stockForm = await superValidate(zod(stockSchema));
		let bondForm = await superValidate(zod(bondSchema));
		let investmentForm = await superValidate(zod(investmentSchema));
		return {
			stockData: stockDataResponse,
			bondData: bondDataResponse,
			alternativeData: alternativeDataResponse,
			investmentAnalysis: investmentAnalysisResponse,
			stockForm,
			bondForm,
			investmentForm
		};
	} catch (err) {
		console.log('[invLD] ERROR: ', err.message);
		return {
			status: 500,
			error: '[invLD]An error occured while fetching data'
		};
	}
};

/*async function delayedFunction() {
    console.log('Waiting for 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for 3 seconds
    return true
  }*/
export const actions = {
    stockinvestment : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        const stockForm = await superValidate(request, zod(stockSchema));
        if (!auth){
            console.log('[geAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
        }
        if (!stockForm.valid) {
            return fail(400,{stockForm});
        }
        console.log('[geAC] stockForm: ', stockForm);
        try{
            const response = await fetch(VITE_API_BASE_INVESTMENTS_STOCKS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(stockForm.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // if it's an array, iterate over it and set the error for each field
                if (Array.isArray(errorData.error)){
                    for (let field in errorData.error){
                        setError(stockForm, field, errorData.error[field]);
                    }
                }else{
                    return message(stockForm, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return message(stockForm, {
                message: 'Stock investment added successfully',
                data: responseData.stock,
                success: true
            })
        }catch(err){
            console.log('[geAC] ERROR: ', err.message);
            return fail(500, { stockForm, error: 'An unexpected error occurred' });
        }

    },
    bondinvestment : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[geAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
        }
        const bondForm = await superValidate(request, zod(bondSchema));
        if (!bondForm.valid) {
            return fail(400,{bondForm});
        }
        try{
            const response = await fetch(VITE_API_BASE_INVESTMENTS_BONDS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(bondForm.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // if it's an array, iterate over it and set the error for each field
                if (Array.isArray(errorData.error)){
                    for (let field in errorData.error){
                        setError(bondForm, field, errorData.error[field]);
                    }
                }else{
                    return message(bondForm, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return message(bondForm, {
                message: 'Bond investment added successfully',
                data: responseData.bond,
                success: true
            })
        }catch(err){
            console.log('[geAC] ERROR: ', err.message);
            return fail(500, { bondForm, error: 'An unexpected error occurred' });
        }
    },
    alternativeinvestment : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[geAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
        }
        const alternativeForm = await superValidate(request, zod(investmentSchema));
        if (!alternativeForm.valid) {
            return fail(400,{alternativeForm});
        }

        try{
            const response = await fetch(VITE_API_BASE_INVESTMENTS_ALTERNATIVE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(alternativeForm.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // if it's an array, iterate over it and set the error for each field
                if (Array.isArray(errorData.error)){
                    for (let field in errorData.error){
                        setError(alternativeForm, field, errorData.error[field]);
                    }
                }else{
                    return message(alternativeForm, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return message(alternativeForm, {
                message: 'Alternative investment added successfully',
                data: responseData.alternative,
                success: true
            })
        }catch(err){
            console.log('[geAC] ERROR: ', err.message);
            return {
                status: 500,
                message: 'An error occured while saving the alternative investment'
            };
        }
    }
};
