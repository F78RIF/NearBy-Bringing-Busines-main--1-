import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Role } from '@/types'

export interface CommentHistoryEntry {
  cid: number
  umkmId: number
  umkm: string
  cat: string
  stars: number
  text: string
  date: string
}

export interface DeletedAccount {
  name: string
  email: string
  role: string
  rawRole: Role
  initial: string
  deletedAt: number
}

const SEED_COMMENT_HISTORY: CommentHistoryEntry[] = [
  {
    cid: 1,
    umkmId: 1,
    umkm: 'Warung Kepiting Kenari',
    cat: 'Kuliner',
    stars: 5,
    text: 'Kepitingnya juara, saus padangnya bikin nagih! Pelayanan cepat dan ramah.',
    date: '2 Jul 2026',
  },
  {
    cid: 2,
    umkmId: 2,
    umkm: 'Kopi Saluang',
    cat: 'Kuliner',
    stars: 4,
    text: 'Suasana enak buat nongkrong, kopinya pas. Tempat parkir agak sempit.',
    date: '26 Jun 2026',
  },
  {
    cid: 3,
    umkmId: 3,
    umkm: 'Penginapan Teluk Asri',
    cat: 'Penginapan',
    stars: 5,
    text: 'Kamar bersih, host ramah, pemandangan teluknya bagus. Pasti balik lagi.',
    date: '18 Jun 2026',
  },
]

export const useAccountStore = defineStore('account', () => {
  const perms = reactive({
    emailNotif: true,
    pushNotif: false,
    location: true,
    promo: false,
    dataShare: true,
  })
  const security = reactive({ twofa: false })

  function togglePerm(key: keyof typeof perms) {
    perms[key] = !perms[key]
  }
  function toggleSecurity(key: keyof typeof security) {
    security[key] = !security[key]
  }

  const commentHistory = ref<CommentHistoryEntry[]>(SEED_COMMENT_HISTORY)

  function deleteComment(cid: number) {
    commentHistory.value = commentHistory.value.filter((c) => c.cid !== cid)
  }
  function updateComment(cid: number, text: string) {
    const c = commentHistory.value.find((c) => c.cid === cid)
    if (c) c.text = text
  }

  const deletedAccounts = ref<DeletedAccount[]>([
    {
      name: 'Andini Putri',
      email: 'andini.p@mail.com',
      role: 'Pengguna',
      rawRole: 'user',
      initial: 'A',
      deletedAt: Date.now() - 5 * 86400000,
    },
  ])
  const myDeleted = ref<DeletedAccount | null>(null)

  const myDeletedDaysLeft = computed(() =>
    myDeleted.value ? Math.max(0, 30 - Math.floor((Date.now() - myDeleted.value.deletedAt) / 86400000)) : 30,
  )

  function deleteMyAccount(name: string, email: string, role: Role, roleLabel: string, initial: string) {
    const acc: DeletedAccount = { name, email, role: roleLabel, rawRole: role, initial, deletedAt: Date.now() }
    deletedAccounts.value.push(acc)
    myDeleted.value = acc
  }

  /** Returns the {name, role} to restore into the auth session, or null if nothing to restore. */
  function restoreMyAccount(): { name: string; role: Role } | null {
    const m = myDeleted.value
    if (!m) return null
    deletedAccounts.value = deletedAccounts.value.filter((x) => x !== m)
    myDeleted.value = null
    return { name: m.name, role: m.rawRole }
  }

  return {
    perms,
    security,
    togglePerm,
    toggleSecurity,
    commentHistory,
    deleteComment,
    updateComment,
    deletedAccounts,
    myDeleted,
    myDeletedDaysLeft,
    deleteMyAccount,
    restoreMyAccount,
  }
})
