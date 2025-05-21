import { ReactNode } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "small" | "medium" | "large"; // Untuk lebar modal
  height?: string; // Tambahkan properti height
}

const ModalComponent = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  height = "auto", // Default tinggi modal
}: ModalProps) => {
  // Tentukan ukuran modal berdasarkan size
  const sizeClasses = {
    small: "sm:max-w-sm", // Lebar kecil
    medium: "sm:max-w-3xl", // Lebar sedang
    large: "sm:max-w-7xl", // Lebar besar
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-9999">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 
      data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full ${sizeClasses[size]}`}
            style={{ height }} // Gunakan properti height
          >
            <div className="bg-white px-8 pt-8 pb-8 sm:p-10 sm:pb-10 w-full">
              {/* Button X untuk close modal */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="sm:flex sm:items-start w-full">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <DialogTitle
                    as="h2"
                    className="text-3xl font-medium leading-8 text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <div
                    className="mt-6 w-full text-lg"
                    style={{ maxHeight: "auto", overflowY: "auto" }}
                  >
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalComponent;
