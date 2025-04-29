import { useState, ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from "../ui/button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const ModalComponent = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-99999">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 
        data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-7xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-8 pt-8 pb-8 sm:p-10 sm:pb-10 w-full">
              <div className="sm:flex sm:items-start w-full">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <DialogTitle as="h2" className="text-3xl font-medium leading-8 text-gray-900">
                    {title}
                  </DialogTitle>
                  <div className="mt-6 w-full text-lg">{children}</div>
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
export { ModalComponent as ModalComponent };
