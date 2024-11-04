import {getAllNotifications} from '$lib/dataservice/notifications/notificationsDataService.js';


export const load = async ({ fetch }) => {
    try{
        let notificationDataResponse = await getAllNotifications({fetch}, 0, 20, '');
        return {
            notificationData: notificationDataResponse
        }
    }catch(err){
        console.log('[gnLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gnLD]An error occured while fetching data'
        }
    }
}