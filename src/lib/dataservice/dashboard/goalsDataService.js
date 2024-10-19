
const getGoalProgressions = async()=>{
    let goalProgressionURL = '/api/finmanager/goals/progression';
    try{
        const response = await fetch(goalProgressionURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return {
                success: false,
                status: response.status,
                error: errorData.error
            }
        }
        let responseData = await response.json();
        return {
            success: true,
            status: response.status,
            data: responseData
        }
    }catch(err){
        console.log("[ggpDS] ERROR: ", err.Error());
        return {
            success: false,
            status: 500,
            error: '[ggpDS]An error occured while fetching data'
        }
    }
}


export{
    getGoalProgressions
}