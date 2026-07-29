const API =
"https://script.google.com/macros/s/AKfycbze_l5sNMZ0ZEd-sRjZmuxDaGD9QoQhfqIiTbLvgbgEOBaBxfKlxHx-YDgvC42eQ62H/exec";

const params = new URLSearchParams(window.location.search);
const customerName = params.get("name");

async function loadCustomer(){

    const response = await fetch(API);

    const data = await response.json();

    const customer =
    data.find(c => c.name === customerName);

    if(!customer){

        document.getElementById("customerName").innerHTML =
        "ไม่พบข้อมูลลูกค้า";

        return;

    }

    document.getElementById("customerName").innerHTML =
    "👤 " + customer.name;

    document.getElementById("totalMoney").innerHTML =
    "ยอดที่ต้องชำระ " +
    customer.total.toLocaleString("th-TH") +
    " บาท";

}

loadCustomer();
