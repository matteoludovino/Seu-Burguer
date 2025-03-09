document.addEventListener('DOMContentLoaded', function () {
    const Headermenu = document.querySelector('.menu-icon');
    const NavMenu = document.querySelector('.nav-menu');
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cartCounter = document.getElementById('cart-count');
    const addressInput = document.getElementById('address');
    const addressWarn = document.getElementById('address-warn');
    const dateElement = document.getElementById('date');

    let cart = [];

    Headermenu.addEventListener('click', () => {
        Headermenu.classList.toggle('ativo');
        NavMenu.classList.toggle('ativo');
    });

    cartBtn.addEventListener('click', function () {
        updateCartModal();
        cartModal.classList.remove('hidden');
    });

    cartModal.addEventListener('click', function (event) {
        if (event.target === cartModal) {
            cartModal.classList.add('hidden');
        }
    });

    closeModalBtn.addEventListener('click', function () {
        cartModal.classList.add('hidden');
    });

    document.addEventListener('click', function (event) {
        let parentButton = event.target.closest('.add-to-cart-btn');

        if (parentButton) {
            const name = parentButton.getAttribute('data-name');
            const price = parseFloat(parentButton.getAttribute('data-price'));
            addToCart(name, price);
        }
    });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                price,
                quantity: 1,
            });
        }

        updateCartModal();
    }

    function updateCartModal() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');

            cartItemElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <p class="item-title">${item.name}</p>
                        <p>Qtd: ${item.quantity}</p>
                        <p class="item-price">R$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            `;

            total += item.price * item.quantity;
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotal.textContent = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

        cartCounter.innerHTML = cart.length;
    }

    cartItemsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-btn')) {
            const name = event.target.getAttribute('data-name');
            removeItemCart(name);
        }
    });

    function removeItemCart(name) {
        const index = cart.findIndex(item => item.name === name);

        if (index !== -1) {
            const item = cart[index];

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }

            updateCartModal();
        }
    }

    addressInput.addEventListener('input', function (event) {
        let inputValue = event.target.value;

        if (inputValue !== '') {
            addressInput.classList.remove('border-red-500');
            addressWarn.classList.add('hidden');
        }
    });

    checkoutBtn.addEventListener('click', function (event) {

        const isOpen = checkRestaurantOpen();

        if (!isOpen) {
            Toastify({
                text: 'O restaurante está fechado agora!',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: {
                    background: '#ef4444',
                },
            }).showToast();
            return;
        }

        if (cart.length === 0) {
            Toastify({
                text: 'Seu carrinho está vazio!',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: {
                    background: '#ef4444',
                },
            }).showToast();
            return;
        }

        if (addressInput.value === '') {
            addressWarn.classList.remove('hidden');
            addressInput.classList.add('border-red-500');
            return;
        }

        const cartItems = cart.map((item) => {
            return `${item.name} - Quantidade: ${item.quantity} - Valor: R$${item.price.toFixed(2)}\n`;
        }).join('');
    
        const message = `Pedido:\n${cartItems}\nEndereço de entrega: ${addressInput.value}`;
    
        const encodedMessage = encodeURIComponent(message);
    
        const phone = '5532999150227';
    
        const whatsappLink = `https://wa.me/${phone}?text=${encodedMessage}`;
    
        window.open(whatsappLink, '_blank');
    
        cart = [];
        updateCartModal();
    });

    function checkRestaurantOpen() {
        const data = new Date();
        const hora = data.getHours();
        return hora >= 17 && hora < 23;
    }

    function updateRestaurantStatus() {
        const isOpen = checkRestaurantOpen();
        if (isOpen) {
            dateElement.classList.remove('text-red-500');
            dateElement.classList.add('text-green-500');
        } else {
            dateElement.classList.remove('text-green-500');
            dateElement.classList.add('text-red-500');
        }
    }

    setInterval(updateRestaurantStatus, 60000);

    updateRestaurantStatus();
});