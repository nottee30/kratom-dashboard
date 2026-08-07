
const API =
"https://script.google.com/macros/s/AKfycbwbJax4EJ-tlD4lHkpsk-pe2bT3IEa0LfKUfmnVnnUwhEARwGJSlZ6x1D_6wvr4L5l5/exec";


let name = "";

let customer = null;


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
        c => c.name === name
    );



    if(customer){


        document.getElementById("amount")
        .innerHTML =

        customer.total
        .toLocaleString("th-TH")
        +
        " บาท";


    }


}




async function submitPayment(){

    const button =
    document.getElementById("submitBtn");

    const file =
    document
    .getElementById("slip")
    .files[0];


    if(!file){

        alert("ขอสลิปหน่อย");

        return;

    }


    if(!customer){

        alert("รอแปปดิ๊");

        return;

    }


    // =========================
    // ป้องกันการกดส่งซ้ำ
    // =========================

    button.disabled = true;

    button.innerHTML =
    "⏳ กำลังส่งยอด";


    const reader =
    new FileReader();


    reader.onload = async function(){

        const base64 =
        reader.result
        .split(",")[1];


        const payload = {

            customer:
            customer.name,

            amount:
            customer.total,

            file:
            base64,

            type:
            file.type,

            name:
            file.name

        };


        try{

            const response =
            await fetch(API,{

                method:"POST",

                headers:{
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },

                body:
                JSON.stringify(payload)

            });


            const result =
            await response.text();


            if(result.includes("OK")){

        button.innerHTML =
        "✅ หัวจ่ายรับยอด";

        showSuccess();

          window.location.replace("index.html");

            }else{

                button.disabled = false;

                button.innerHTML =
                "📤 ส่งยอด";

                alert(result);

            }


        }catch(err){

            console.log(err);


            button.disabled = false;

            button.innerHTML =
            "📤 หัวจ่ายรับยอด";

            alert(
            "ERROR : " +
            err.message
            );

        }

    };


    reader.readAsDataURL(file);

}

function closePopup(){

    document
        .getElementById("warningPopup")
        .style.display = "none";

}

function showSuccess(){

    document
        .getElementById("successPopup")
        .style.display = "flex";

    setTimeout(function(){

        window.location.replace("index.html");

    },3000);

}
window.onload = function(){

    loadPay();

}
