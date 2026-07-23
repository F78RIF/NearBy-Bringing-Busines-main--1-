import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser, Role } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const regRole = ref<Role>('user')

  const isGuest = computed(() => !user.value)
  const isAuthed = computed(() => !!user.value)
  const isOwner = computed(() => user.value?.role === 'owner')
  const isAdmin = computed(() => user.value?.role === 'admin')

  const authInitial = computed(() => user.value?.name.trim().charAt(0).toUpperCase() ?? '')
  const authFirst = computed(() => user.value?.name.split(' ')[0] ?? '')
  const authRoleLabel = computed(() => {
    switch (user.value?.role) {
      case 'owner':
        return 'Pemilik UMKM'
      case 'admin':
        return 'Administrator'
      case 'user':
        return 'Pengguna'
      default:
        return ''
    }
  })

  // Profile-settings fields, independent of the session name/role so they
  // can be edited freely. Seeded with sensible defaults on login, matching
  // the prototype's `profileName || authName` render-time fallback.
  const profileName = ref('')
  const profileEmail = ref('')
  const profilePhone = ref('')

  function login(name: string, role: Role) {
    user.value = { name, role }
    profileName.value = name
    profileEmail.value = role === 'admin' ? 'admin@nearby.id' : 'akun@mail.com'
    profilePhone.value = '0812-0000-0000'
  }

  /** Prototype login is mocked: submitting the form always signs in the same demo user. */
  function doLogin() {
    login('Rizky Pratama', 'user')
  }
  function loginAsUser() {
    login('Rizky Pratama', 'user')
  }
  function loginAsOwner() {
    login('Dewi Anjani', 'owner')
  }
  function loginAsAdmin() {
    login('Admin NearBy', 'admin')
  }

  function register(name: string, role: Role) {
    const nm = name || (role === 'owner' ? 'Dewi Anjani' : 'Rizky Pratama')
    login(nm, role)
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    regRole,
    isGuest,
    isAuthed,
    isOwner,
    isAdmin,
    authInitial,
    authFirst,
    authRoleLabel,
    profileName,
    profileEmail,
    profilePhone,
    login,
    doLogin,
    loginAsUser,
    loginAsOwner,
    loginAsAdmin,
    register,
    logout,
  }
})
