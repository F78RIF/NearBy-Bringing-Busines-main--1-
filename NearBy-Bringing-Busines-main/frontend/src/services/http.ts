/**
 * Klien HTTP tipis ke API Laravel.
 *
 * Ini satu-satunya tempat frontend menyentuh jaringan. Sebelum ini seluruh
 * aplikasi berjalan dari seed statis; fitur Kalkulator adalah yang pertama
 * benar-benar membaca/menulis ke database, jadi wrapper-nya sengaja kecil dan
 * tidak mengubah apa pun di halaman lama.
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

/** Token Sanctum untuk request bertanda auth. Di-set oleh store auth. */
let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function hasApiUrl(): boolean {
  return BASE_URL !== ''
}

/**
 * Error yang membawa pesan siap-tampil.
 *
 * Laravel mengembalikan 422 dengan bentuk `{ message, errors: { field: [...] } }`.
 * Tanpa diterjemahkan, user cuma melihat "Request failed" — persis jenis
 * silent-fail yang bikin bug verifikasi UMKM kemarin sulit dilacak.
 */
export class ApiError extends Error {
  status: number
  /** Pesan per-field dari validasi Laravel, kalau ada. */
  fieldErrors: string[]

  constructor(message: string, status: number, fieldErrors: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }

  /** Semua pesan yang layak ditunjukkan ke user, tanpa duplikat. */
  get messages(): string[] {
    return this.fieldErrors.length ? this.fieldErrors : [this.message]
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!BASE_URL) {
    throw new ApiError(
      'VITE_API_URL belum diatur. Buat file frontend/.env lalu jalankan ulang dev server.',
      0,
    )
  }

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // fetch hanya menolak untuk kegagalan jaringan — server mati, CORS, DNS.
    throw new ApiError(
      'Tidak bisa menghubungi server. Pastikan backend jalan (php artisan serve) dan MySQL hidup.',
      0,
    )
  }

  if (response.status === 204) return undefined as T

  const raw = await response.text()
  let payload: unknown = null
  if (raw) {
    try {
      payload = JSON.parse(raw)
    } catch {
      // Bukan JSON — biasanya halaman error HTML dari PHP.
      if (!response.ok) {
        throw new ApiError(`Server membalas ${response.status} (bukan JSON).`, response.status)
      }
    }
  }

  if (!response.ok) {
    const data = (payload ?? {}) as { message?: string; errors?: Record<string, string[]> }
    const fieldErrors = data.errors ? Object.values(data.errors).flat() : []

    throw new ApiError(
      data.message || `Permintaan gagal (${response.status}).`,
      response.status,
      fieldErrors,
    )
  }

  return payload as T
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
