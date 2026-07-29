const API =
"https://script.google.com/macros/s/AKfycbze_l5sNMZ0ZEd-sRjZmuxDaGD9QoQhfqIiTbLvgbgEOBaBxfKlxHx-YDgvC42eQ62H/exec";


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


    const file =
    document
    .getElementById("slip")
    .files[0];



    if(!file){

        alert("กรุณาเลือกสลิป");

        return;

    }



    if(!customer){

        alert("ไม่พบข้อมูลลูกค้า");

        return;

    }



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

                body:
                JSON.stringify(payload)

            });



            const result =
            await response.text();



            if(result.includes("OK")){


                alert(
                "ส่งสลิปเรียบร้อย รอตรวจสอบ"
                );


            }else{


                alert(result);


            }



        }catch(err){


            console.log(err);

            alert(
            "ERROR : " + err.message
            );


        }


    };



    reader.readAsDataURL(file);



}




window.onload =
loadPay;
