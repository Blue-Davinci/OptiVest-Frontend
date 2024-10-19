import {deleteAuthentication} from '$lib/helpers/auths';
import {redirect,error} from '@sveltejs/kit';

export const actions = {
    default: ({cookies}) =>{
        if(deleteAuthentication(cookies)){
            console.log("logging out...")
            return redirect(303, '/');
        }else{
            error(400,{
                description: "an error occurred while processing your request",
                error: "could not log user out",
            });
        }
    }
}
