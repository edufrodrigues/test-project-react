import type { ArtPalette } from '../../api/types'

export interface ExperienceArtProps {
  art: ArtPalette
  /** Texto alternativo. Omita quando a imagem for decorativa. */
  label?: string
  className?: string
}

/*
 * Ilustração vetorial gerada a partir da paleta da experiência.
 * Substitui fotos para o projeto funcionar offline e sem assets externos.
 */
const scenes = {
  montanha: {
    far: 'M0 150 L70 80 L120 120 L190 50 L260 115 L320 70 L400 130 L400 240 L0 240 Z',
    near: 'M0 190 L90 130 L160 175 L240 120 L330 180 L400 150 L400 240 L0 240 Z',
  },
  mar: {
    far: 'M0 140 Q60 110 120 135 T240 130 T400 125 L400 240 L0 240 Z',
    near: 'M0 175 Q50 160 100 175 T200 175 T300 175 T400 172 L400 240 L0 240 Z',
  },
  cidade: {
    far: 'M0 150 L30 150 L30 110 L60 110 L60 130 L95 130 L95 90 L115 70 L135 90 L135 140 L175 140 L175 100 L215 100 L215 125 L250 125 L250 80 L290 80 L290 135 L330 135 L330 105 L370 105 L370 140 L400 140 L400 240 L0 240 Z',
    near: 'M0 195 Q100 170 200 190 T400 185 L400 240 L0 240 Z',
  },
  vinhedo: {
    far: 'M0 140 Q100 90 200 125 T400 110 L400 240 L0 240 Z',
    near: 'M0 180 Q120 140 240 170 T400 160 L400 240 L0 240 Z',
  },
}

export function ExperienceArt({ art, label, className }: ExperienceArtProps) {
  const id = `art-${art.skyTop.slice(1)}-${art.near.slice(1)}`
  const shapes = scenes[art.scene]

  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.skyTop} />
          <stop offset="100%" stopColor={art.skyBottom} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id})`} />
      <circle cx="300" cy="70" r="30" fill={art.sun} opacity="0.9" />
      <path d={shapes.far} fill={art.far} opacity="0.85" />
      {art.scene === 'vinhedo' &&
        Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${-20 + i * 70} 240 Q${40 + i * 60} 175 ${120 + i * 55} 150`} stroke={art.near} strokeWidth="3" fill="none" opacity="0.5" />
        ))}
      <path d={shapes.near} fill={art.near} />
    </svg>
  )
}
