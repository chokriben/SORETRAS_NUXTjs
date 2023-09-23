import { onMounted } from 'vue';

export default {
  mounted() {
    onMounted(() => {
      // Check if the admin is logged in
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        // Redirect to the login page or perform any desired action
        window.location.href = '/admin/auth/login';
      } else {
        this.headers.Authorization = `Bearer ${token}`;
      }
    });
  },
};
