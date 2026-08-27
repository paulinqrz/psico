export function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  title: string; 
  message: string; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px'
      }}
      onClick={onCancel}
    >
      <div 
        className="card" 
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          background: '#ffffff',
          borderRadius: '14px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn" 
            style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none' }} 
            onClick={onConfirm}
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}

