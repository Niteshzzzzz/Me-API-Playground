function ToastStack({ toasts }) {
  return (
    <div className="fixed right-6 top-6 z-50 flex max-w-xs flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`backdrop-blur-sm 
            ${toast.tone === 'success'
              ? 'rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-xs text-emerald-100'
              : 'rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-100'}`
          }
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastStack
