'use strict';
//global arrays to store the corresponding data
let item_storage = [],
    cart_storage = [];

//saving elements from page to work with
const TIME_STORAGE = document.querySelector('#time'),
    CURRENCY_SELECTION = document.querySelector('#currency'),
    ITEM_STORE = document.querySelector('.items'),
    CATEGORY = document.querySelector('.dropdown-menu'),
    CART_PANEL = document.querySelector('#cart_panel');

//pushing sample products to work with into the global array
item_storage.push(new Item(1, 'Arlberg Pine', 19.80, 43, 3, 'Artificial_Trees', 10, [], "150cm, along with flashing lights micro LED", '../imgs/norway_pine.png'),
    new Item(2, 'Decoration cones', 9.30, 60, 6, 'Balls', 4, [], '4 plastic bumps 5x7cm', '../imgs/green_balls.jpg'),
    new Item(3, 'Branch garland', 14.99, 32, 4, 'Garlands', 7, [], 'Decorative 1m garland 240 bulbs', '../imgs/branch_garland.jpg'),
    new Item(4, 'Christmas Deer', 7.99, 39, 6, 'Toys', 6, [], '21cm decorative deer covered with sequins', '../imgs/christmas_deer.jpg'),
    new Item(5, 'Dandelion garland', 11.49, 15, 2, 'Garlands', 5, [], '40cm, 160 warm yellow bulbs', '../imgs/dandelion_stripe.jpg'),
    new Item(6, 'Christmas toy', 13.49, 5, 1, 'Toys', 10, [], 'Solid decorative figure Snowman&Santa 7cm', '../imgs/iceman+santa.jpg'),
    new Item(7, 'Icicle tree toy', 9.99, 44, 5, 'Balls', 4, [], '15cm extra light glass toy', '../imgs/icicle_ball.jpg'),
    new Item(8, 'Icicle decoration', 10.70, 30, 4, 'Toys', 3, [], 'Cold white 12cm icicles, a set of 24 bulbs per purchase', '../imgs/icicle.jpg'),
    new Item(9, 'Low fir tree', 16.70, 71, 3, 'Artificial_Trees', 10, [], '30cm extremely durable and cozy', '../imgs/low_fir.jpg'),
    new Item(10, 'Snowy fir', 18.40, 62, 2, 'Artificial_Trees', 10, [], 'Alpine 90cm tree covered with artificial snowflakes', '../imgs/snowy_fir_tree.jpg'),
    new Item(11, 'Red balls', 8.90, 6, 7, 'Balls', 3, [], 'Set 6x5 3cm christmas decoration balls', '../imgs/red_balls.jpg'),
    new Item(12, 'Santa toy', 8.90, 87, 5, 'Toys', 4, [], 'Porcelain santa 6cm height with coca-cola bottle', '../imgs/santa_klaus.jpg'),
    new Item(13, 'Colored balls', 10, 67, 5, 'Balls', 3, [], 'Set of 30 6cm plastic balls', '../imgs/set_balls.jpg'),
    new Item(14, 'Snowflake garland', 15, 37, 3, 'Garlands', 7, [], 'Warm white 1.2m snowflakes, 8 per pack', '../imgs/snowflake.jpg'),
    new Item(15, 'Compact fir tree', 8.70, 51, 3, 'Artificial_Trees', 8, [], '25cm minimalism style', '../imgs/thin_fir_tree.jpg'));

//constructor to make a shop Item
function Item(id, name, price, quantity, max_purchase, category,
    shipping, reviews, description, image) {
    this.id = id, //int
        this.name = name, //string
        this.price = price, //float
        this.quantity = quantity, //int
        this.max_purchase = max_purchase, //int
        this.category = category, //string
        this.shipping_cost = shipping, //float
        this.reviews = reviews, //array
        this.description = description, //string
        this.image = image; //string

    //creates a wrapper to store all Item elements
    this.showItem = function() {
        let item_div = document.createElement('div');
        item_div.classList.add('item_cart');
        //set name to filter Items by category
        item_div.setAttribute('name', `${this.category}`);
        //append all the elements that user should see
        item_div.append(this.showImage(), this.showName(), this.showPrice(),
            this.showQuantity(), this.footerBox(), this.showDetails());
        //set event should happen by click on the elements inside the wrapper
        item_div.addEventListener('click', (event) => {
            //getting the click target
            let target = event.target;
            //check if user wants to buy Item
            if (target.classList.contains('fa-shopping-basket')) {
                //gets the amount from the element input
                let amount = item_div.querySelector('input').value;
                //creates new Cart item with the amount from input
                this.createCartItem(+amount);
            } // check if user wants to see Item details
            else if (target.classList.contains('fa-chevron-down')) {
                //shows or hides the div with Item details
                item_div.lastChild.classList.toggle('hidden');
            }
        });
        return item_div;
    }

    //creates image container for Item instance
    this.showImage = function() {
        let image_frame = document.createElement('div');
        image_frame.classList.add('image-container');
        //set the image as the background for container
        image_frame.style.backgroundImage = 'url(' + this.image + ')';
        return image_frame;
    }

    //create html element for the name
    this.showName = function() {
        let name_p = document.createElement('p');
        name_p.classList.add('product_name');
        //pass name of an instance
        name_p.innerText = this.name;
        //add the button to show additional info
        name_p.append(this.detailsButton());
        return name_p;
    }

    //adds button to show additional details about the Item
    this.detailsButton = function() {
        let show = document.createElement('button');
        show.classList.add('details_button');
        show.innerHTML = '<i class="fas fa-chevron-down"></i>';
        show.addEventListener('click', () => show.classList.toggle('rotate'));
        return show;
    }

    //create html element for the price
    this.showPrice = function() {
        let price_p = document.createElement('p');
        price_p.classList.add('price');
        //see the price of the element with selected currency
        price_p.innerText = convertCurrency(this.price);
        return price_p;
    }

    //create html element for the quantity in storage
    this.showQuantity = function() {
        let storage = document.createElement('p');
        storage.classList.add('stock_amount');
        //pass the quantity of the element to show to user
        storage.innerText = `Items left: ${this.quantity}`;
        //let user make purchases with quantity from the input
        let purchase = document.createElement('span');
        purchase.append(this.purchase_amount(), this.addToCart());
        //add interface for purchases to the element
        storage.append(purchase);
        return storage;
    }

    //create html element to select desired amount for purchase
    this.purchase_amount = function() {
        let amount = document.createElement('input');
        //prevent getting non-numerical values in input
        amount.setAttribute('type', 'number');
        //set minimal amount to purchase
        amount.setAttribute('min', '1');
        //set maximum amount for purchase
        amount.setAttribute('max', `${this.max_purchase}`);
        //set default amount for purchase
        amount.setAttribute('value', '1');
        /*prevent overriding max_purchase with data from the user,
        keeps purchase amount in available range for 1 customer*/
        amount.onkeypress = (e) => false;
        return amount;
    }

    //creates button to add product to cart
    this.addToCart = function() {
        let basket = document.createElement('button');
        basket.classList.add('add_cart');
        basket.innerHTML = `<i class="fas fa-shopping-basket"></i>`;
        return basket;
    }

    //division at the bottom with review button and ID
    this.footerBox = function() {
        let footer = document.createElement('div');
        footer.classList.add('item_footer');
        footer.append(this.addReview(), this.showID());
        return footer;
    }

    //create html element to show id
    this.showID = function() {
        let id_string = document.createElement('span');
        id_string.classList.add('product_id');
        //pass id of an instance
        id_string.innerText = `CHR_ID ${this.id}`;
        return id_string;
    }

    //add button to start the review
    this.addReview = function() {
        let review = document.createElement('button');
        review.classList.add('review_button');
        review.innerHTML = `<i class="fas fa-comments"></i> Review`;
        //execute opening dialog box to add the review by click
        review.addEventListener('click', () => {
            //append dialog box to the page
            let review = this.reviewBox();
            document.body.prepend(review);
            //show on the higher level to avoid interaction with other elements
            review.showModal();
        });
        return review;
    }

    //create dialog box for review
    this.reviewBox = function() {
        let dialog = document.createElement('dialog');
        //add textarea for review
        dialog.append(this.reviewArea());
        //add save review button
        dialog.append(this.saveReview(dialog));
        //add close button
        dialog.append(this.cancelReview(dialog));
        return dialog;
    }

    //create a review textarea
    this.reviewArea = function() {
        let area = document.createElement('textarea');
        area.setAttribute('rows', '10');
        area.setAttribute('cols', '50');
        //tell user that review is expected in this box
        area.setAttribute('placeholder', 'Please, enter your review');
        return area;
    }

    /*adds a button to submit the review for corresponding 
    item and close the wrapping element*/
    this.saveReview = function(box) {
        let submit = document.createElement('button');
        submit.classList.add('save_review');
        submit.innerText = 'Save';
        //save the review and close review dialog box
        submit.addEventListener('click', () => {
            this.createReview(box.firstChild);
            box.remove();
            alert('Thanks for your review!')
                //make added review visible
            displayItems(item_storage);
        });
        return submit;
    }

    //push new review from the user into the Item reviews array
    this.createReview = function(text_input) {
        //get entered by user text
        let new_review = text_input.value;
        //check the review area has text
        if (!!new_review.trim()) {
            this.reviews.push(new_review);
        } else alert('Empty reviews are not allowed, review can not be submitted');
    }

    //adds a button to close the box wrapping the element
    this.cancelReview = function(box) {
        let cancel = document.createElement('button');
        cancel.innerHTML = '<i class="fas fa-times"></i>';
        //prevents mandatory review adding
        cancel.addEventListener('click', () => {
            box.remove();
        });
        return cancel;
    }

    //creates new Cart instance from current Item details
    this.createCartItem = function(amount) {
        /*allows to check if the amount in store is less than max
        purchase per customer allowed. Test item - Red balls*/
        if (amount <= this.quantity) {
            //passes the Item details for further processing
            checkMatches(cart_storage, this.id, this.image, amount,
                this.max_purchase, this.price, this.shipping_cost);
            //renews amount in store on the page
            displayCart(cart_storage);
        } else alert('Sorry, insufficient amount of product in store');
    }

    //adds container with additional details about the product
    this.showDetails = function() {
        let details_box = document.createElement('div');
        details_box.classList.add('hidden', 'details_box');
        //creates paragraph with all the info being hidden by default
        let details = document.createElement('p');
        details.innerText = `${this.description}
            Max for 1 customer: ${this.max_purchase}
            Item category: ${this.category}
            Shipping cost: ${this.shipping_cost}
            Reviews:`;
        details_box.append(details);
        //loops through the reviews and appends each to the details_box
        this.reviews.forEach(el => {
            let review = document.createElement('p');
            review.innerText = `-${el}`;
            details_box.append(review);
        });
        return details_box;
    }
}

//constructor to make a cart item
function Cart(id, price, quantity, shipping, image) {
    this.id = id, //int
        this.price = price, //float
        this.quantity = quantity, //int
        this.shipping = shipping, //float
        this.image = image; //string

    //creates a wrapper to store all Cart item elements
    this.showCart = function() {
        let cart_div = document.createElement('div');
        cart_div.classList.add('cart_position');
        //append all the elements that user should see
        cart_div.append(this.showImage(), this.showName(), this.showQuantity(),
            this.showShipping(), this.cancelPlace());
        //set event should happen by click on the elements inside the wrapper
        cart_div.addEventListener('click', (event) => {
            //get the click target
            let target = event.target;
            //check if click was on the remove button icon
            if (target.classList.contains('far')) {
                //read amount from input
                let amount = cart_div.querySelector('input').value;
                //remove amount from cart
                this.removeFromCart(cart_storage, +amount);
            }
        });
        return cart_div;
    }

    //creates image container for Cart item instance
    this.showImage = function() {
        let image_frame = document.createElement('div');
        image_frame.classList.add('image-container');
        image_frame.style.backgroundImage = 'url(' + this.image + ')';
        return image_frame;
    }

    //create html element for the name&id
    this.showName = function() {
        let name_c = document.createElement('p');
        name_c.classList.add('product_name');
        //gets name from the corresponding item in the items array
        name_c.innerText = item_storage[this.id - 1].name + ` CHR_ID ${this.id}`;
        return name_c;
    }

    //create html element to show purchase details
    this.showQuantity = function() {
        let storage = document.createElement('p');
        storage.classList.add('cart_amount');
        //show purchase with converted price and number of items purchase
        storage.innerText = `Purchase: ${convertCurrency(this.price)} x ${this.quantity}`;
        return storage;
    }

    //create html element to show shipping details
    this.showShipping = function() {
        let shipping = document.createElement('p');
        shipping.classList.add('shipping_cost');
        shipping.innerText = `Estimated shipping: ${this.shipping}`;
        return shipping;
    }

    //create html element to select desired amount to erase from cart
    this.cancelAmount = function() {
        let amount = document.createElement('input');
        amount.setAttribute('type', 'number');
        amount.setAttribute('min', '1');
        //set maximum amount to cancel equal to amount in cart
        amount.setAttribute('max', `${this.quantity}`);
        amount.setAttribute('value', '1');

        //preventing failures connected to user input details
        amount.onkeypress = (e) => false;
        return amount;
    }

    //create html button to cancel purchase or reduce amount
    this.cancelPurchase = function() {
        let cancel_button = document.createElement('button');
        cancel_button.classList.add('cart_remove');
        cancel_button.innerHTML = `<i class="far fa-window-close"></i>`;
        return cancel_button;
    }

    //creates wrapping element with cancel input amount and button
    this.cancelPlace = function() {
        let space = document.createElement('div');
        space.classList.add('remove_div');
        space.append(this.cancelAmount(), this.cancelPurchase());
        return space;
    }

    //function takes array and number to remove from it
    this.removeFromCart = function(arr, qty) {
        //finding element with the same id in the storage
        let elem_id = arr.findIndex(el => el.id === this.id);
        //checks if amount to withdraw is less than items in the cart
        if (arr[elem_id].quantity <= qty) {
            //if less - removes item from cart
            arr.splice(elem_id, 1);
        } else {
            //else reduces amount to withdraw
            arr[elem_id].quantity -= qty;
        }
        //change the quantity of Item on hands
        alterQuantity(qty, this.id, false);
        //display refreshed data
        displayCart(arr);
    }
}

//function calculates details for total items + shipping price
function calcTotals() {
    //get all items in the cart total price
    let items_subtotal = cart_storage.reduce((prev, curr) => prev + curr.price * curr.quantity, 0);
    //get total shipping price
    let shipping = cart_storage.reduce((prev, curr) => prev + curr.shipping * curr.quantity, 0);
    return [items_subtotal, shipping];
}

//function returns html element with all details regarding purchase
function totalStorage() {
    let totals = document.createElement('div');
    //get total of price + shipping
    let subtotal = (calcTotals()[0] + calcTotals()[1]).toFixed(2);
    //get total tax
    let tax = ((calcTotals()[0] + calcTotals()[1]) * 0.13).toFixed(2);

    totals.classList.add('totals');
    //pass all the data into the element
    totals.innerHTML = `<hr> Items subtotal: 
        ${convertCurrency((calcTotals()[0]).toFixed(2))} <br>
        Estimated shipping: 
        ${convertCurrency((calcTotals()[1]).toFixed(2))} <br>
        Subtotal: ${convertCurrency(subtotal)} <br>
        Estimated tax: ${convertCurrency(tax)} <br>
        Total: 
        ${convertCurrency((+subtotal + +tax).toFixed(2))}`;
    return totals;
}

//function renders array to the page
function displayCart(array) {
    //check that array is not empty
    if (array.length > 0) {
        //clear the previous data
        CART_PANEL.innerHTML = "";
        //append each element to the page container
        array.forEach(el => {
            CART_PANEL.append(el.showCart())
        });
        //appends details about subtotal, taxes and total payment
        CART_PANEL.append(totalStorage());
    } // if empty shows following text 
    else CART_PANEL.innerText = 'No items in Cart';
}

//function displays items by category from the select dropbox
function displayCategory(category) {
    //get all the cart items on the pages
    let products = Array.from(ITEM_STORE.querySelectorAll('.item_cart'));
    //modifies visibility of each element
    products.map(el => {
        //if category isn't all and not matching selected - hide element
        if (el.getAttribute('name') !== category && category !== 'All') {
            el.classList.add('hidden');
        } //if matches - show element on th page 
        else el.classList.remove('hidden');
    });
}

//function checks matches with restriction parameters
function checkMatches(arr, id, image, amount, max_amount, price, shipping) {
    //checks if the element exists in array and returns it's index
    let exist = arr.findIndex(el => el.id === id);
    //if index is in the table starts the condition
    if (exist !== -1) {
        //if input amount and amount in the array are less than max allowed
        if ((arr[exist].quantity + amount) <= max_amount) {
            //add the amount from the input to the quantity
            arr[exist].quantity += amount;
            //change the quantity with input number
            alterQuantity(amount, id, true);
        } //if input amount + qty in the cart exceeds max per customer 
        else {
            //is it's still possible to add any amount to match maximum
            if (arr[exist].quantity < max_amount) {
                alert(`Maximum purchase per customer ${max_amount}`)
            } // if amount already full 
            else alert(`You've already bought maximum for 1 customer`);
            //change quantity to match maximum purchase
            alterQuantity((max_amount - arr[exist].quantity), id, true);
            arr[exist].quantity = max_amount;
        }
    } else { //push new item with input amount to the cart
        //input limitation won't allow to push more than max per customer 
        arr.push(new Cart(id, price, amount, shipping, image));
        //change amount of the products on hand
        alterQuantity(amount, id, true);
    }
}

//function subtracts or adds amount of product in global storage
function alterQuantity(number, id, buy) {
    //if buy - subtract
    if (buy) item_storage[id - 1].quantity -= number;
    //if return - add
    else item_storage[id - 1].quantity += number;
    //render changes to display
    displayItems(item_storage);
}

/*function takes price of the item and returns 
itself converted according to the currency ratio*/
function convertCurrency(price) {
    //get value of the dropdown
    let currency = CURRENCY_SELECTION.value;
    //change currency displaying
    if (currency === 'USD') price = `$${(price / 1.27).toFixed(2)}`;
    else if (currency === 'EUR') price = `€${(price / 1.43).toFixed(2)}`;
    else price = `С$${price}`;

    return price;
}

//function renders array of the items to the page container
function displayItems(items_array) {
    //clear the storage before inserting
    ITEM_STORE.innerHTML = "";
    //loop through array and append each of the items to container
    items_array.forEach(element => {
        ITEM_STORE.append(element.showItem());
    });
}

//initial actions on page render
window.onload = function() {
    //show items to purchase
    displayItems(item_storage);
    //show Cart
    displayCart(cart_storage);
    //show clock on the page
    setInterval(() => {
        TIME_STORAGE.innerHTML = new Date().toLocaleTimeString();
    }, 1000);
};

//add event listener to the currency selection
CATEGORY.addEventListener('click', (event) => {
    //show items with matching category
    displayCategory(event.target.innerText);
});

//checks which currency selected and changes all prices on the page
CURRENCY_SELECTION.addEventListener('click', () => {
    displayItems(item_storage);
    displayCart(cart_storage);
});