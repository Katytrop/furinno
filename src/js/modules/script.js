import {MSIE} from './functions.js';
import {ibg} from './ibg.js';

const isMobile = MSIE(); 

window.onload = function () {
    document.addEventListener('click', documentActions) 

    // actoins отслеживание клика на всем документе
    function documentActions(e) {
        const targetElem = e.target;

        //arrows
        if(window.innerWidth > 768 && isMobile.any()) {
            if(targetElem.classList.contains('menu__arrow')) {
                targetElem.closest('.menu__item').classList.toggle('_hover');
            }
            if(!targetElem.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                document.querySelectorAll('.menu__item._hover').forEach( item => {
                    item.classList.remove('_hover');
                })
            }
        }

        // search
        if(targetElem.classList.contains('search-form__icon')) {
            document.querySelector('.search-form').classList.toggle('_active');
        } else if (!targetElem.closest('.search-form') && document.querySelector('.search-form._active')) {
            document.querySelector('.search-form').classList.remove('_active');
        }

        // btn-more
        if(targetElem.classList.contains('products__more')) {
            getProducts(targetElem);
            e.preventDefault();
        }

        // add to cart
        if(targetElem.classList.contains('actions-product__button')) {
            e.preventDefault();
            const productId = targetElem.closest('.item-product').dataset.pid;
            addToCart(targetElem, productId);
        }

        // click to icon cart
        if(targetElem.classList.contains('cart-header__icon') || targetElem.closest('.cart-header__icon')) {
            if(document.querySelector('.cart-list').children.length > 0) {
                document.querySelector('.cart-header').classList.toggle('_active');
            }
            e.preventDefault();
        } else if(!targetElem.closest('.cart-header') && !targetElem.classList.contains('actions-product__button')){
            document.querySelector('.cart-header').classList.remove('_active');
        }

        // delete to cart
        if(targetElem.classList.contains('cart-list__delete')) {
            const productId = targetElem.closest('.cart-list__item').dataset.cartPid;
            updateCart(targetElem, productId, false);
            e.preventDefault();
        }

    }


    // header 
    const headerEl = document.querySelector('.header');
    
    const callback = function (entries, observer) {
        if(entries[0].isIntersecting) {
            headerEl.classList.remove('_scroll');
        } else {
            headerEl.classList.add('_scroll');
        }
    }
    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerEl);


    //getProducts()
    async function getProducts(button)  {
        if(!button.classList.contains('_hold')) {
            button.classList.add('_hold');
            const file = "files/products.json"
            let responce = await fetch(file, {
                method: "GET"
            });
            
            if(responce.ok) {
                let result = await responce.json();
                console.log('', result);
                loadProducts(result);
                button.classList.remove('_hold');
                button.remove();
            } else {
                alert('ошибка')
            }
        }
    }

    function loadProducts(data) {
        const productsItems = document.querySelector('.products__items');

        data.products.forEach(item => {
            const productId = item.id;
            const productUrl = item.url;
            const productImage = item.image;
            const productTitle = item.title;
            const productText = item.text;
            const productPrice = item.price;
            const productOldPrice = item.oldPrice;
            const productShareUrl = item.shareUrl;
            const productLikeUrl = item.likeUrl;
            const productLabels = item.labels;

            let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				productLabels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}

			let productTemplateImage = `
                <a href="${productUrl}" class="item-product__image ibg">
                    <img src="img/products/${productImage}" alt="${productTitle}">
                </a>
            `;

			let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
                <div class="item-product__content">
                    <h3 class="item-product__title">${productTitle}</h3>
                    <div class="item-product__text">${productText}</div>
                </div>
            `;

			let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
			let productTemplatePricesEnd = `</div>`;

			productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if (productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
                <div class="item-product__actions actions-product">
                    <div class="actions-product__body">
                        <a href="" class="actions-product__button btn btn_white">Add to cart</a>
                        <a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
                        <a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
                    </div>
                </div>
            `;

			let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;

            productsItems.insertAdjacentHTML('beforeend', productTemplate);
            ibg();
        });


    } 

    //add to cart 
    function addToCart(productButton, productId) {
        if(!productButton.classList.contains('_hold')) {
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');

            const cart = document.querySelector('.cart-header__icon');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.item-product__image');

            const productImageFly = productImage.cloneNode(true);

            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;

            productImageFly.setAttribute('class', '_flyImage ibg');
            productImageFly.style.cssText = `
            left: ${productImageFlyLeft}px;
            top: ${productImageFlyTop}px;
            width: ${productImageFlyWidth}px;
            height: ${productImageFlyHeight}px;
            `;

            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText = 
            `
                left: ${cartFlyLeft}px;
                top: ${cartFlyTop}px;
                width: 0;
                height: 0;
                opacity: 0;
            `;

            productImageFly.addEventListener('transitionend', function () {
                if(productButton.classList.contains('_fly')) {
                    productImageFly.remove(); //удаляем клон карт когда он долетел
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');

                }
            })

        }
        ibg();
    }

    function updateCart(productButton, productId, productAdd = true) {
        const cart = document.querySelector('.cart-header');
        const cartIcon = cart.querySelector('.cart-header__icon');
        const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = document.querySelector('.cart-list');

        //add to cart
        if(productAdd) {
            if(cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
                cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`)
            }

            if(!cartProduct) {
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const cartProductImage = product.querySelector('.item-product__image').innerHTML;
            const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
            const cartProductContent = `
                <a href="" class="cart-list__image ibg">${cartProductImage}</a>
                <div class="cart-list__body">
                    <a href="" class="cart-list__title">${cartProductTitle}</a>
                    <div class="cart-list__quantity">Quantity: <span>1</span></div>
                    <a href="" class="cart-list__delete">Delete</a>
                </div>
            `;
            cartList.insertAdjacentHTML('beforeend', 
                `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`)
            } else {
                const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
            }

            productButton.classList.remove('_hold');
            ibg();
        } else { //delete from cart
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
            if(!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            }

            const cartQuantityValue = --cartQuantity.innerHTML;
            if(cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue
            } else {
                cartQuantity.remove();
                cart.classList.remove('_active');
            }
        } 
    }

    //furniture
    const furniture =document.querySelector('.furniture__body');

    if(furniture && !isMobile.any()) {
        const furnitureItems =document.querySelector('.furniture__items');
        const furnitureColumn =document.querySelectorAll('.furniture__column');

        const speed = furniture.dataset.speed;
        let positionX = 0;
        let coordXproc = 0;

        function setMouseGalleryStyle() {
            let furnitureItemsWidth = 0;
            furnitureColumn.forEach(element => {
                furnitureItemsWidth += element.offsetWidth;   
            });

            const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
            const distX = Math.floor(coordXproc - positionX);

            positionX = positionX + (distX * speed);
            let position = furnitureDifferent / 200 * positionX;

            furnitureItems.style.cssText = `transform: translate(${-position}px,0)`;

            if(Math.abs(distX) > 0) {
                requestAnimationFrame(setMouseGalleryStyle);
            } else {
                furniture.classList.remove('_init');
            }
        }

        furniture.addEventListener('mousemove', function (e) {
            const furnitureWidth = furniture.offsetWidth;
            const coordX = e.pageX - furnitureWidth / 2;
            coordXproc = coordX / furnitureWidth * 200;

            if(!furniture.classList.contains('_init')) {
                requestAnimationFrame(setMouseGalleryStyle);
                furniture.classList.add('_init');
            }
        })
    }
    
}