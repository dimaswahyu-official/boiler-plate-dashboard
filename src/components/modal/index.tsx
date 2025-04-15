'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { FaTrash, FaPlus, FaEdit, FaFileImport } from 'react-icons/fa';
import Button from "../../components/ui/button/Button";
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";


export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)} className="mb-4">
        <FaPlus className="mr-2" /> Add User
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-99999">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      Add User
                    </DialogTitle>

                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of your data will be permanently removed.
                        This action cannot be undone.
                      </p>

                      <DefaultInputs />

                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button variant="secondary" size="sm" onClick={() => setOpen(false)} className="mb-4">
                  Submit
                </Button>

                <Button variant="danger" size="sm" onClick={() => setOpen(false)} className="mb-4 mr-1.5">
                  Cancel
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
