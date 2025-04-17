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
        <Dialog open={isOpen} onClose={onClose} className="relative z-99999">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 
                data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-5xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >

                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 w-full">
                            <div className="sm:flex sm:items-start w-full">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <DialogTitle as="h2" className="text-xl font-medium leading-6 text-gray-900">
                                        {title}
                                    </DialogTitle>
                                    <div className="mt-2 w-full">{children}</div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <Button variant="danger" size="sm" onClick={onClose} className="mb-4 mr-1.5">
                                Cancel
                            </Button>
                        </div> */}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalComponent;
export { ModalComponent as ModalComponent };