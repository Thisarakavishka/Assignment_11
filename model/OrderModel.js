export class OrderModel {
    constructor(orderId, orderDate, customerName, total, cash, discount) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.customerName = customerName;
        this.total = total;
        this.cash = cash;
        this.discount = discount;
    }
}