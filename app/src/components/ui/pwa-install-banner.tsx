import { Download, X, Share } from 'lucide-react'

interface Props {
  isIOS: boolean
  onInstall: () => void
  onDismiss: () => void
}

export function PwaInstallBanner({ isIOS, onInstall, onDismiss }: Props) {
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 100,
      background: 'white',
      borderRadius: 16,
      padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'slideUp 0.3s ease',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>
        📚
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Cài Vocab Family</p>
        {isIOS ? (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 1, lineHeight: 1.4 }}>
            Nhấn <Share size={11} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} />
            <strong> Share</strong> → <strong>Thêm vào màn hình chính</strong>
          </p>
        ) : (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
            Thêm vào màn hình chính để trải nghiệm tốt hơn
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {!isIOS && (
          <button
            onClick={onInstall}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: '#6366f1', color: 'white',
              border: 'none', borderRadius: 10, padding: '8px 12px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Download size={14} />
            Cài
          </button>
        )}
        <button
          onClick={onDismiss}
          style={{
            minWidth: 32, minHeight: 32, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc', border: 'none', borderRadius: 8,
            cursor: 'pointer', color: '#94a3b8',
          }}
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
