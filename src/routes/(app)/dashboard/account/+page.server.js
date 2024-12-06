import {VITE_API_BASE_URL_ACCOUNT, VITE_API_BASE_URL_MFA_VERIFY} from '$env/static/private';
import {updateUserInformation} from '$lib/dataservice/users/usersDataService.js'
import { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } from '$env/static/private';
import ImageKit from "imagekit";
import { avatarSchema, avatarUrlSchema, totpSchema } from '$lib/settings/schema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, fail,message } from 'sveltekit-superforms';
import { checkAuthentication, updateAuthentication } from '$lib/helpers/auths';
import { redirect } from '@sveltejs/kit';

const imageKit = new ImageKit({
    publicKey : IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT
})

export const load = async ({fetch, cookies}) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/account`);
    }
    try{
        const response = await fetch(VITE_API_BASE_URL_ACCOUNT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            console.log('GAIP Error Server: API Response:', errorData);
            return {
                status: response.status,
                error: errorData.error
            };
        }
        let responseData = await response.json();
        let avatarForm = await superValidate(zod(avatarSchema));
        let avatarUrlForm = await superValidate(zod(avatarUrlSchema));
        let totpForm = await superValidate(zod(totpSchema));
        console.log('GBLEIP Server: API Response:', responseData);
        return {
            success: true,
            data: responseData,
            avatarForm,
            avatarUrlForm,
            totpForm
        };
    }catch(err){
        console.log("GAIP-SE error: ", err);
        return {
            status: 500,
            error: "An error occured while fetching data"
        };
    }
}

export const actions = {
    uploadAvatarFile: async ({request,fetch, cookies}) => {
        console.log('GAIP Server: Default Action'); 
        const formData = await request.formData();
        console.log('GAIP Server: Form Data:', formData);
        let avatarForm = await superValidate(formData, zod(avatarSchema));
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/account`);
        }
        if (!avatarForm.valid){
            console.log('GAIP Server ERROR Validation: Avatar Form:', avatarForm);
            return fail(400, { avatarForm });
        }
        console.log('GBLEIP Server: Avatar Form:', avatarForm);
        // convert file to base 64
        const file = avatarForm.data.image
        const fileArrayBuffer = await file.arrayBuffer();
        const base64 = `data:${file.type};base64,${Buffer.from(fileArrayBuffer).toString('base64')}`;
        try{
            // try and upload the file
            const response = await imageKit.upload({
                file: base64,
                fileName: `avatar_${Date.now()}`
            })
            console.log("Response:", response);
            let imgURL = response.url
            let payload = {
                "profile_avatar_url": imgURL
            }
            // .profile_url
            // update user using updateUser dataservice
            let imageWorkerResponse = await imageWorker(fetch, payload, cookies)
            if(!imageWorkerResponse.success){
                return message(avatarForm, imageWorkerResponse);
            }
            return message(avatarForm, {
                message: 'Avatar successfully updated',
                success: true
            });
        }catch(err){
            console.log("GAIP-AU-SE error: ", err);
            return {
                status: 500,
                error: "An error occured while updating data"
            };
        }
    },
    uploadAvatarURL: async({request, fetch, cookies})=>{
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/account`);
        }
        const avatarUrlForm = await superValidate(request,zod(avatarUrlSchema))
        if (!avatarUrlForm.valid) {
            return fail(400,{avatarUrlForm});
          }
        console.log( " || Avatar URL:", avatarUrlForm);
        const imageUrl = avatarUrlForm.data.imageUrl;
        // proceed  to upload
        try{
            let uploadResponse =  await imageKit.upload({
                file: imageUrl,
                fileName: `avatar_${Date.now()}`
            });
            console.log("Image URL: ", uploadResponse.url);
            let payload = {
                "profile_avatar_url": uploadResponse.url
            }
            // invoke the helper
            let imageWorkerResponse = await imageWorker(fetch, payload, cookies)
            if(!imageWorkerResponse.success){
                return message(avatarUrlForm, imageWorkerResponse);
            }
            return message(avatarUrlForm, {
                message: 'Avatar URL created successfully!',
                success: true
            });
        }catch(err){
            console.log('GBLEIP-SE error: ', err);
            return {
                status: 500,
                error: "An error occured while submitting data"
            };
        }
    },
    totpverification: async({request, fetch, cookies})=>{
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/account`);
        }
        const totpForm = await superValidate(request,zod(totpSchema))
        if (!totpForm.valid) {
            return fail(400,{totpForm});
          }
        try{
            const response = await fetch(VITE_API_BASE_URL_MFA_VERIFY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(totpForm.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                console.log('TOTPV Error Server: API Response:', errorData);
                return message(totpForm, {
                    message: errorData.errors,
                    error: errorData.error
                });
            }
            let responseData = await response.json();
            console.log('TOTPV Server: API Response:', responseData);
            return message(totpForm,{
                success: true,
                data: responseData,
                message: 'MFA successfully verified! You will now be required to use MFA to log in.'
            });
        }catch(err){
            console.log('TOTPV-SE error: ', err);
            return {
                status: 500,
                error: "An error occured while submitting data"
            };
        }
    }
}

async function imageWorker(fetch, payload, cookies){
    let updatedInfoResponse = await updateUserInformation(fetch, payload)
    if(!updatedInfoResponse.success){
        console.log("Failure, Updated Info:", updatedInfoResponse)
        return {
            message: 'Avatar could not be updated. Try again later.',
            success: false
        }
    }
    console.log("Updated Info Success: ", updatedInfoResponse.data)
    // everything okay, proceed to update data in cookie
    let result = updateAuthentication(cookies, 'profile_url', payload.profile_avatar_url);
    if (!result) {
        console.log('Error updating cookie');
        return {
            message: 'Avatar will be updated when you log in again.',
            success: false
        };
    }
    return {success:true}
}