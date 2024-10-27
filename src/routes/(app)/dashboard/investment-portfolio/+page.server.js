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

export const actions = {
    stockinvestment : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[geAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
        }
        const form = await superValidate(request, zod(stockSchema));
        if (!form.valid) {
            return fail(400,{form});
        }

        try{
            const response = await fetch(VITE_API_BASE_INVESTMENTS_STOCKS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(form.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // if it's an array, iterate over it and set the error for each field
                if (Array.isArray(errorData.error)){
                    for (let field in errorData.error){
                        setError(form, field, errorData.error[field]);
                    }
                }else{
                    return message(form, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return {
                message: 'Stock investment added successfully',
                data: responseData,
                success: true
            };
        }catch(err){
            console.log('[geAC] ERROR: ', err.message);
            return {
                status: 500,
                message: 'An error occured while saving the stock investment'
            };
        }

    },
    bondinvestment : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[geAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
        }
        const form = await superValidate(request, zod(bondSchema));
        if (!form.valid) {
            return fail(400,{form});
        }

        try{
            const response = await fetch(VITE_API_BASE_INVESTMENTS_BONDS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(form.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // if it's an array, iterate over it and set the error for each field
                if (Array.isArray(errorData.error)){
                    for (let field in errorData.error){
                        setError(form, field, errorData.error[field]);
                    }
                }else{
                    return message(form, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return {
                message: 'Bond investment added successfully',
                data: responseData,
                success: true
            };
        }catch(err){
            console.log('[geAC] ERROR: ', err.message);
            return {
                status: 500,
                message: 'An error occured while saving the bond investment'
            };
        }
    },
    alternativeinvestment : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[geAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
        }
        const form = await superValidate(request, zod(investmentSchema));
        if (!form.valid) {
            return fail(400,{form});
        }

        try{
            const response = await fetch(VITE_API_BASE_INVESTMENTS_ALTERNATIVE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(form.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // if it's an array, iterate over it and set the error for each field
                if (Array.isArray(errorData.error)){
                    for (let field in errorData.error){
                        setError(form, field, errorData.error[field]);
                    }
                }else{
                    return message(form, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return {
                message: 'Alternative investment added successfully',
                data: responseData,
                success: true
            };
        }catch(err){
            console.log('[geAC] ERROR: ', err.message);
            return {
                status: 500,
                message: 'An error occured while saving the alternative investment'
            };
        }
    }
};
