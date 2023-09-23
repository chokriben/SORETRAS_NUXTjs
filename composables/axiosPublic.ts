export const useAxiosPublic = (url: any, currentPage: number) => {
    const axios = useNuxtApp().$axios;
    const LastPage = ref(1);
    const data = ref([]);
    let isReady = ref(false);

    axios.get(`${url}?page=${currentPage}`)
      .then(res => {
        LastPage.value = res.data.users.last_page;
        data.value = res.data.users.data.data;
        isReady.value = true;
      })
      .catch((err: any) => {
        console.error('Error fetching data:', err);
        isReady.value = true;
      });
}
