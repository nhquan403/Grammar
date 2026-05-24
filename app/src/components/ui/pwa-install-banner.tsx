import { useState } from 'react'
import { Download, X } from 'lucide-react'

interface Props {
  isIOS: boolean
  onInstall: () => void
  onDismiss: () => void
}

function IOSInstallGuide({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', background: 'white', borderRadius: '20px 20px 0 0',
          padding: '20px 20px 40px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Cài đặt ứng dụng</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#94a3b8" />
          </button>
        </div>

        {[
          {
            step: '1', icon: '☝️',
            title: 'Cuộn lên đầu trang',
            desc: 'Thanh công cụ Safari bị ẩn khi cuộn — hãy cuộn lên để hiện lại',
          },
          {
            step: '2', icon: '⬜↑',
            title: 'Nhấn nút Share (hình vuông có mũi tên lên)',
            desc: 'Nút nằm ở giữa thanh dưới cùng của Safari, trông như □ với mũi tên ↑',
          },
          {
            step: '3', icon: '📱',
            title: 'Chọn "Thêm vào màn hình chính"',
            desc: 'Vuốt xuống trong danh sách tùy chọn, tìm mục có biểu tượng + màu xanh',
          },
          {
            step: '4', icon: '✅',
            title: 'Nhấn "Thêm" để hoàn tất',
            desc: 'App sẽ xuất hiện trên màn hình chính như ứng dụng thật',
          },
        ].map(({ step, icon, title, desc }) => (
          <div key={step} style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
                Bước {step}: {title}
              </p>
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{desc}</p>
            </div>
          </div>
        ))}

        <div style={{
          background: '#f8fafc', borderRadius: 12, padding: '10px 14px',
          fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.5,
        }}>
          💡 Tính năng này chỉ hoạt động trên <strong>Safari</strong>. Nếu dùng Chrome/Firefox, hãy mở lại bằng Safari.
        </div>
      </div>
    </div>
  )
}

export function PwaInstallBanner({ isIOS, onInstall, onDismiss }: Props) {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <>
      <div style={{
        position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 100,
        background: 'white', borderRadius: 16,
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
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
            {isIOS ? 'Thêm vào màn hình chính để dùng offline' : 'Thêm vào màn hình chính để trải nghiệm tốt hơn'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {isIOS ? (
            <button
              onClick={() => setShowGuide(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: '#6366f1', color: 'white',
                border: 'none', borderRadius: 10, padding: '8px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              ⬆️ Hướng dẫn
            </button>
          ) : (
            <button
              onClick={onInstall}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: '#6366f1', color: 'white',
                border: 'none', borderRadius: 10, padding: '8px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                touchAction: 'manipulation',
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
              touchAction: 'manipulation',
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

      {showGuide && <IOSInstallGuide onClose={() => setShowGuide(false)} />}
    </>
  )
}
