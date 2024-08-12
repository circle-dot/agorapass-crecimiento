import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function showAlert(icon: 'error' | 'success', title: string, text: string, showCancelButton = false, confirmButtonText = 'OK') {
    return MySwal.fire({
        icon,
        title,
        text,
        showCancelButton,
        confirmButtonText,
        cancelButtonText: 'Close',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
    });
}
