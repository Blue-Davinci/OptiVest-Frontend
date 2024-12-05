// updateUserInformation, updates provided information from the user
const updateUserInformation = async(fetchFunc, userData = {}) =>{
    if (!userData) {
        return {
            status: 400,
            message: 'User information is empty.'
        };
    }
    try{
        const response = await fetchFunc(`/api/users`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
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
        console.log("[upuDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[upuDS]An error occured while fetching data'
        }
    }
}

export{
    updateUserInformation
}