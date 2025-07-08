/* script code */
const table = document.getElementById('dataTable');        
const LBackgrounds = localStorage.getItem("Backgrounds");
let menu = document.getElementById("menu");

function saveToFile() {
    const savedData = JSON.parse(localStorage.getItem('tableData')) || [];
    const fileData = savedData.map(data => {
        return {
            trade: data.trade,
            reason: data.reason,
            emotion: data.emotion, // Include emotion
            riskToReward: data.riskToReward,
            riskRewardRatio: data.riskRewardRatio,
            fileData: data.fileData
        };
    });
    
    const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trades.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function downloadImage(imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    // Create a filename - you can customize this
    const filename = "trade_image_" + new Date().toISOString().slice(0, 10) + ".jpg";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function uploadFromFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const uploadedData = JSON.parse(e.target.result);
        uploadedData.forEach(data => {
            insertRow({
                trade: data.trade,
                reason: data.reason,
                emotion: data.emotion, // Retrieve emotion
                riskToReward: data.riskToReward,
                riskRewardRatio: data.riskRewardRatio,
                fileData: data.fileData
            });
        });
    };
    
    reader.readAsText(file);
}

document.getElementById("fileInput").addEventListener("change", uploadFromFile);

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
        emotion: row.cells[2].innerText, 
        fileData: row.cells[3].querySelector("img")?.src || '',
        riskToReward: row.cells[4].innerText,
        riskRewardRatio: row.cells[5].innerText
    }));
    localStorage.setItem('tableData', JSON.stringify(tableData));
}

function insertRow(data) {
    const newRow = table.insertRow();
    newRow.id = data.id || `row-${Date.now()}`;
    newRow.insertCell(0).innerText = data.trade;
    newRow.insertCell(1).innerText = data.reason;
    newRow.insertCell(2).innerText = data.emotion; // Display emotion

    const imgCell = newRow.insertCell(3);
    if (data.fileData) {
        const img = document.createElement("img");
        img.src = data.fileData;
        // Make image clickable for download
        img.style.cursor = "pointer";
        img.title = "Click to download"; // Tooltip
        img.onclick = function() {
            downloadImage(this.src);
        };
        imgCell.appendChild(img);
    } else {
        imgCell.innerText = "No Image";
    }

    newRow.insertCell(4).innerText = data.riskToReward;
    newRow.insertCell(5).innerText = data.riskRewardRatio;

    const actionCell = newRow.insertCell(6);
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.onclick = function () { removeRow(newRow.id); };
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

window.onload = function () {
    loadTable();
    const trade = sessionStorage.getItem('trade');
    const reason = sessionStorage.getItem('reason');
    const emotion = sessionStorage.getItem('emotion'); // Get emotion
    const fileData = sessionStorage.getItem('file');
    const riskToReward = JSON.parse(sessionStorage.getItem('riskToReward'));
    const riskRewardRatio = JSON.parse(sessionStorage.getItem('riskRewardRatio'));

    if (trade && reason && emotion && riskToReward && riskRewardRatio) {
        insertRow({
            id: `row-${Date.now()}`,
            trade,
            reason,
            emotion, // Include emotion
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
