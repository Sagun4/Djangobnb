import {getAccessToken} from "@/app/lib/actions";

export const getApiHost = () => {
    const host = process.env.NEXT_PUBLIC_API_HOST || 'http://167.172.91.46:1337';
    if (typeof window === 'undefined') {
        return host;
    }
    if (host.startsWith('http://') && window.location.protocol === 'https:') {
        return '';
    }
    return host;
};

export const formatImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) {
        if (typeof window === 'undefined' || window.location.protocol === 'https:') {
            return url.replace(/^https?:\/\/[^\/]+/, '');
        }
        return url;
    }
    if (typeof window === 'undefined') {
        const host = process.env.NEXT_PUBLIC_API_HOST || 'http://167.172.91.46:1337';
        return `${host}${url}`;
    }
    const host = process.env.NEXT_PUBLIC_API_HOST || 'http://167.172.91.46:1337';
    if (host.startsWith('http://') && window.location.protocol === 'https:') {
        return url;
    }
    return `${host}${url}`;
};

const apiService = {
    get: async function (url: string) : Promise<any> {
       console.log('get',url);     
       const token = await getAccessToken();

       return new Promise((resolve, reject) => {
        fetch(`${getApiHost()}${url}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json().catch(() => {
                throw new Error('API returned invalid JSON');
            });
        })
        .then((json) => {
            console.log('json', json);
            resolve(json);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
            reject(error);
        })
            
    })
   
},
 post: async function (url: string, data: any) : Promise<any> {
    console.log('post',url, data);
    const token = await getAccessToken();

     return new Promise((resolve, reject) => {
        fetch(`${getApiHost()}${url}`, {
            method: "POST",
             body:data,
             headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        .then(response => {
            return response.json().catch(() => {
                throw new Error('API returned invalid JSON');
            });
        })
        .then((json) => {
            console.log('json', json);
            resolve(json);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
            reject(error);
        })
        })
 },

  postWithoutToken: async function (url: string, data: any) : Promise<any> {
    console.log('post',url, data);

     return new Promise((resolve, reject) => {
        fetch(`${getApiHost()}${url}`, {
            method: "POST",
             body:data,
             headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
               
            },
        })
        .then(response => {
            return response.json().catch(() => {
                throw new Error('API returned invalid JSON');
            });
        })
        .then((json) => {
            console.log('json', json);
            resolve(json);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
            reject(error);
        })
        })
}
};
export default apiService;