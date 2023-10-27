let home = $("#home-section");
let order = $("#order-section");
let item = $("#item-section");
let customer = $("#customer-section");

const clearIndex = function () {

    customer.css("display", "none")
    home.css("display", "none")
    order.css("display", "none")
    item.css("display", "none")
}

clearIndex();
$("#home-section").css("display","block");

$("#customer").on('click', () => {
    clearIndex();
    customer.css("display", "block")
})

$("#item").on('click', () => {
    clearIndex();
    item.css("display", "block")
})

$("#order").on('click', () => {
    clearIndex();
    order.css("display", "block")
})

$("#home").on('click', () => {
    clearIndex();
    home.css("display", "block")
})
