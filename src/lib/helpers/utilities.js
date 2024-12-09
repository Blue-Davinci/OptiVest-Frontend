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
  if(params.userID){
      queryParts.push(`userID=${encodeURIComponent(params.userID)}`);
  }
  if(params.is_admin){
      queryParts.push(`is_admin=${encodeURIComponent(params.is_admin)}`);
  }
  // associated_id
  if(params.associated_id){
      queryParts.push(`associated_id=${encodeURIComponent(params.associated_id)}`);
  }
  // associated_type
  if(params.associated_type){
      queryParts.push(`associated_type=${encodeURIComponent(params.associated_type)}`);
  }
  // commentID
  if(params.commentID){
      queryParts.push(`commentID=${encodeURIComponent(params.commentID)}`);
  }

  return queryParts.length > 0 ? `${baseUrl}?${queryParts.join('&')}` : baseUrl;
}

function generateRobohashUrls(userName,bgSetIndex,bgSets)   {
  const bgSet = bgSets[bgSetIndex];
  return Array.from({ length: 5 }, (_, i) => {
    const bgQuery = bgSet ? `&bgset=${bgSet}` : '';
    return `https://robohash.org/${userName}${i + 1}.png?set=set${i + 1}${bgQuery}&size=500x500`;
  });
}

 async function fetchCountries() {
  // Check if we're running in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Not in a browser environment. Skipping localStorage and using direct fetch.');
    return await fetchFromAPI();
  }

  // Check if country data exists in localStorage
  const cachedCountries = localStorage.getItem('countries');
  if (cachedCountries) {
    try {
      console.log('Loaded countries from localStorage cache');
      return JSON.parse(cachedCountries);
    } catch{
      console.warn('Failed to parse cached countries, clearing cache.');
      localStorage.removeItem('countries'); // Clear bad cache if parsing fails
    }
  }

  // Fetch fresh data if not found in localStorage
  const countries = await fetchFromAPI();

  try {
    localStorage.setItem('countries', JSON.stringify(countries));
    console.log('Countries fetched from API and cached in localStorage');
  } catch (error) {
    console.warn('Failed to cache countries in localStorage:', error);
  }

  return countries;
}

// Helper function to fetch countries from the API
async function fetchFromAPI() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
    const data = await response.json();
    const countries = data
      .map(country => ({
        name: country.name.common,
        code: country.cca2
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return countries;
  } catch (error) {
    console.error('Failed to fetch country data from API:', error);
    return [];
  }
}


export { 
  toastManager, 
  buildFeedFollowUrl ,
  generateRobohashUrls,
  fetchCountries
};