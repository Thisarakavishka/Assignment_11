import {CustomerModel} from "/model/CustomerModel.js";
import {customerDb} from "../db/db.js";

window.onload = function () {
    $("#customerId").val(generateNextId());
}
$("#customer_submit").on('click', () => {
    let customerId = $("#customerId").val();
    let customerName = $("#customerName").val();
    let customerAddress = $("#customerAddress").val();
    let customerSalary = $("#customerSalary").val();

    if (customerId) {
        if (customerName) {
            if (customerAddress) {
                if (customerSalary) {
                    var customerSubmit = new CustomerModel(
                        customerId,
                        customerName,
                        customerAddress,
                        customerSalary
                    );
                    customerDb.push(customerSubmit);
                    loadData();
                    Swal.fire(
                        'Success!',
                        'Customer has been added successfully!',
                        'success'
                    );
                } else {
                    toastr.error('Invalid Salary');
                }
            } else {
                toastr.error('Invalid Address');
            }
        } else {
            toastr.error('Invalid Customer Name');
        }
    } else {
        toastr.error('Invalid Customer Id')
    }
});

$("#customer_update").on('click', () => {
    var customerUpdate = new CustomerModel(
        $("#customerId").val(),
        $("#customerName").val(),
        $("#customerAddress").val(),
        $("#customerSalary").val()
    );
    toastr.success('Customer Update Successfully');

    var index = customerDb.findIndex(item => item.customerId === customerUpdate.customerId);

    customerDb[index] = customerUpdate;
    loadData();
});

$("#customer_delete").on('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You can't get back this customer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete this customer!'
    }).then((result) => {
        if (result.isConfirmed) {
            var customerId = $("#customerId").val();
            var index = customerDb.findIndex(item => item.customerId === customerId);
            customerDb.splice(index, 1);
            loadData();
        }
    });
});

$("button[type=reset]").on('click', () => {
    $("#customerId").val("");
    $("#customerName").val("");
    $("#customerAddress").val("");
    $("#customerSalary").val("");
});

$("#customer-tbl-body").on("click", "tr", function () {
    var index = $(this).index();
    const table = document.querySelector("#customer-tbl-body");
    const tableCells = table.children[index].children;

    var customer = new CustomerModel(
        tableCells[0].textContent,
        tableCells[1].textContent,
        tableCells[2].textContent,
        tableCells[3].textContent,
    );

    $("#customerId").val(customer.customerId);
    $("#customerName").val(customer.customerName);
    $("#customerAddress").val(customer.customerAddress);
    $("#customerSalary").val(customer.customerSalary);
});

$("#customersSearch").on("input", () => {
    let searchInput = $("#customersSearch").val();
    let searchResults = customerDb.filter((item) =>
        item.customerName.toLowerCase().startsWith(searchInput.toLowerCase()) ||
        item.customerAddress.toLowerCase().startsWith(searchInput.toLowerCase()) ||
        item.customerId.startsWith(searchInput)
    );

    $("#customer-tbl-body").empty();
    searchResults.map((item, index) => {
        let row = `<tr>
                        <td>${item.customerId}</td>
                        <td>${item.customerName}</td>
                        <td>${item.customerAddress}</td>
                        <td>${item.customerSalary}</td>
                        </tr>`;
        $("#customer-tbl-body").append(row);
    });
});

function loadData() {
    $("#customer-tbl-body").empty();
    customerDb.map((item, index) => {
        let row = `<tr>
                        <td>${item.customerId}</td>
                        <td>${item.customerName}</td>
                        <td>${item.customerAddress}</td>
                        <td>${item.customerSalary}</td>
                        </tr>`;
        $('#customer-tbl-body').append(row);
    });

    $("button[type='reset']").click();
    $("#customerId").val(generateNextId());
}

function generateNextId() {
    if (customerDb === null || customerDb.length === 0) {
        return "0001";
    } else {
        const lastCustomer = customerDb[customerDb.length - 1];
        const lastCustomerId = lastCustomer.customerId;

        if (lastCustomerId.match(/^\d+$/)) {
            const customerId = parseInt(lastCustomerId, 10);
            return (customerId + 1).toString().padStart(lastCustomerId.length, "0");
        }
    }
}
