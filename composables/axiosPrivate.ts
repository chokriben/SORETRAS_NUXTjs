import { AxiosResponse, AxiosError } from 'axios';

export const useAxiosPrivate = (url: any, currentPage: number) => {

    const axios = useNuxtApp().$axios
    const token = useCookie('token')
    const LastPage = ref(1)
    const data = ref([])
    let isReady = ref(false)

    axios.get(`${url}?page=${currentPage}`, { headers: { "Authorization": `Bearer ${token.value}` } })
        .then((res: AxiosResponse) => {

            LastPage.value = res.data.users?.last_page || 1;
            data.value = res.data.users?.data?.data || [];
            isReady.value = true
        })
        .catch((err: AxiosError) => {

            console.error("An error occurred:", err)
            isReady.value = true
        })
    //console.log(token.value)

}
