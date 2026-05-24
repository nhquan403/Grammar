import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface Props {
  completed: number
}

export function StudyCompletionScreen({ completed }: Props) {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '32px 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
        Hoàn thành rồi!
      </h2>
      <p style={{ fontSize: 16, color: '#475569', marginBottom: 6 }}>
        Bạn đã ôn tập <strong>{completed}</strong> word{completed !== 1 ? 's' : ''} hôm nay.
      </p>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 40, lineHeight: 1.6 }}>
        Quay lại vào ngày mai để tiếp tục duy trì streak! 🔥
      </p>
      <Button
        onClick={() => navigate('/')}
        style={{ width: '100%', height: 52, fontSize: 16, background: '#6366f1', color: 'white', borderRadius: 14 }}
      >
        Về trang chủ
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate('/browse')}
        style={{ width: '100%', marginTop: 10, height: 48 }}
      >
        Khám phá thêm từ mới →
      </Button>
    </div>
  )
}
