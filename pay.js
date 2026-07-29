const API =
"https://script.google.com/macros/s/AKfycbze_l5sNMZ0ZEd-sRjZmuxDaGD9QoQhfqIiTbLvgbgEOBaBxfKlxHx-YDgvC42eQ62H/exec";


let name = "";

let customer;



async function loadPay(){


const params =
new URLSearchParams(
window.location.search
);


name =
params.get("name");



document.getElementById("customerName")
.innerHTML =
"👤 " + name;



const res =
await fetch(API);



const data =
await res.json();



customer =
data.find(
c=>c.name===name
);



if(customer){


document.getElementById("amount")
.innerHTML =

customer.total.toLocaleString("th-TH")
+
" บาท";


}


}



function submitPayment(){


const file =
document.getElementById("slip").files[0];


if(!file){

alert("กรุณาเลือกสลิป");

return;

}



alert(
"รับสลิปแล้ว รอตรวจสอบ"
);


}



window.onload =
loadPay;
