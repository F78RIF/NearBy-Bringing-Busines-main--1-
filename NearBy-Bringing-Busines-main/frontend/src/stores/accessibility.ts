import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

/**
 * Accessibility preferences + runtime engines (text-to-speech, page scaling,
 * motion speed, on-screen keyboard target tracking).
 *
 * Everything the user picks here is persisted to localStorage under a single
 * key so the toolbar comes back in the same state on the next visit.
 */

const STORAGE_KEY = 'nearby:a11y'

/** Page-scale steps. 1 = ukuran normal. */
export const FONT_STEPS = [0.9, 1, 1.1, 1.25, 1.4, 1.6] as const

interface StoredPrefs {
  fontScale?: number
  slowMotion?: boolean
  speechRate?: number
}

function readPrefs(): StoredPrefs {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredPrefs
  } catch {
    return {}
  }
}

export const useAccessibilityStore = defineStore('accessibility', () => {
  const saved = readPrefs()

  // ── Toolbar / panel state ────────────────────────────────────────────────
  const toolbarOpen = ref(false)
  const keyboardOpen = ref(false)

  function toggleToolbar() {
    toolbarOpen.value = !toolbarOpen.value
  }

  // ── 1a. Page scaling (A- / A+) ───────────────────────────────────────────
  // Typography in this project is hard-coded in px (Tailwind arbitrary values
  // like `text-[15.5px]`), so a root `font-size` bump would not reach it.
  // Instead we zoom the document element — that behaves exactly like the
  // browser's own page zoom, so sticky headers / fixed modals keep working and
  // no existing layout rule needs to change.
  const fontScale = ref(clampScale(saved.fontScale ?? 1))

  function clampScale(v: number) {
    const nearest = FONT_STEPS.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), FONT_STEPS[1])
    return nearest
  }

  function applyScale(scale: number) {
    const root = document.documentElement
    root.style.setProperty('--a11y-scale', String(scale))
    if (scale === 1) root.style.removeProperty('zoom')
    else root.style.setProperty('zoom', String(scale))
  }

  function stepFont(direction: 1 | -1) {
    const i = FONT_STEPS.indexOf(fontScale.value as (typeof FONT_STEPS)[number])
    const next = Math.min(FONT_STEPS.length - 1, Math.max(0, (i === -1 ? 1 : i) + direction))
    fontScale.value = FONT_STEPS[next]
  }

  function setFontScale(scale: number) {
    fontScale.value = clampScale(scale)
  }

  function resetFontScale() {
    fontScale.value = 1
  }

  // ── 3. Motion speed ──────────────────────────────────────────────────────
  // Slow + smooth is the default (see `--default-transition-duration` in
  // main.css). Turning this off puts the html element into `a11y-motion-normal`
  // which restores the snappier original timings.
  const slowMotion = ref(saved.slowMotion ?? true)

  function applyMotion(slow: boolean) {
    document.documentElement.classList.toggle('a11y-motion-normal', !slow)
  }

  function toggleSlowMotion() {
    slowMotion.value = !slowMotion.value
  }

  // ── 1b. Text-to-Speech ───────────────────────────────────────────────────
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const speaking = ref(false)
  const paused = ref(false)
  const speechRate = ref(saved.speechRate ?? 1)

  /** Chunks left to speak — Chrome truncates very long utterances. */
  let queue: string[] = []

  /** Elements that must never be read aloud (the toolbar itself, icons, …). */
  const SKIP_SELECTOR = '[data-a11y-ui], script, style, noscript, svg, [aria-hidden="true"], [hidden]'

  /**
   * Grab the text of whatever the user is currently looking at. Views may opt
   * in explicitly with `data-a11y-read`; otherwise we fall back to <main> and
   * finally the whole app root.
   */
  function collectPageText(): string {
    const root =
      document.querySelector<HTMLElement>('[data-a11y-read]') ??
      document.querySelector<HTMLElement>('main') ??
      document.getElementById('app')
    if (!root) return ''

    const parts: string[] = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = (node as Text).parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        if (parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT
        if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT
        const style = getComputedStyle(parent)
        if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })

    let current = walker.nextNode()
    while (current) {
      parts.push(current.nodeValue!.trim())
      current = walker.nextNode()
    }
    return parts.join('. ').replace(/\s+/g, ' ').replace(/(\.\s*){2,}/g, '. ').trim()
  }

  /** Split into utterances of ~200 chars, breaking on sentence boundaries. */
  function chunk(text: string): string[] {
    const sentences = text.split(/(?<=[.!?])\s+/)
    const out: string[] = []
    let buffer = ''
    for (const sentence of sentences) {
      if ((buffer + ' ' + sentence).trim().length > 200) {
        if (buffer) out.push(buffer.trim())
        buffer = sentence
      } else {
        buffer = `${buffer} ${sentence}`
      }
    }
    if (buffer.trim()) out.push(buffer.trim())
    return out
  }

  function speakNext() {
    const next = queue.shift()
    if (!next) {
      speaking.value = false
      paused.value = false
      return
    }
    const utterance = new SpeechSynthesisUtterance(next)
    utterance.lang = 'id-ID'
    utterance.rate = speechRate.value
    utterance.onend = speakNext
    utterance.onerror = () => {
      queue = []
      speaking.value = false
      paused.value = false
    }
    window.speechSynthesis.speak(utterance)
  }

  /** Read the visible content of the current screen. */
  function speakPage() {
    if (!speechSupported) return
    stopSpeaking()
    const text = collectPageText()
    if (!text) return
    queue = chunk(text)
    speaking.value = true
    paused.value = false
    speakNext()
  }

  /** Read one specific string (used for button labels / confirmations). */
  function speakText(text: string) {
    if (!speechSupported || !text.trim()) return
    stopSpeaking()
    queue = chunk(text.trim())
    speaking.value = true
    paused.value = false
    speakNext()
  }

  function pauseSpeaking() {
    if (!speechSupported || !speaking.value) return
    if (paused.value) {
      window.speechSynthesis.resume()
      paused.value = false
    } else {
      window.speechSynthesis.pause()
      paused.value = true
    }
  }

  function stopSpeaking() {
    if (!speechSupported) return
    queue = []
    window.speechSynthesis.cancel()
    speaking.value = false
    paused.value = false
  }

  function toggleSpeakPage() {
    if (speaking.value) stopSpeaking()
    else speakPage()
  }

  // ── 2. On-screen keyboard target ─────────────────────────────────────────
  // The virtual keyboard never takes focus itself (buttons use
  // `@mousedown.prevent`), so the last focused field stays the active one.
  const activeField = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

  function trackFocus(event: FocusEvent) {
    const el = event.target as HTMLElement | null
    if (!el) return
    if (el.closest('[data-a11y-ui]')) return
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) activeField.value = el
  }

  // ── Persistence + side effects ───────────────────────────────────────────
  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fontScale: fontScale.value, slowMotion: slowMotion.value, speechRate: speechRate.value }),
      )
    } catch {
      /* storage disabled (private mode) — preferences just won't persist */
    }
  }

  watch(fontScale, (v) => {
    applyScale(v)
    persist()
  })
  watch(slowMotion, (v) => {
    applyMotion(v)
    persist()
  })
  watch(speechRate, persist)

  /** Called once from main.ts, before the app paints. */
  function init() {
    applyScale(fontScale.value)
    applyMotion(slowMotion.value)
    document.addEventListener('focusin', trackFocus)
  }

  return {
    toolbarOpen,
    toggleToolbar,
    keyboardOpen,

    fontScale,
    stepFont,
    setFontScale,
    resetFontScale,

    slowMotion,
    toggleSlowMotion,

    speechSupported,
    speaking,
    paused,
    speechRate,
    speakPage,
    speakText,
    toggleSpeakPage,
    pauseSpeaking,
    stopSpeaking,

    activeField,

    init,
  }
})
