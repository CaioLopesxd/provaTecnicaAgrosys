// Conectar ao banco de dados e selecionar todos os clientes
alasql(`
  ATTACH LOCALSTORAGE DATABASE agrosysdb;
  USE agrosysdb;
`);

// Query para selecionar todos os clientes
const clients = alasql("SELECT * FROM clients");

// Função para formatar a data no formato DD/MM/YYYY
function explodeHifen(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

// Função para formatar números de telefone ou retornar "Não informado" se estiver vazio
function formatPhoneNumbersIfNotHave(phone) {
  return phone.trim() === "" ? "Não informado" : phone;
}

// Adiciona os cartões ao container
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("clientList");

  if (!container) {
    console.error('O container com id "clientList" não foi encontrado.');
    return;
  }

  clients.forEach((client) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <h3>${client.completeName}</h3>
    <p><strong>ID:</strong> ${client.id}</p>
    <p><strong>CPF:</strong> ${client.cpf}</p>
    <p><strong>Data Nascimento:</strong> ${explodeHifen(client.birthDate)}</p>
    <p><strong>Telefone:</strong> ${formatPhoneNumbersIfNotHave(
      client.telephone
    )}</p>
    <p><strong>Celular:</strong> ${formatPhoneNumbersIfNotHave(
      client.cellphone
    )}</p>
  `;
    container.appendChild(card);
  });
});

// Filtrar clientes pelo nome
const findClient = document.getElementById("findClient");
findClient.addEventListener("input", () => {
  const inputValue = findClient.value;
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const h3 = card.querySelector("h3");
    const clientName = h3.textContent.toLowerCase();

    if (clientName.includes(inputValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
