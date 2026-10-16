import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    connect() {
        this.items = []
        this.checkEmptyState()
    }

    checkEmptyState() {
        const emptyState = document.getElementById("empty-state")
        const billContainer = document.getElementById("bill-items-container")

        if (this.items.length === 0) {
            emptyState.classList.remove("d-none")
            billContainer.classList.add("d-none")
        } else {
            emptyState.classList.add("d-none")
            billContainer.classList.remove("d-none")
        }
    }

    clearCart() {
        if (confirm("Are you sure you want to clear the cart?")) {
            this.items = []
            this.renderBill()
            this.checkEmptyState()
        }
    }

    search(event) {
        const query = event.target.value
        fetch(`/admin/billing/search_products?query=${query}`)
            .then(response => response.text())
            .then(html => {
                document.getElementById("product-list").innerHTML = html
            })
    }

    addItem(event) {
        const id = event.currentTarget.dataset.id
        const name = event.currentTarget.dataset.name
        const price = parseFloat(event.currentTarget.dataset.price)
        const stock = parseInt(event.currentTarget.dataset.stock)

        if (stock <= 0) {
            alert("Out of Stock!")
            return
        }

        const existingItem = this.items.find(item => item.id === id)
        if (existingItem) {
            if (existingItem.quantity >= stock) {
                alert("Cannot add more than available stock!")
                return
            }
            existingItem.quantity += 1
        } else {
            this.items.push({ id, name, price, quantity: 1 })
        }
        this.renderBill()
        this.checkEmptyState()
    }

    renderBill() {
        const container = document.getElementById("bill-items")
        container.innerHTML = ""
        let subtotal = 0

        this.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity
            subtotal += itemTotal

            const div = document.createElement("div")
            div.className = "d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom-dashed"
            div.innerHTML = `
        <div class="text-truncate" style="max-width: 60%;">
           <div class="font-weight-bold">${item.name}</div>
           <small class="text-muted">₹${item.price} x ${item.quantity}</small>
        </div>
        <div class="d-flex align-items-center">
           <span class="font-weight-bold mr-2">₹${itemTotal.toFixed(2)}</span>
           <button class="btn btn-sm btn-outline-danger btn-circle" data-index="${index}">
             <i class="fas fa-trash"></i>
           </button>
        </div>
      `

            div.querySelector('button').addEventListener('click', (e) => {
                this.items.splice(index, 1)
                this.renderBill()
                this.checkEmptyState()
            })

            container.appendChild(div)
        })

        document.getElementById("subtotal-amount").innerText = `₹${subtotal.toFixed(2)}`
        this.calculateTotal()
    }

    calculateTotal() {
        const subtotal = parseFloat(document.getElementById("subtotal-amount").innerText.replace('₹', ''))
        const discountPercent = parseFloat(document.getElementById("discount-percentage").value) || 0

        const discountAmount = subtotal * (discountPercent / 100)
        const total = subtotal - discountAmount

        document.getElementById("total-amount").innerText = `₹${total.toFixed(2)}`
    }

    checkout() {
        if (this.items.length === 0) {
            alert("Cart is empty!")
            return
        }

        const email = document.getElementById("customer-email").value || `guest_${Date.now()}@raksh.com`
        const name = document.getElementById("customer-name").value
        const phone = document.getElementById("customer-phone").value
        const address = document.getElementById("customer-address").value
        const paymentMethod = document.getElementById("payment-method").value
        const discount = document.getElementById("discount-percentage").value
        const total = parseFloat(document.getElementById("total-amount").innerText.replace('₹', ''))

        if (!name || !phone) {
            alert("Please enter Customer Name and Phone Number.")
            return
        }

        fetch("/admin/billing/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
            },
            body: JSON.stringify({
                customer_email: email,
                customer_name: name,
                customer_phone: phone,
                customer_address: address,
                payment_method: paymentMethod,
                discount_percentage: discount,
                total_amount: total,
                items: this.items
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Order verified! Printing Bill...")
                    this.items = []
                    this.renderBill()
                    this.checkEmptyState()
                    window.location.reload()
                } else {
                    alert("Error: " + data.message)
                }
            })
    }
}
