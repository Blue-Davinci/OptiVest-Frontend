
//import { error } from '@sveltejs/kit';


export const load = async ({fetch}) => {
    // get our auth
    try{
        const response = await fetch('/api/finmanager/goals/progression', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return {
                status: response.status,
                error: errorData.error
            }
        }
        let responseData = await response.json();
        console.log('API Response:', responseData);
        return {
            data: responseData
        }
    }catch(err){
        console.log("[ggpDS] ERROR: ", err.Error());
        return {
            status: 500,
            error: '[ggpDS]An error occured while fetching data'
        }
    }
}