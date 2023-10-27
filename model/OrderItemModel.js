export class OrderItemModel {
    constructor(orderId, customerName, itemCode, itemName, qty, price) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.qty = qty;
        this.price = price;
    }
}