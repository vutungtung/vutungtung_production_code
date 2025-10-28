type Props = {
  vehicleTitle: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteVehicleModal = ({ vehicleTitle, onClose, onConfirm }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-center">
        <h2 className="text-xl font-bold mb-4">Delete Vehicle</h2>
        <p>
          Are you sure you want to delete <strong>{vehicleTitle}</strong>?
        </p>
        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red text-white rounded hover:bg-red/80"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVehicleModal;
