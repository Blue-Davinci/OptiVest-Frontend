 import {getAllStocks, getAllBonds} from '$lib/dataservice/investments/investmentDataService.js';


 export const load = async ({ fetch }) => {
        try{
            let stockDataResponse = await getAllStocks({fetch}, 0, 10, '');
            let bondDataResponse = await getAllBonds({fetch}, 0, 10, '');
            return {
                stockData: stockDataResponse,
                bondData: bondDataResponse,
                //currencies: await getCurrencies({fetch}),
                //form: await superValidate(zod(stockSchema))
            }
        }catch(err){
            console.log('[invLD] ERROR: ', err.message);
            return {
                status: 500,
                error: '[invLD]An error occured while fetching data'
            }
        }
 }