const table = document.getElementById('dataTable');        
const LBackgrounds = localStorage.getItem("Backgrounds");
let menu = document.getElementById("menu");

function organizeBackgrounds() {
    if(LBackgrounds) {       
      const [Ltable, Lbody, LTS, LMB, LMC] = LBackgrounds.split("=");            
      document.body.style.background = Lbody;
      table.style.background = Ltable;  
      table.style.boxShadow = LTS;
      menu.style.background = LMB;    
      for(let i = 0; i < menu.children.length; i++){
            menu.children[i].style.color = LMC;
      } 
      
    }
}
function saveBackgrounds() {
    bodyBackground = document.body.style.background;
    tableBackground = table.style.background;
    TS = table.style.boxShadow;
    menuBackground = menu.style.background;
    menuColor = menu.firstElementChild.style.color;
    let Backgrounds = [tableBackground, bodyBackground, TS, menuBackground, menuColor];
    
    localStorage.setItem("Backgrounds", Backgrounds.join("="));
}

function controlWidth() {
    menu = document.getElementById("menu");
    checkBox = document.getElementById("checkbox");
    if(checkBox.checked) {
        menu.style.width = "40%";
        menu.style.height = "90%";
    }else{
        menu.style.width = "40px";
        menu.style.height = "40px";
    }
}

function loadTable() {
    const savedData = JSON.parse(localStorage.getItem('tableData')) || [];
    savedData.forEach(data => insertRow(data));
}

 function saveTable() {
    const rows = Array.from(table.rows).slice(1);
    const tableData = rows.map(row => ({
        id: row.id,
        trade: row.cells[0].innerText,
        reason: row.cells[1].innerText,
        fileData: row.cells[2].querySelector("img")?.src || '',
        riskToReward: row.cells[3].innerText,
        riskRewardRatio: row.cells[4].innerText
    }));
    localStorage.setItem('tableData', JSON.stringify(tableData));
}

function insertRow(data) {
    const newRow = table.insertRow();
    newRow.id = data.id || `row-${Date.now()}`;
    newRow.insertCell(0).innerText = data.trade;
    newRow.insertCell(1).innerText = data.reason;
    
    const imgCell = newRow.insertCell(2);
    if (data.fileData) {
        const img = document.createElement("img");
        img.src = data.fileData;
        imgCell.appendChild(img);
    } else {
        imgCell.innerText = "No Image";
    }
            
    newRow.insertCell(3).innerText = data.riskToReward;
    newRow.insertCell(4).innerText = data.riskRewardRatio;

    const actionCell = newRow.insertCell(5);
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.onclick = function() { removeRow(newRow.id); };
    actionCell.appendChild(deleteButton);    
    saveTable();
}

function removeRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        saveTable();
    }
}

window.onload = function() {
    loadTable();
    const trade = sessionStorage.getItem('trade');
    const reason = sessionStorage.getItem('reason');
    const fileData = sessionStorage.getItem('file');
    const riskToReward = JSON.parse(sessionStorage.getItem('riskToReward'));
    const riskRewardRatio = JSON.parse(sessionStorage.getItem('riskRewardRatio'));

    if (trade && reason && riskToReward && riskRewardRatio) {
        insertRow({
            id: `row-${Date.now()}`,
            trade,
            reason,
            fileData,
            riskToReward: `${riskToReward.risk} : ${riskToReward.reward}`,
            riskRewardRatio: `${riskRewardRatio.risk} : ${riskRewardRatio.reward}`
        });
        
        sessionStorage.clear();
    }
};

function add() {
    window.location.href = "Next.html";
}

function changeBackground(changeValue) {
    tableBackgroundColorPicker = document.getElementById("table-background-picker");
    bodyBackgroundColorPicker = document.getElementById("body-background-picker");
    tableShadowColorPicker = document.getElementById("table-shadow-picker");
    menuBackgroundColorPicker = document.getElementById("menu-background-picker");
    menuColorPicker = document.getElementById("menu-color-picker");
    if(changeValue == "body") {
        document.body.style.background = bodyBackgroundColorPicker.value;        
    }else if (changeValue == "table") {
        table.style.background = tableBackgroundColorPicker.value;
    }else if (changeValue == "ts"){
        table.style.boxShadow = "10px 10px 10px" + tableShadowColorPicker.value;
    }else if (changeValue == "menuB") {
        menu.style.background = menuBackgroundColorPicker.value;
    }else if (changeValue == "menuC"){        
        for(let i = 0; i < menu.children.length; i++){
            menu.children[i].style.color = menuColorPicker.value;
        }
    }    
    saveBackgrounds();
}

function goToRecycleBin() {
    window.location.href = "recycle bin.html";
}

organizeBackgrounds();
