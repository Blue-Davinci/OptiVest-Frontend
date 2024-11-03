import { buildFeedFollowUrl } from '$lib/helpers/utilities.js';

const getAllNotifications = async (
	{ fetch: customFetch } = {},
	page = 0,
	page_size = 0,
	name = ''
) => {
	let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
	let endpoint = '/api/notifications';
	let params = {
		name: name,
		page: page,
		page_size: page_size
	};
	let notificationURL = buildFeedFollowUrl(endpoint, params);
	try {
		const response = await fetchFunc(notificationURL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			let errorData = await response.json();
			return {
				success: false,
				status: response.status,
				error: errorData.error
			};
		}
		let responseData = await response.json();
		return {
			success: true,
			status: response.status,
			data: responseData
		};
	} catch (err) {
		console.log('[ggtDS] ERROR: ', err.message);
		return {
			success: false,
			status: 500,
			error: '[gnDS]An error occured while fetching data'
		};
	}
};

// we will use the notificationID as a parameter to update the status of the notification
// then include the status in the body of the request
const updateNotificationStatus = async (notificationID, status) => {
	// check if the notificationID and status are provided and valid
	if (!notificationID || !status) {
		return {
			success: false,
			status: 400,
			error: 'Invalid notificationID or status'
		};
	}
	// make endpoint with the notificationID as a parameter
	let endpoint = `/api/notifications?notificationID=${notificationID}`;
	try {
		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(status)
		});
		if (!response.ok) {
			let errorData = await response.json();
			return {
				success: false,
				status: response.status,
				error: errorData.error
			};
		}
		let responseData = await response.json();
		return {
			success: true,
			status: response.status,
			data: responseData
		};
	} catch (err) {
		console.log('[gnsDS] ERROR: ', err.message);
		return {
			success: false,
			status: 500,
			error: '[upnDS]An error occured while fetching data'
		};
	}
};

const deleteNotifications = async(deleteall, notificationID) => {
    let finalEndpoint
    // if delete all is true then do not include notificationID in the final endpoint
    // thereby deleting all notifications otherwise delete the notification with the notificationID
    if (deleteall){
        finalEndpoint = '/api/notifications?deleteall=true';
    }else{
        finalEndpoint = `/api/notifications?notificationID=${notificationID}`;
    }
    try{
        const response = await fetch(finalEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return {
                success: false,
                status: response.status,
                error: errorData.error
            };
        }
        let responseData = await response.json();
        return {
            success: true,
            status: response.status,
            data: responseData
        };
    }catch(err){
        console.log('[dnDS] ERROR: ', err.message);
        return {
            success: false,
            status: 500,
            error: '[dnDS]An error occured while fetching data'
        };
    }
}

export { getAllNotifications, updateNotificationStatus, deleteNotifications };
