import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { http, setAuthToken } from '@/services/http'
import type { AuthUser, Role } from '@/types'

const TOKEN_KEY = 'nearby.apiToken'

/** Bentuk payload user dari API (UserResource). */
interface ApiUser {
  name: string
  email: string
  phone?: string | null
  role: string
}

/** Role dari server dinormalkan ke tipe Role; nilai tak dikenal jatuh ke 'user'. */
function toRole(role: string | undefined): Role {
  return role === 'admin' || role === 'owner' ? role : 'user'
}

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
  // can be edited freely. Seeded from the signed-in account.
  const profileName = ref('')
  const profileEmail = ref('')
  const profilePhone = ref('')

  /* ---------------------------------------------------------------- *
   * Sesi API (Laravel Sanctum)
   *
   * Satu-satunya jalan masuk ke aplikasi: kredensial dikirim ke
   * `POST /login` dan sesi dibangun dari balasan server. Tidak ada
   * jalur login lain di frontend.
   * ---------------------------------------------------------------- */

  const apiToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const apiUser = ref<ApiUser | null>(null)

  // Pulihkan token dari sesi sebelumnya supaya tidak perlu login ulang
  // setiap kali dev server di-reload.
  if (apiToken.value) setAuthToken(apiToken.value)

  const isApiConnected = computed(() => !!apiToken.value)

  /** Isi sesi (session user + field profil) dari payload API. */
  function setSession(payload: ApiUser | null) {
    apiUser.value = payload
    if (!payload) {
      user.value = null
      profileName.value = ''
      profileEmail.value = ''
      profilePhone.value = ''
      return
    }

    user.value = { name: payload.name, role: toRole(payload.role) }
    profileName.value = payload.name
    profileEmail.value = payload.email
    profilePhone.value = payload.phone ?? ''
  }

  /** UserResource membungkus payload-nya dalam `data`. */
  function unwrap(res: { data?: ApiUser; user?: ApiUser }): ApiUser | null {
    return res.user ?? res.data ?? null
  }

  /** Login dengan akun sungguhan. Melempar ApiError bila kredensial salah. */
  async function login(email: string, password: string) {
    const res = await http.post<{ token: string; data?: ApiUser; user?: ApiUser }>('/login', {
      email,
      password,
    })

    apiToken.value = res.token
    localStorage.setItem(TOKEN_KEY, res.token)
    setAuthToken(res.token)

    const payload = unwrap(res)
    setSession(payload)

    return payload
  }

  /** Daftar akun baru lalu langsung masuk dengan token yang dikembalikan server. */
  async function register(input: { name: string; email: string; password: string; role: Role }) {
    const res = await http.post<{ token: string; data?: ApiUser; user?: ApiUser }>('/register', input)

    apiToken.value = res.token
    localStorage.setItem(TOKEN_KEY, res.token)
    setAuthToken(res.token)

    const payload = unwrap(res)
    setSession(payload)

    return payload
  }

  /** Pulihkan sesi dari token yang tersimpan (dipanggil saat aplikasi start). */
  async function restoreSession() {
    if (!apiToken.value) return null
    try {
      const res = await http.get<{ data?: ApiUser } & Partial<ApiUser>>('/me')
      const payload = unwrap(res as { data?: ApiUser; user?: ApiUser }) ?? (res as ApiUser)
      setSession(payload.name ? payload : null)
      return user.value
    } catch {
      // Token kedaluwarsa/dicabut — bersihkan supaya tidak menggantung.
      clearSession()
      return null
    }
  }

  /** Buang token & sesi lokal tanpa memanggil server. */
  function clearSession() {
    apiToken.value = null
    localStorage.removeItem(TOKEN_KEY)
    setAuthToken(null)
    setSession(null)
  }

  /**
   * Keluar: cabut token di server (best-effort) dan langsung bersihkan sesi
   * lokal — UI tidak perlu menunggu balasan server untuk berhenti "masuk".
   */
  function logout() {
    // Header Authorization disusun saat pemanggilan, sebelum clearSession().
    const revoked = apiToken.value ? http.post('/logout').catch(() => undefined) : Promise.resolve()
    clearSession()
    return revoked
  }

  return {
    user,
    regRole,
    apiToken,
    apiUser,
    isApiConnected,
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
    register,
    restoreSession,
    clearSession,
    logout,
  }
})
