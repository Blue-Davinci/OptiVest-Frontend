import { VITE_API_SSE_BASE_URL } from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth) {
        console.log('GPFSIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard`);
    }
    
    try {
        const response = await fetch(VITE_API_SSE_BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`,
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return json({ error: errorData.error }, { status: response.status });
        }

        // Verify we have a readable stream
        if (!response.body) {
            throw new Error('No response body received from SSE endpoint');
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Transfer-Encoding': 'chunked'
            }
        });
    } catch (err) {
        console.log("SSE-EP-SE error: ", err);
        
        // Check for specific error types
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            return json({ 
                error: "Failed to connect to SSE server",
                details: err.message 
            }, { status: 503 });
        }
        
        return json({ 
            error: "An error occurred while establishing SSE connection",
            details: err.message 
        }, { status: 500 });
    }
}