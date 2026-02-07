import { Turbo } from "@hotwired/turbo-rails"

Turbo.config.forms.confirm = (message, element) => {
    const modalElement = document.getElementById('confirmationModal');

    // Fallback to native confirm if modal is missing (safety check)
    if (!modalElement) {
        return confirm(message);
    }

    const modal = new bootstrap.Modal(modalElement);
    const messageElement = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmBtn');

    messageElement.textContent = message;
    modal.show();

    return new Promise((resolve) => {
        // Handle "Yes" click
        confirmBtn.onclick = () => {
            modal.hide();
            resolve(true); // Proceed with the action
        };

        // Handle Modal Close (Cancel/Backdrop/X)
        modalElement.addEventListener('hidden.bs.modal', () => {
            resolve(false); // Cancel the action
        }, { once: true });
    });
};
