export function loadCart(){
    let cart = localStorage.getItem("cart");
    if(!cart){
        cart = {
            orderedItems:[],
            days: 1,
            startingDate: formatDate(new Date()),
            endingDate: formatDate(new Date())
        }
        localStorage.setItem("cart",JSON.stringify(cart))
        return cart;
    }
    cart = JSON.parse(cart);
    return cart;
}

export function addcart(key,price,qty){
    const cart = loadCart();
    let found = false;

    for(let i=0; i<cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key===key){
            found = true;
        }
    }
    if(!found){
        cart.orderedItems.push({key:key,price:price, qty:qty});
    }
    localStorage.setItem("cart",JSON.stringify(cart));
}

export function removeFromCart(key){
    const cart = loadCart();
    cart.orderedItems = cart.orderedItems.filter((item) => item.key !== key);
    localStorage.setItem("cart",JSON.stringify(cart));
}

export function updateCart(days){
    const cart = loadCart();
    cart.days = days;
    localStorage.setItem("cart",JSON.stringify(cart));
}

export function incrementQuentity(key){
    const cart = loadCart();
    for(let i=0; i<cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key===key){
            cart.orderedItems[i].qty += 1;
        }
    }
    localStorage.setItem("cart",JSON.stringify(cart));
}

export function decrementQuentity(key){
    const cart = loadCart();
    for(let i=0; i<cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key===key){
            cart.orderedItems[i].qty -= 1;
        }
    }
    localStorage.setItem("cart",JSON.stringify(cart));
}

export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}