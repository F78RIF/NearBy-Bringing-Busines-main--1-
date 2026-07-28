import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { http, setAuthToken } from '@/services/http'
import type { AuthUser, Role } from '@/types'

const TOKEN_KEY = 'nearby.apiToken'

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
    apiLogout()
  }

  /* ---------------------------------------------------------------- *
   * Sesi API sungguhan (Sanctum)
   *
   * Terpisah dari login mock di atas dan sepenuhnya opsional: halaman
   * lama tetap jalan dari seed tanpa ini. Hanya fitur yang benar-benar
   * membaca/menulis database (Kalkulator) yang membutuhkannya.
   * ---------------------------------------------------------------- */

  const apiToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const apiUser = ref<{ name: string; email: string; role: string } | null>(null)

  // Pulihkan token dari sesi sebelumnya supaya tidak perlu login ulang
  // setiap kali dev server di-reload.
  if (apiToken.value) setAuthToken(apiToken.value)

  const isApiConnected = computed(() => !!apiToken.value)

  async function apiLogin(email: string, password: string) {
    const res = await http.post<{ token: string; data?: unknown; user?: { name: string; email: string; role: string } }>(
      '/login',
      { email, password },
    )

    apiToken.value = res.token
    localStorage.setItem(TOKEN_KEY, res.token)
    setAuthToken(res.token)

    // UserResource membungkus payload-nya dalam `data`.
    const payload = (res.user ?? (res as { data?: { name: string; email: string; role: string } }).data) ?? null
    apiUser.value = payload

    return payload
  }

  function apiLogout() {
    apiToken.value = null
    apiUser.value = null
    localStorage.removeItem(TOKEN_KEY)
    setAuthToken(null)
  }

  return {
    user,
    regRole,
    apiToken,
    apiUser,
    isApiConnected,
    apiLogin,
    apiLogout,
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
