import {getAccessToken} from "@/app/lib/actions";
const apiService = {
    get: async function (url: string) : Promise<any> {
       console.log('get',url);     
       const token = await getAccessToken();

       return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
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
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
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
    const token = await getAccessToken();

     return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
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