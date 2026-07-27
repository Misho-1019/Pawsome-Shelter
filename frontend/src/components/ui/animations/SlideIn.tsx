import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

interface SlideInProps {
  children: React.ReactNode
  from: 'left' | 'right' | 'top' | 'bottom'
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

const slideVariants = {
  left: { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
  top: { hidden: { opacity: 0, y: -100 }, visible: { opacity: 1, y: 0 } },
  bottom: { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } },
}

export function SlideIn({
  children,
  from,
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
}: SlideInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-100px' })
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={slideVariants[from]}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
