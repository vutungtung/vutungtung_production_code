import { useRef, useEffect } from "react";

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
}: NotificationPanelProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <>
      {/* Sliding Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-1/2 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full space-y-3">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-2xl z-40" onClick={onClose} />
      )}
    </>
  );
};

export default NotificationPanel;
