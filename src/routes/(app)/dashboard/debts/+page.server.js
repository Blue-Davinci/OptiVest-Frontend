import {getAllDebts} from '$lib/dataservice/debts/debtDataService.js';


export const load = async ({fetch}) => {
    try{
        let debtsResponse = await getAllDebts({fetch},0,10,'');
        return {
            debts: debtsResponse
        }
    }catch(err){
        console.log("[debLD] ERROR: ", err.message);
        return {
            status: 500,
            error: '[debLD]An error occured while fetching data'
        }
    }
}