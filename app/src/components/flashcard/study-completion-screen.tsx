import { useNavigate } from 'react-router-dom'
import { Home, BookOpen } from 'lucide-react'

interface Props {
  completed: number
}

export function StudyCompletionScreen({ completed }: Props) {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      flex: 1, padding: '32px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>

      <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-foreground)', marginBottom: 8 }}>
        Hoàn thành rồi!
      </h2>

      {/* Session stat chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 20, padding: '8px 16px', marginBottom: 16,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }}>{completed}</span>
        <span style={{ fontSize: 13, color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
          từ đã ôn tập hôm nay
        </span>
      </div>

      <p style={{ fontSize: 14, color: 'var(--color-muted-foreground)', marginBottom: 40, lineHeight: 1.6 }}>
        Quay lại vào ngày mai để tiếp tục duy trì streak! 🔥
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <button
          onClick={() => navigate('/')}
          className="gradient-brand"
          style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            color: 'white', fontWeight: 700, fontSize: 15,
            cursor: 'pointer', touchAction: 'manipulation',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Home size={18} strokeWidth={2} />
          Về trang chủ
        </button>
        <button
          onClick={() => navigate('/browse')}
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
          <BookOpen size={16} strokeWidth={2} />
          Khám phá thêm từ mới
        </button>
      </div>
    </div>
  )
}
