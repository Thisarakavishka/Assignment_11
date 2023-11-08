import {ItemModel} from "/model/ItemModel.js";
import {itemDb} from "../db/db.js";

window.onload = function () {
    $("#itemCode").val(generateNextId());
}
$("#item_submit").on('click', () => {
    console.log("submit button");
    let itemCode = $("#itemCode").val();
    let itemName = $("#itemName").val();
    let itemPrice = $("#itemPrice").val();
    let itemQty = $("#itemQty").val();

    console.log(itemCode);
    console.log(itemName);
    console.log(itemPrice);
    console.log(itemQty);

    if (itemCode) {
        if (itemName) {
            if (itemPrice) {
                if (itemQty) {
                    var itemSubmit = new ItemModel(itemCode,
                        itemName,
                        itemPrice,
                        itemQty
                    );
                    itemDb.push(itemSubmit);
                    loadData();
                    Swal.fire(
                        'Success!',
                        'Item has been saved successfully!',
                        'success'
                    );
                } else {
                    toastr.error('Invalid Qty');
                }
            } else {
                toastr.error('Invalid Price');
            }
        } else {
            toastr.error('Invalid Item Name');
        }
    } else {
        toastr.error('Invalid Item Name')
    }
});

$("#item_update").on('click', () => {
    console.log("update button");
    var itemUpdate = new ItemModel(
        $("#itemCode").val(),
        $("#itemName").val(),
        $("#itemPrice").val(),
        $("#itemQty").val()
    );
    toastr.success('Item Update Successfully');

    var index = itemDb.findIndex(item => item.itemCode === itemUpdate.itemCode);

    itemDb[index] = itemUpdate;
    loadData();
});

$("#item_delete").on('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You can't get back this item!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete this!'
    }).then((result) => {
        if (result.isConfirmed) {
            var itemCode = $("#itemCode").val();
            var index = itemDb.findIndex(item => item.itemCode === itemCode);
            itemDb.splice(index, 1);
            loadData();
        }
    });
    console.log("delete button");
});

$("button[type=reset]").on('click', () => {
    console.log("reset button");
    $("#itemCode").val("");
    $("#itemName").val("");
    $("#itemPrice").val("");
    $("#itemQty").val("");
});

$("#item-tbl-body").on("click", "tr", function () {
    var index = $(this).index();
    const table = document.querySelector("#item-tbl-body");
    const tableCells = table.children[index].children;

    var item = new ItemModel(
        tableCells[0].textContent,
        tableCells[1].textContent,
        tableCells[2].textContent,
        tableCells[3].textContent,
    );

    $("#itemCode").val(item.itemCode);
    $("#itemName").val(item.itemName);
    $("#itemPrice").val(item.itemPrice);
    $("#itemQty").val(item.itemQty);
});

$("#itemSearch").on("input", () => {
    let searchInput = $("#itemSearch").val();
    let searchResults = itemDb.filter((item) =>
        item.itemName.toLowerCase().startsWith(searchInput.toLowerCase()) ||
        item.itemCode.startsWith(searchInput)
    );

    $("#item-tbl-body").empty();
    searchResults.map((item, index) => {
        let row = `<tr>
                        <td>${item.itemCode}</td>
                        <td>${item.itemName}</td>
                        <td>${item.itemPrice}</td>
                        <td>${item.itemQty}</td>
                        </tr>`;
        $('#item-tbl-body').append(row);
    });
});

function loadData() {
    $("#item-tbl-body").empty();
    itemDb.map((item, index) => {
        let row = `<tr>
                        <td>${item.itemCode}</td>
                        <td>${item.itemName}</td>
                        <td>${item.itemPrice}</td>
                        <td>${item.itemQty}</td>
                        </tr>`;
        $('#item-tbl-body').append(row);
    });

    $("button[type='reset']").click();
    $("#itemCode").val(generateNextId());
}

function generateNextId() {
    if (itemDb === null || itemDb.length === 0) {
        return "0001";
    } else {
        const lastItem = itemDb[itemDb.length - 1];
        const lastItemCode = lastItem.itemCode;

        if (lastItemCode.match(/^\d+$/)) {
            const itemCode = parseInt(lastItemCode, 10);
            return (itemCode + 1).toString().padStart(lastItemCode.length, "0");
        }
    }
}
