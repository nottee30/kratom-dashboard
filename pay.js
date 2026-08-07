
const API =
"https://script.google.com/macros/s/AKfycbwbJax4EJ-tlD4lHkpsk-pe2bT3IEa0LfKUfmnVnnUwhEARwGJSlZ6x1D_6wvr4L5l5/exec";
    const QR_HASH =
"e5a694be16140a7647e751adfd27d47791576a295d8522ea7395a80b1e53f122";

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

    console.log("showSuccess ทำงานแล้ว");

    document
        .getElementById("successPopup")
        .style.display = "flex";

    setTimeout(function(){

        window.location.replace("index.html");

    },3000);

}

async function verifyQR(){

const res = await fetch("qr.png?v=" + Date.now(), {
    cache: "no-store"
});

    const buffer = await res.arrayBuffer();

    const hashBuffer =
    await crypto.subtle.digest("SHA-256", buffer);

    const hashArray =
    Array.from(new Uint8Array(hashBuffer));

    const hash =
    hashArray
    .map(b => b.toString(16).padStart(2,"0"))
    .join("");
console.log("Hash จริง :", hash);
console.log("Hash ที่ตั้ง :", QR_HASH);
    if(hash !== QR_HASH){

        document.body.innerHTML = `
        <div style="
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            height:100vh;
            background:#111;
            color:#ff4040;
            text-align:center;
            font-family:sans-serif;
            padding:30px;
        ">
            <h1>🚨 SECURITY ALERT 🚨</h1>

            <h2>ตรวจพบการเปลี่ยนแปลง QR CODE</h2>

            <p>
            ระบบถูกล็อกเพื่อความปลอดภัย
            <br><br>
            กรุณาติดต่อผู้ดูแล
            </p>
        </div>`;

        throw new Error("QR ถูกแก้ไข");

    }

}
window.onload = async function(){

    await verifyQR();

    await loadPay();
    
    document
    .getElementById("preview")
    .hidden = true;

    document
    .getElementById("slip")
    .addEventListener("change", function(){

    const file =
    this.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = function(e){

        const preview =
        document.getElementById("preview");

        preview.src =
        e.target.result;

        preview.hidden = false;

    };

    reader.readAsDataURL(file);

});
}
