import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    email: '',
    cin: '',
    code: '',
    userId: null as string | null,
    gare_id: '',
    csrfToken: null as string | null,
  }),
  getters: {
    getToken(): string | null {
      return this.csrfToken;
    },
  },
  actions: {
    setToken(token: string | null) {
      this.csrfToken = token;
    },
    setEmail(email: string) {
      this.email = email;
      localStorage.setItem('email', email);
    },
    setCin(cin: string) {
      this.cin = cin;
      localStorage.setItem('cin', cin);
    },
    setCode(code: string) {
      this.code = code;
      localStorage.setItem('code', code);
    },
    setUserId(userId: string | null) {
      this.userId = userId;
    },
    setGare(code: string) {
      this.gare_id = code;
      localStorage.setItem('gare_id', code);
    },
  },
});

export function fetchUserId() {
  const adminStore = useAdminStore();
  return adminStore.userId;
}