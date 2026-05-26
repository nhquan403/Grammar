import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { ReviewItem, RatingLabel } from '@/types/vocab-types'
import { FlashcardWordFamilyDisplay } from './flashcard-word-family-display'
import { FlashcardRatingButtons } from './flashcard-rating-buttons'

interface Props {
  item: ReviewItem
  onRate: (rating: RatingLabel) => void
}

export function FlashcardSwipeable({ item, onRate }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])
  const cardOpacity = useTransform(x, [-250, -180, 0, 180, 250], [0, 1, 1, 1, 0])
  const againOverlay = useTransform(x, [-180, -60, 0], [0.85, 0.25, 0])
  const easyOverlay = useTransform(x, [0, 60, 180], [0, 0.25, 0.85])

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (!isFlipped) return
    if (info.offset.x < -110) onRate('again')
    else if (info.offset.x > 110) onRate('easy')
  }

  const { family } = item
  const rootForm = family.forms.find(f => f.word === family.rootWord) ?? family.forms[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Card area */}
      <div style={{ flex: 1, padding: '12px 16px 4px', display: 'flex', flexDirection: 'column' }}>
        <motion.div
          drag={isFlipped ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          style={{
            x, rotate, opacity: cardOpacity,
            flex: 1, borderRadius: 24,
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-elevated)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            cursor: isFlipped ? 'grab' : 'pointer',
            position: 'relative',
            touchAction: isFlipped ? 'none' : 'auto',
          }}
          onClick={() => { if (!isFlipped) setIsFlipped(true) }}
        >
          {/* Swipe overlays */}
          <motion.div style={{
            opacity: againOverlay, position: 'absolute', inset: 0, borderRadius: 24,
            background: '#ef4444', pointerEvents: 'none', zIndex: 10,
          }} />
          <motion.div style={{
            opacity: easyOverlay, position: 'absolute', inset: 0, borderRadius: 24,
            background: '#22c55e', pointerEvents: 'none', zIndex: 10,
          }} />

          {/* Swipe direction labels */}
          {isFlipped && (
            <>
              <motion.div style={{
                opacity: againOverlay, position: 'absolute', left: 16, top: '50%',
                transform: 'translateY(-50%)', zIndex: 20, pointerEvents: 'none',
              }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>LẠI</span>
              </motion.div>
              <motion.div style={{
                opacity: easyOverlay, position: 'absolute', right: 16, top: '50%',
                transform: 'translateY(-50%)', zIndex: 20, pointerEvents: 'none',
              }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>DỄ</span>
              </motion.div>
            </>
          )}

          {/* CEFR + category header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 0' }}>
            <span className={`badge cefr-${family.cefr}`} style={{ fontSize: 11 }}>
              {family.cefr}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)' }}>{family.category}</span>
          </div>

          {!isFlipped ? (
            /* Front face */
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px 20px', textAlign: 'center',
            }}>
              <h2 style={{ fontSize: 52, fontWeight: 800, color: 'var(--color-foreground)', marginBottom: 12, letterSpacing: '-1px' }}>
                {family.rootWord}
              </h2>
              {rootForm && (
                <span className={`badge pos-${rootForm.pos}`} style={{ fontSize: 12, padding: '4px 12px' }}>
                  {rootForm.pos}
                </span>
              )}
              <p style={{ marginTop: 40, fontSize: 13, color: 'var(--color-muted-foreground)', opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>👆</span> Nhấn để xem word family
              </p>
            </div>
          ) : (
            /* Back face */
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px' }}>
              {/* Root definition */}
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-foreground)', letterSpacing: '-0.5px' }}>
                    {family.rootWord}
                  </h2>
                  {rootForm && (
                    <span style={{ fontSize: 13, color: 'var(--color-muted-foreground)' }}>{rootForm.pos}</span>
                  )}
                </div>
                {rootForm && (
                  <>
                    <p style={{ fontSize: 15, color: 'var(--color-foreground)', opacity: 0.9, marginTop: 4, lineHeight: 1.5 }}>
                      {rootForm.definition}
                    </p>
                    {rootForm.example && (
                      <p style={{ fontSize: 13, color: 'var(--color-muted-foreground)', fontStyle: 'italic', marginTop: 4 }}>
                        "{rootForm.example}"
                      </p>
                    )}
                  </>
                )}
              </div>
              <FlashcardWordFamilyDisplay family={family} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Swipe hint (only after flip) */}
      {isFlipped && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 24px', fontSize: 11, color: 'var(--color-muted-foreground)', opacity: 0.6 }}>
          <span>← Lại</span>
          <span>Dễ →</span>
        </div>
      )}

      {/* Rating buttons */}
      {isFlipped && <FlashcardRatingButtons onRate={onRate} />}

      {/* Reveal button (front only) */}
      {!isFlipped && (
        <div style={{ padding: '8px 16px 16px' }}>
          <button
            onClick={() => setIsFlipped(true)}
            className="gradient-brand"
            style={{
              width: '100%', height: 52, borderRadius: 14, border: 'none',
              color: 'white', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', touchAction: 'manipulation',
            }}
          >
            Xem Word Family
          </button>
        </div>
      )}
    </div>
  )
}
