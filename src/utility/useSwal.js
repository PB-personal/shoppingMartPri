import Swal from 'sweetalert2'

export function useSwal() {
  const showAlert = async (options) => {
    await Swal.fire(options)
  }

  const showSuccess = async (message) => {
    await showAlert({
      title: 'Success',
      text: message,
      icon: 'success',
      position: 'top-end',
      showConfirmButton: true,
      timer: 1500,
    })
  }

  const showError = async (message) => {
    await showAlert({
      title: 'Error',
      text: message,
      icon: 'error',
      position: 'top-end',
      showConfirmButton: true,
      timer: 1500,
    })
  }

  const showConfirm = async (message) => {
    await showAlert({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
  }

  return { showSuccess, showError, showConfirm }
}
