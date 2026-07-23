import type { Directive } from 'vue'

interface RevealOptions {
  delay?: number
}

type RevealBinding = RevealOptions | number | undefined

const alreadyRevealed = new WeakSet<Element>()
const observers = new WeakMap<Element, IntersectionObserver>()

export const vReveal: Directive<HTMLElement, RevealBinding> = {
  mounted(el, binding) {
    const opts: RevealOptions = typeof binding.value === 'number' ? { delay: binding.value } : (binding.value ?? {})

    el.classList.add('reveal')
    el.style.setProperty('--reveal-delay', `${opts.delay ?? 0}ms`)

    if (alreadyRevealed.has(el)) {
      el.classList.add('reveal-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          el.classList.add('reveal-visible')
          alreadyRevealed.add(el)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(el)
    observers.set(el, observer)
  },
  updated(el, binding) {
    const opts: RevealOptions = typeof binding.value === 'number' ? { delay: binding.value } : (binding.value ?? {})
    el.style.setProperty('--reveal-delay', `${opts.delay ?? 0}ms`)
  },
  unmounted(el) {
    observers.get(el)?.disconnect()
    observers.delete(el)
  },
}
