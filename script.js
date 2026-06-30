const API =
"https://script.google.com/macros/s/AKfycbze_l5sNMZ0ZEd-sRjZmuxDaGD9QoQhfqIiTbLvgbgEOBaBxfKlxHx-YDgvC42eQ62H/exec";

let customers=[];

async function loadData(){

    try{

        const res=await fetch(API);

        customers=await res.json();

        document.getElementById("loading").style.display="none";
        document.getElementById("app").style.display="block";

        render();

    }catch(e){

        document.getElementById("loading").innerHTML=
        "<h2>โหลดข้อมูลไม่สำเร็จ</h2>";

        console.log(e);

    }

}

function render(){

    let water=0;
    let herb35=0;
    let herb55=0;
    let free=0;

    customers.forEach(c=>{

        water+=Number(c.water);

        herb35+=Number(c.herb35);

        herb55+=Number(c.herb55);

        free+=Number(c.free);

    });

    document.getElementById("totalWater").innerText=water;
    document.getElementById("total35").innerText=herb35;
    document.getElementById("total55").innerText=herb55;
    document.getElementById("totalFree").innerText=free;

    customers.sort((a,b)=>b.water-a.water);

    const board=document.getElementById("leaderboard");

    board.innerHTML="";

    customers.forEach((c,i)=>{

        board.innerHTML+=`

        <div class="rank">

            <span>${i+1}. ${c.name}</span>

            <strong>${c.water}</strong>

        </div>

        `;

    });

}

document
.getElementById("search")
.addEventListener("input",function(){

    const keyword=this.value.trim();

    const card=document.getElementById("customerCard");

    if(keyword==""){

        card.style.display="none";

        return;

    }

    const c=customers.find(x=>x.name.includes(keyword));

    if(!c){

        card.style.display="block";

        card.innerHTML="<h2>ไม่พบข้อมูล</h2>";

        return;

    }

    let percent=(c.point/8)*100;

    card.style.display="block";

    card.innerHTML=`

    <h2>${c.name}</h2>

    <br>

    🥤 น้ำ : ${c.water}

    <br><br>

    💊 ยา35 : ${c.herb35}

    <br><br>

    💊 ยา55 : ${c.herb55}

    <br><br>

    🎁 ฟรี : ${c.free}

    <br><br>

    ⭐ สะสม ${c.point}/8

    <div class="progress">

    <div style="width:${percent}%"></div>

    </div>

    <br>

    เหลืออีก ${8-c.point} ขวด

    `;

});

loadData();

setInterval(loadData,30000);
