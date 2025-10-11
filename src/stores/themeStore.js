import { defineStore } from 'pinia'
export const useThemeStore = defineStore('themeStore', {
  state: () => {
    theme: 'dark'
  },

  actions: {
    setTheme(newTheme) {
      this.theme = newTheme
      document.body.setAttribute('data-bs-theme', newTheme)
    },
  },
})
