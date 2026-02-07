import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    connect() {
        console.log("Direct JSON Shopping Cart Controller Connected")
    }

    updateQuantity(event) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.performUpdate(event)
        }, 300)
    }

    performUpdate(event) {
        const input = event.target
        const form = input.closest("form")
        const card = input.closest(".card")
        const itemId = input.parentElement.querySelector("input[name='id']").value

        // Visual feedback
        card.style.opacity = "0.5"

        fetch(form.action, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: new URLSearchParams(new FormData(form))
        })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok")
                return response.json()
            })
            .then(data => {
                card.style.opacity = "1"

                if (data.status === "removed") {
                    card.remove()
                    // Reload if empty
                    if (document.querySelectorAll(".card").length <= 1) { // Only summary card left
                        window.location.reload()
                    }
                } else {
                    // Update Item Total
                    const itemTotalEl = document.getElementById(`item-total-${itemId}`)
                    if (itemTotalEl) itemTotalEl.textContent = data.item_total

                    // Update Cart Subtotal and Total
                    const subtotalEl = document.getElementById("cart-subtotal")
                    const totalEl = document.getElementById("cart-total")

                    if (subtotalEl) subtotalEl.textContent = data.cart_total
                    if (totalEl) totalEl.textContent = data.cart_total
                }
            })
            .catch(error => {
                console.error("Error:", error)
                card.style.opacity = "1"
                alert("Error updating cart. Please check your connection.")
            })
    }
}
