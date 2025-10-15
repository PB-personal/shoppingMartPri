import { db, auth } from '@/utility/firebaseConfig'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { ROLE_ADMIN, ROLE_USER } from '@/constants/appConstants'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const role = ref(ROLE_USER)
  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => role.value === ROLE_ADMIN)
  const initialized = ref(false)

  const signUpUser = async (email, password) => {
    isLoading.value = true
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        role: ROLE_USER,
        email: userCredential.user.email,
        createdAt: new Date(),
      })

      clearUser()
      error.value = null
      console.log('User signed up:', user.value)
    } catch (error) {
      error.value = error.message
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const signInUser = async (email, password) => {
    isLoading.value = true
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      error.value = null
      console.log('User signed up:', user.value)
    } catch (error) {
      error.value = error.message
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
    role.value = null
  }

  const signOutUser = async () => {
    isLoading.value = true
    try {
      await signOut(auth)
      clearUser()
      error.value = null
    } catch (error) {
      error.value = error.message
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = async () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser
        await fetchRole(firebaseUser.uid)
        initialized.value = true
      } else {
        clearUser()
      }
    })
  }

  const fetchRole = async (uid) => {
    //fetch role from firestore
    const userDoc = await getDoc(doc(db, 'users', uid))
    role.value = userDoc.exists() ? userDoc.data().role : ''
  }

  return {
    //state
    user,
    error,
    role,
    isLoading,
    initialized,

    //getters
    isAuthenticated,
    isAdmin,

    //actions
    signUpUser,
    signInUser,
    initializeAuth,
    signOutUser,
  }
})
