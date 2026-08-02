const API =
"https://script.google.com/macros/s/AKfycbwbJax4EJ-tlD4lHkpsk-pe2bT3IEa0LfKUfmnVnnUwhEARwGJSlZ6x1D_6wvr4L5l5/exec";

let customers = [];

async function loadData(firstLoad = false){

    if(firstLoad){

        document.getElementById("loading").style.display="flex";
        document.getElementById("app").style.display="none";

    }

    try{

        const response = await fetch(API);

        customers = await response.json();

        if(firstLoad){

            document.getElementById("loading").style.display="none";
            document.getElementById("app").style.display="block";

        }

        updateSummary();

        createLeaderboard();

        createCustomerDropdown();

        document.getElementById("updateTime").innerHTML =
        "อัปเดตล่าสุด : " +
        new Date().toLocaleString("th-TH");

    }catch(err){

        console.log(err);

    }

}
function createCustomerDropdown(){

    const select =
    document.getElementById("customerSelect");

    if(!select) return;

    select.innerHTML =
    '<option value="">-- เลือกรายชื่อ --</option>';

    customers.forEach(c=>{

        select.innerHTML +=
        `<option value="${c.name}">
        ${c.name}
        </option>`;

    });

}
function updateSummary(){

    let totalMoney = 0;

    let totalWater = 0;

    let totalFree = 0;

    customers.forEach(c=>{

        totalMoney += c.total;

        totalWater += c.water;

        totalFree += c.free;

    });

    document.getElementById("sumMoney").innerHTML =
    totalMoney.toLocaleString("th-TH") + " บาท";

    document.getElementById("sumCustomer").innerHTML =
    customers.length;

    document.getElementById("sumWater").innerHTML =
    totalWater.toLocaleString("th-TH");

    document.getElementById("sumFree").innerHTML =
    totalFree;

}

function createLeaderboard(){

    const board =
    document.getElementById("leaderboard");

    board.innerHTML = "";

    const sortData =
    [...customers].sort((a,b)=>b.total-a.total);

    const top3 =
    sortData.slice(0,3);

    const bottom2 =
    sortData.slice(-2);

    top3.forEach((c,index)=>{

    let icon="🏅";

    if(index===0) icon="🥇";
    if(index===1) icon="🥈";
    if(index===2) icon="🥉";

    board.innerHTML +=
`
<div class="rank top${index+1}">

<div class="rank-name">

${icon} ${c.name}

</div>

<div class="rank-money">

${c.total.toLocaleString("th-TH")} บาท

</div>

</div>
`;
});

    board.innerHTML +=
`
    <div class="rank-gap">

    ━━━━━━━━━━━━

    <br>

    ⬇ อีก
    ${customers.length-5}
    อันดับ

    <br>

    ━━━━━━━━━━━━

    </div>
    `;

     board.innerHTML +=
`
    <div class="rank bottom">

    <div>

    ⚠ รองสุดท้าย

    <br>

    ${bottom2[0].name}

    </div>

    <div>

    ${bottom2[0].total.toLocaleString("th-TH")}
    บาท

    </div>

    </div>

    <div class="rank last">

    <div>

    💀 สุดท้าย

    <br>

    ${bottom2[1].name}

    </div>

    <div>

    ${bottom2[1].total.toLocaleString("th-TH")}
    บาท

    </div>

    </div>
    `;   
         
}
function renderCustomers(data){

    const list =
    document.getElementById("list");

    list.innerHTML = "";

    data.forEach(c=>{

        list.innerHTML +=

`
<div
class="customer"
onclick="showCustomer('${c.name}')">

<h3>

👤 ${c.name}

</h3>

<p>

💰 ${c.total.toLocaleString("th-TH")} บาท

</p>

<p>

🥤
น้ำ
${c.water}
ขวด

</p>

</div>
`;

    });

}

function showCustomer(name){

    const c =
    customers.find(x=>x.name===name);

    if(!c) return;
    const sound =
    document.getElementById("rankSound");

    if(sound){

    sound.currentTime=0;

    sound.play();

}
    const rankList =
    [...customers].sort((a,b)=>b.total-a.total);

    const rank =
    rankList.findIndex(x=>x.name===c.name)+1;

    let rankClass="";

    if(rank===1) rankClass="gold";
    else if(rank===2) rankClass="silver";
    else if(rank===3) rankClass="bronze";

    const percent =
    Math.min((c.point/8)*100,100);

    document.getElementById("customerCard").style.display="block";

    document.getElementById("customerCard").innerHTML =

`
<div class="customer-box ${rankClass}">

${rank===1 ? '<div class="spark">✨ ✨ ✨</div>' : ''}

${rank===2 ? '<div class="rank-ribbon silver">🥈 TOP 2</div>' : ''}

${rank===3 ? '<div class="rank-ribbon bronze">🥉 TOP 3</div>' : ''}

<div class="customer-name">

👤 ${c.name}

</div>

<div class="pay-status">

${c.paid ? "✅ จ่ายแล้ว" : "⏳ ยังไม่จ่าย"}

</div>

<div class="total-box">

<p>

ยอดซื้อรวม

</p>

<h2>

${c.total.toLocaleString("th-TH")} บาท

</h2>

<button 
class="pay-btn"
onclick="goPay('${c.name}')">

💳 จ่ายเงิน

</button>

</div>

<div class="detail-grid">

<div class="detail-item">

<h3>🥤 น้ำ</h3>

<p>

${c.water} ขวด • ${c.waterPrice.toLocaleString("th-TH")} บาท

</p>

</div>

<div class="detail-item">

<h3>💊 ยา69</h3>

<p>

${c.herb35} ขวด • ${c.herb35Price.toLocaleString("th-TH")} บาท

</p>

</div>

<div class="detail-item">

<h3>💊 ยา</h3>

<p>

${c.herb55} ขวด • ${c.herb55Price.toLocaleString("th-TH")} บาท

</p>

</div>

<div class="detail-item">

<h3>🚬 บุหรี่</h3>

<p>

${c.cigarette} ซอง • ${c.cigarettePrice.toLocaleString("th-TH")} บาท

</p>

</div>

<div class="detail-item">

<h3>📦 แคทตอล</h3>

<p>

${c.carton} หีบ • ${c.cartonPrice.toLocaleString("th-TH")} บาท

</p>

</div>

</div>

<div class="point-box">

<div class="point-card">

<h3>

⭐ แต้มสะสม

</h3>

<h2>

${c.point}/8

</h2>

<div class="progress">

<div
style="width:${percent}%">

</div>

</div>

</div>

<div class="point-card">

<h3>

🎁 ขวดฟรี

</h3>

<h2>

${c.free}

</h2>

</div>

</div>

</div>

`;

}
document.getElementById("search").addEventListener("input", function () {

    const keyword = this.value.trim().toLowerCase();

    if(keyword === ""){

        renderCustomers(customers);

        document.getElementById("customerCard").style.display = "none";

        return;
    }

    const result = customers.filter(c =>
        c.name.toLowerCase().includes(keyword)
    );

    renderCustomers(result);

    if(result.length > 0){

        showCustomer(result[0].name);

    }else{

        document.getElementById("customerCard").style.display = "none";

    }

});

    const result =
    customers.filter(c=>

        c.name
        .toLowerCase()
        .includes(keyword)

    );

    renderCustomers(result);

    if(result.length===1){

        showCustomer(result[0].name);

    }

});

function scrollToCustomer(){

    const card =
    document.getElementById("customerCard");

    if(card.style.display==="block"){

        card.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }

}

const oldShowCustomer =
showCustomer;

showCustomer = function(name){

    oldShowCustomer(name);

    scrollToCustomer();

}

document
.getElementById("customerSelect")
.addEventListener("change",function(){

    if(this.value){

        showCustomer(this.value);

    }

});
window.onload = async function(){

    await loadData(true);

    const params =
    new URLSearchParams(window.location.search);

    const customerName =
    params.get("customer");

    if(customerName){

        showCustomer(customerName);

        history.replaceState(
            {},
            "",
            "index.html"
        );

    }

}

setInterval(function(){

    loadData(false);

},30000);
function goPay(name){

    window.location.href =
    "pay.html?name=" +
    encodeURIComponent(name);

}
