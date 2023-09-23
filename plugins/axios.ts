import axios from 'axios'

export default defineNuxtPlugin((app) => {

    const defaultUrl = 'https://api.srtk.com.tn/api/';



    // const token = useCookie('token')

    setTimeout(() => {

    }, 5000);

    let api = axios.create({
        baseURL: defaultUrl,
        headers: {
            common: {},
        },
    });

    api.defaults.withCredentials = true;
    // api.defaults.headers.common['Authorization'] = "Bearer " + token.value;
    // api.interceptors.request.use((config) => {
    //     if (token.value) {
    //         config.headers["Authorization"] = "Bearer " + token.value
    //     }
    //     return config
    // })
    return {
        provide: {
            axios: api
        }
    }

})