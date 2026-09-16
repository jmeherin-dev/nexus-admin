export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl text-xl">⚠️</div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{title || 'Are you sure?'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{message || 'This action cannot be undone.'}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}