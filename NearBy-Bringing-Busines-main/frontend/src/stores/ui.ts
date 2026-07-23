import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const mobileNavOpen = ref(false)
  const profileMenuOpen = ref(false)

  function toggleMobileNav() {
    mobileNavOpen.value = !mobileNavOpen.value
  }
  function closeMobileNav() {
    mobileNavOpen.value = false
  }
  function toggleProfileMenu() {
    profileMenuOpen.value = !profileMenuOpen.value
  }
  function closeProfileMenu() {
    profileMenuOpen.value = false
  }

  // Floating help / bug-report widget
  const helpOpen = ref(false)
  const helpTab = ref<'ask' | 'bug'>('ask')
  function toggleHelp() {
    helpOpen.value = !helpOpen.value
  }

  // Lightbox (detail page menu-item photo zoom)
  const lightbox = ref<{ label: string; caption: string } | null>(null)
  function openLightbox(label: string, caption: string) {
    lightbox.value = { label, caption }
  }
  function closeLightbox() {
    lightbox.value = null
  }

  // Pengaturan (account settings) modal — global overlay, opened from the
  // header dropdown on any page (matches the prototype's openSettings()).
  const settingsOpen = ref(false)
  const settingsTab = ref('profil')
  function openSettings() {
    settingsOpen.value = true
    settingsTab.value = 'profil'
    profileMenuOpen.value = false
  }
  function closeSettings() {
    settingsOpen.value = false
  }

  // Dashboard modals — one generic slot, matching the prototype's single
  // modalKind/modalItem pair reused by all 5 dashboard modals.
  type ModalKind = 'editUmkm' | 'manageUser' | 'submissionDetail' | 'replyReview' | null
  const modalKind = ref<ModalKind>(null)
  const modalItem = ref<any>(null)
  function openModal(kind: ModalKind, item: unknown = null) {
    modalKind.value = kind
    modalItem.value = item
  }
  function closeModal() {
    modalKind.value = null
    modalItem.value = null
  }

  return {
    mobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    profileMenuOpen,
    toggleProfileMenu,
    closeProfileMenu,
    helpOpen,
    helpTab,
    toggleHelp,
    lightbox,
    openLightbox,
    closeLightbox,
    settingsOpen,
    settingsTab,
    openSettings,
    closeSettings,
    modalKind,
    modalItem,
    openModal,
    closeModal,
  }
})
