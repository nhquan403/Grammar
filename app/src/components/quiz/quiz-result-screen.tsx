import { RotateCcw, Home } from 'lucide-react'

interface Props {
  totalCorrect: number
  totalSlots: number
  onRestart: () => void
  onHome: () => void
}

function ScoreCircle({ percent }: { percent: number }) {
  const r = 54
  const circumference = 2 * Math.PI * r
  const dash = (percent / 100) * circumference
  const color = percent >= 70 ? '#22c55e' : percent >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <svg width={132} height={132} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={66} cy={66} r={r} fill="none" stroke="var(--color-border)" strokeWidth={10} />
      <circle
        cx={66} cy={66} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  )
}

function getRank(percent: number): { emoji: string; label: string; color: string } {
  if (percent >= 90) return { emoji: '🏆', label: 'Xuất sắc!', color: '#22c55e' }
  if (percent >= 70) return { emoji: '⭐', label: 'Tốt lắm!', color: 'var(--color-primary)' }
  if (percent >= 50) return { emoji: '📚', label: 'Cần luyện thêm', color: '#f59e0b' }
  return { emoji: '💪', label: 'Cố lên nào!', color: '#ef4444' }
}

export function QuizResultScreen({ totalCorrect, totalSlots, onRestart, onHome }: Props) {
  const percent = totalSlots > 0 ? Math.round((totalCorrect / totalSlots) * 100) : 0
  const rank = getRank(percent)
  const wrong = totalSlots - totalCorrect
  const scoreColor = percent >= 70 ? '#22c55e' : percent >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', gap: 24,
    }}>
      {/* Score circle */}
      <div style={{ position: 'relative', width: 132, height: 132 }}>
        <ScoreCircle percent={percent} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
            {percent}%
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)', marginTop: 2 }}>
            {totalCorrect}/{totalSlots}
          </span>
        </div>
      </div>

      {/* Rank */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>{rank.emoji}</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: rank.color }}>{rank.label}</p>
      </div>

      {/* Correct / Wrong stats */}
      <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 280 }}>
        <div style={{
          flex: 1, background: 'rgba(34,197,94,0.1)', borderRadius: 16,
          padding: '14px 12px', textAlign: 'center',
          border: '1px solid rgba(34,197,94,0.25)',
        }}>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#22c55e' }}>{totalCorrect}</p>
          <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, marginTop: 2 }}>✅ Đúng</p>
        </div>
        <div style={{
          flex: 1, background: 'rgba(239,68,68,0.1)', borderRadius: 16,
          padding: '14px 12px', textAlign: 'center',
          border: '1px solid rgba(239,68,68,0.25)',
        }}>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>{wrong}</p>
          <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginTop: 2 }}>❌ Sai</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <button
          onClick={onRestart}
          className="gradient-brand"
          style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            color: 'white', fontWeight: 700, fontSize: 15,
            cursor: 'pointer', touchAction: 'manipulation',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <RotateCcw size={18} strokeWidth={2} />
          Làm bài khác
        </button>
        <button
          onClick={onHome}
          style={{
            width: '100%', height: 48, borderRadius: 14,
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            color: 'var(--color-muted-foreground)',
            fontWeight: 600, fontSize: 14,
            cursor: 'pointer', touchAction: 'manipulation',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Home size={16} strokeWidth={2} />
          Về trang chủ
        </button>
      </div>
    </div>
  )
}
