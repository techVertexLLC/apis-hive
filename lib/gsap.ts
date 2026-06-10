// lib/gsap.ts
// GSAP + ScrollTrigger 的集中註冊點，給 scroll-linked 動畫共用。
// 只在 client 端註冊一次；reduced-motion 偵測也放這裡，讓各 section 一致處理。
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function registerScrollTrigger() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export { gsap, ScrollTrigger }
