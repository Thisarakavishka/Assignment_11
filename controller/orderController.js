import {OrderModel} from "/model/OrderModel.js";
import {itemDb} from "../db/db.js";
import {customerDb} from "../db/db.js";
import {orderDb} from "../db/db.js";
import {ItemModel} from "../model/ItemModel.js";

var itemArray = [];
var total = 0;


window.onload = function () {
    $("#orderId").val(generateNextId());
}

//search customer by customer id
$("#orderCustomerId").on("input", () => {
    let searchInput = $("#orderCustomerId").val();
    let searchResults = customerDb.filter((item) =>
        item.customerId.startsWith(searchInput)
    );

    if (searchResults.length === 1) {
        searchResults.map((item, index) => {
            $("#orderCustomerName").val(item.customerName);
            $("#orderCustomerAddress").val(item.customerAddress);
            $("#orderCustomerSalary").val(item.customerSalary);
        });
    } else {
        $("#orderCustomerName").val("");
        $("#orderCustomerAddress").val("");
        $("#orderCustomerSalary").val("");
    }
});

//search customer by customer name
$("#orderCustomerName").on("input", () => {
    let searchInput = $("#orderCustomerName").val();
    let searchResults = customerDb.filter((item) =>
        item.customerName.toLowerCase().startsWith(searchInput.toLowerCase())
    );

    if (searchResults.length === 1) {
        searchResults.map((item, index) => {
            $("#orderCustomerId").val(item.customerId);
            $("#orderCustomerAddress").val(item.customerAddress);
            $("#orderCustomerSalary").val(item.customerSalary);
        });
    } else {
        $("#orderCustomerId").val("");
        $("#orderCustomerAddress").val("");
        $("#orderCustomerSalary").val("");
    }
});

//search item by item code
$("#orderItemCode").on("input", () => {
    let searchInput = $("#orderItemCode").val();
    let searchResults = itemDb.filter((item) =>
        item.itemCode.startsWith(searchInput)
    );

    if (searchResults.length === 1) {
        searchResults.map((item, index) => {
            $("#orderItemName").val(item.itemName);
            $("#orderItemPrice").val(item.itemPrice);
        });
    } else {
        $("#orderItemName").val("");
        $("#orderItemPrice").val("");
    }
});

//search item by item name
$("#orderItemName").on("input", () => {
    let searchInput = $("#orderItemName").val();
    let searchResults = itemDb.filter((item) =>
        item.itemName.toLowerCase().startsWith(searchInput.toLowerCase())
    );

    if (searchResults.length === 1) {
        searchResults.map((item, index) => {
            $("#orderItemCode").val(item.itemCode);
            $("#orderItemPrice").val(item.itemPrice);
        });
    } else {
        $("#orderItemCode").val("");
        $("#orderItemPrice").val("");
    }
});

$("#orderItemAdd").on("click", () => {
    let orderItemCode = $("#orderItemCode").val();
    let orderItemName = $("#orderItemName").val();
    let orderItemPrice = $("#orderItemPrice").val();
    let orderItemQty = $("#orderItemQty").val();

    if (orderItemCode) {
        if (orderItemName) {
            if (orderItemPrice) {
                if (orderItemQty) {
                    var orderItem = new ItemModel(
                        orderItemCode,
                        orderItemName,
                        orderItemPrice,
                        orderItemQty
                    );
                    itemArray.push(orderItem);
                    resetItemForm();
                    loadItemTable();
                    setTotal();
                    toastr.success('Item added Successfully')
                } else {
                    toastr.error('Invalid Qty')
                }
            } else {
                toastr.error('Invalid Item Price')
            }
        } else {
            toastr.error('Invalid Item Name')
        }
    } else {
        toastr.error('Invalid Item Code')
    }
});

//when click order item table row
$("#orderItem-tbl-body").on("click", "tr", function () {
    var index = $(this).index();
    const table = document.querySelector("#orderItem-tbl-body");
    const tableCells = table.children[index].children;

    var item = new ItemModel(
        tableCells[0].textContent,
        tableCells[1].textContent,
        tableCells[2].textContent,
        tableCells[3].textContent,
    );

    $("#orderItemCode").val(item.itemCode);
    $("#orderItemName").val(item.itemName);
    $("#orderItemPrice").val(item.itemPrice);
    $("#orderItemQty").val(item.itemQty);
});

$("#orderItemUpdate").on('click', () => {
    var itemUpdate = new ItemModel(
        $("#orderItemCode").val(),
        $("#orderItemName").val(),
        $("#orderItemPrice").val(),
        $("#orderItemQty").val()
    );
    toastr.success('Item Update Successfully');

    var index = itemArray.findIndex(item => item.itemCode === itemUpdate.itemCode);

    itemArray[index] = itemUpdate;
    loadItemTable();
});

$("#orderPurchase").on('click', () => {
    var id = $("#orderCustomerId").val();
    if (id.length > 0) {
        if (itemArray.length > 0) {
            let orderId = $("#orderId").val();
            let customerName = $("#orderCustomerName").val();
            let orderCash = $("#orderCash").val();
            let orderDiscount = $("#orderDiscount").val();
            let total = 200;
            let date = new Date();
            let formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(date);
            console.log(formattedDate);
            let order = new OrderModel(
                orderId,
                formattedDate,
                customerName,
                total,
                orderCash,
                orderDiscount
            );

            orderDb.push(order);
            loadOrderData();
            clearAll();
        } else {
            toastr.error('There is no items to make order')
        }
    } else {
        toastr.error('Invalid Order id')
    }

});

function loadOrderData() {
    $("#order-tbl-body").empty();
    orderDb.map((item, index) => {
        let row = `<tr>
                        <td>${item.orderId}</td>
                        <td>${item.orderDate}</td>
                        <td>${item.customerName}</td>
                        <td>${item.total}</td>
                        <td>${item.cash}</td>
                        <td>${item.discount}</td>
                        </tr>`;
        $('#order-tbl-body').append(row);
    });

    $("#orderId").val(generateNextId());
}

function loadItemTable() {
    $("#orderItem-tbl-body").empty();
    itemArray.map((item, index) => {
        let row = `<tr>
                        <td>${item.itemCode}</td>
                        <td>${item.itemName}</td>
                        <td>${item.itemPrice}</td>
                        <td>${item.itemQty}</td>
                        </tr>`;
        $('#orderItem-tbl-body').append(row);
    });
    $("#orderId").val(generateNextId());
    setTotal();
}

function generateNextId() {
    if (orderDb === null || orderDb.length === 0) {
        return "0001";
    } else {
        const lastOrder = orderDb[orderDb.length - 1];
        const lastOrderId = lastOrder.orderId;

        if (lastOrderId.match(/^\d+$/)) {
            const orderId = parseInt(lastOrderId, 10);
            return (orderId + 1).toString().padStart(lastOrderId.length, "0");
        }
    }
}

function resetItemForm() {
    $("#orderItemCode").val("");
    $("#orderItemName").val("");
    $("#orderItemPrice").val("");
    $("#orderItemQty").val("");
}

function clearAll() {
    $("#orderCustomerId").val("");
    $("#orderCustomerName").val("");
    $("#orderCustomerSalary").val("");
    $("#orderCustomerAddress").val("");
    $("#orderTotal").val("Total -");
    $("#orderCash").val("");
    $("#orderDiscount").val("");
    $("#orderItem-tbl-body").empty();
}

function setTotal() {
    itemArray.map((item, index) => {
        total += item.itemPrice * item.itemQty;
    });
}