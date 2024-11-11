import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS, TOAST_TYPE_LOADING, TOAST_TYPE_INFO, TOAST_TYPE_RETRYING } from '../settings/constants';
import { toast } from 'svelte-sonner';

function toastManager(type, message) {
    if (type === TOAST_TYPE_ERROR) {
        toast.error('An error occurred', {
          description: message
        });
      } else if (type === TOAST_TYPE_SUCCESS) {
        toast.success('Success', {
          description: message
        });
      } else if (type === TOAST_TYPE_LOADING) {
        toast.loading('Loading', {
          description: message
        });
      }else if (type === TOAST_TYPE_RETRYING) {
        toast.loading('Retrying', {
          description: message
        });
      } else if (type === TOAST_TYPE_INFO) {
        toast.info('Info', {
          description: message
        });
        console.log(message);
      }
}

function buildFeedFollowUrl(baseUrl, params) {
  let queryParts = [];

  if (params.name) {
      queryParts.push(`name=${encodeURIComponent(params.name)}`);
  }
  if (params.page && params.page > 0) {
      queryParts.push(`page=${encodeURIComponent(params.page)}`);
  }
  if (params.page_size && params.page_size > 0) {
      queryParts.push(`page_size=${encodeURIComponent(params.page_size)}`);
  }
  if(params.is_educational){
      queryParts.push(`is_educational=${encodeURIComponent(params.is_educational)}`);
  }
  if(params.goalID){
      queryParts.push(`goalID=${encodeURIComponent(params.goalID)}`);
  }
  if(params.groupID){
      queryParts.push(`groupID=${encodeURIComponent(params.groupID)}`);
  }

  return queryParts.length > 0 ? `${baseUrl}?${queryParts.join('&')}` : baseUrl;
}

export { 
  toastManager, 
  buildFeedFollowUrl 
};