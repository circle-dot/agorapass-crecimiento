import Swal from 'sweetalert2';

// Function to copy text to clipboard and show a Swal notification
export async function copyToClipboard(text: string) {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    try {
        // Copy text to clipboard
        await navigator.clipboard.writeText(text);

        // Show success notification using SweetAlert
        Toast.fire({
            icon: "success",
            title: "Text has been copied to the clipboard."
        });
    } catch (error) {
        // Show error notification using SweetAlert
        Toast.fire({
            icon: "error",
            title: "There was an error copying the text to the clipboard."
        });
        console.error('Error copying text to clipboard:', error);
    }
}
