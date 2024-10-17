import { VITE_API_BASE_URL_ACTIVATION } from '$env/static/private';
import { tokenSchema } from '$lib/settings/schema';
import {fail} from '@sveltejs/kit';

export const load = async ({ url, fetch }) => {
	console.log('In Load');
	const activation_url = VITE_API_BASE_URL_ACTIVATION;
	console.log('Url: ', activation_url);
	const token = url.searchParams.get('token');
	if (token === null || token === '') {
		return {
			status: 'failure',
			message: 'Token is required',
			info: 'Please check your email and click on the link provided'
		};
	}
	try {
		const result = tokenSchema.parse(token);
		console.log('Token Zod:', result);
	} catch (err) {
		const fieldErrors = err.flatten();
		console.log(fieldErrors);
		return {
			status: 'failure',
			message: 'Invalid Token',
			info: 'Please check your email and click on the link provided'
		};
	}
	//console.log(">>>Token: ", token);
    try{
        let response = await fetch(`${activation_url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
    
        if (!response.ok) {
            let data = await response.json();
            console.log('Back from API, we got an error: ', data);
            return {
                status: 'failure',
                message: 'Invalid Token',
                info: data.error
            };
        }
        let data = await response.json();
        let { user } = data;
        console.log('Verification success: ', data);
        return { 
            status: 'success',
            message: 'Verification Successful',
            info: user
         };
    }catch(error){
        console.log('Error: ', error);
        return fail(400, {
            title: 'Verification Failed',
            message: 'An error occurred while verifying your activation request',
            info: 'Please recheck your token and try again'
          });
    }
};
