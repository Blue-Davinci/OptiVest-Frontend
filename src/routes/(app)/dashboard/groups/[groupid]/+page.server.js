import { VITE_API_BASE_GROUPS } from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { getGroupTransactions, getGroupExpenses } from '$lib/dataservice/groups/groupsDataService.js';
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ fetch, params, cookies }) => {
	// check for a searchOption parameter
	let groupID = params.groupid ?? '';
    console.log('Initial GroupID :', groupID);
	// if groupID is empty, return an {}
	if (!groupID || groupID === 'null' || groupID === '') {
		throw error(404, {
			title: 'Invalid Group ID',
			message: 'No valid group ID was provided',
			info: 'Please ensure you have selected a valid group'
		});
	}
    console.log("Group ID after check:",groupID);
	const auth = checkAuthentication(cookies).user;
	if (!auth) {
		return redirect(303, `/login?redirectTo=/dashboard/groups/${groupID}`);
	}
	try {
		// fetch group data
		const response = await fetch(`${VITE_API_BASE_GROUPS}/${groupID}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth}`
			}
		});
		if (!response.ok) {
			let errorData = await response.json();
			return {
				status: response.status,
				error: errorData.error
			};
		}
		let responseData = await response.json();
		let groupTransactionsResponse = await getGroupTransactions({ fetch }, groupID);
		let getGroupExpensesResponse = await getGroupExpenses({ fetch }, groupID, '', 1, 10);
		return {
			status: 200,
			data: responseData,
			groupTransactions: groupTransactionsResponse.data,
			groupExpenses: getGroupExpensesResponse.data
		};
	} catch (err) {
		console.log('GBLEIP-SE error: ', err);
		return {
			status: 500,
			error: 'An error occured while fetching data'
		};
	}
};
