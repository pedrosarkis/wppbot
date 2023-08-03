'use strict';

let currentLead = null; // Armazena o lead atualmente sendo editado

var modal = document.getElementById('myModal');
var closeButton = document.querySelector('.close');

const fetchLeads = async () => {
  return await (await fetch('/leads')).json();
}

function formatDateFromObjectId(objectId) {
    var timestamp = Math.floor(parseInt(objectId.substring(0, 8), 16) * 1000);
    var date = new Date(timestamp);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear().toString().slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);

    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}


closeButton.onclick = function() {
    modal.style.display = "none";
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
closeButton.onclick = function() {
    modal.style.display = "none";
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

function openModal(lead) {
debugger;
  document.getElementById('modalName').textContent = lead.data.name;
  const leadId = lead._id;
  const timestamp = parseInt(leadId.substring(0, 8), 16) * 1000;
  const date = formatDateFromObjectId(leadId);
  document.getElementById('modalDate').textContent = date;
  document.getElementById('modalEmail').textContent = lead.data.to;
  const url = `https://web.whatsapp.com/send/?phone=${lead.data.number}&text=${encodeURIComponent('oi')}&type=phone_number&app_absent=0`;
  document.getElementById('modalNumber').href = url;
  document.getElementById('number').textContent = lead.data.number;
  document.getElementById('statusSelect').value = lead.status;
  document.getElementById('myModal').style.display = "block";  
  currentLead = lead; // Armazena o lead atualmente sendo editado
  currentLead.id = lead._id;
}

const populateFieldsInTable = async () => {
  const leads = await fetchLeads();
  const table = document.querySelector('.leads-table');
  debugger;

  // Remove as linhas de dados existentes
  Array.from(table.querySelectorAll('tr:not(:first-child)')).forEach(row => row.remove());

  // Para cada lead
  for (let lead of leads) {
    
    // Crie uma nova linha
    let row = document.createElement('tr');

    // Crie uma célula para cada coluna
    for (let i = 0; i < 7; i++) {
      let cell = document.createElement('td');

      // Se o status do lead é igual ao índice da coluna, adicione o nome do lead à célula
      if (lead.status == i || (lead.status == undefined && i == 0)) {
        cell.textContent = lead.data.name;

        // Adicione um event listener à célula para abrir o modal quando clicado
        cell.addEventListener('click', function() {
          openModal(lead);
        });
      }

      // Adicione a célula à linha
      row.appendChild(cell);
    }

    // Adicione a linha à tabela
    table.appendChild(row);
  }
}

document.getElementById('saveButton').addEventListener('click', async function() {
  currentLead.status = document.getElementById('statusSelect').value;
  await updateLeadOnServer(currentLead); // Atualiza o lead no servidor
  await populateFieldsInTable(); // Atualiza a tabela
  document.getElementById('myModal').style.display = "none";
});

const refreshTable = async () => {
    await populateFieldsInTable();
}

async function updateLeadOnServer(lead) {
    debugger;
  await fetch(`/leads/${lead.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lead)
  });
  //await response.json();
  await refreshTable();
}

refreshTable();
