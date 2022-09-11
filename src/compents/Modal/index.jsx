import React from 'react'

const Modal = ({ toCloseModal, dataToShow }) => {
  const handleClose = () => {
    closeModal()
  }

  return (
    <div className='overflow-y-auto  overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center bg-slate-900/60   w-full md:inset-0 h-full md:h-full'>
      <div className='relative p-4 w-full max-w-2xl h-full md:h-auto'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              shortlink to share
            </h3>
            <button
              onClick={toCloseModal}
              className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
            >
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clip-rule='evenodd'
                ></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>

          <div className='p-6 space-y-6'>
            <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {dataToShow}
            </p>
          </div>

          <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600'>
            <button
              onClick={toCloseModal}
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
