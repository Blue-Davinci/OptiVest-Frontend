import { VITE_API_SSE_BASE_URL } from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, request }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth) {
        console.log('GPFSIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard`);
    }

    const controller = new AbortController();
    const signal = controller.signal;

    try {
        const response = await fetch(VITE_API_SSE_BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`,
                Accept: 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive'
            },
            signal,
            timeout: 30000 // 30 second timeout
        });

        if (!response.ok) {
            if (response.status === 403) {
                return redirect(303, `/activation`);
            }
            const errorData = await response.json();
            return json({ error: errorData.error }, { status: response.status });
        }

        if (!response.body) {
            throw new Error('No response body received from SSE endpoint');
        }

        // Set up cleanup on client disconnect
        const cleanup = () => {
            controller.abort();
            console.log('SSE connection cleaned up');
        };

        // Handle client disconnect
        request.signal.addEventListener('abort', cleanup);

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Connection: 'keep-alive',
                'X-Accel-Buffering': 'no',
                'Keep-Alive': 'timeout=60',
                Pragma: 'no-cache',
                Expires: '0'
            },
            onclose: cleanup
        });
    } catch (err) {
        console.log('SSE-EP-SE error: ', err);
        
        if (err.name === 'AbortError') {
            return new Response(null, { status: 499 }); // Client closed request
        }

        if (err.status === 303) {
            return json(
                {
                    error: 'User is not authorized to access this resource',
                    details: err.message
                },
                { status: 303 }
            );
        }

        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            return json(
                {
                    error: 'Failed to connect to SSE server',
                    details: err.message
                },
                { status: 503 }
            );
        }

        return json(
            {
                error: 'An error occurred while establishing SSE connection',
                details: err.message
            },
            { status: 500 }
        );
    }
};