alasql(`
    ATTACH LOCALSTORAGE DATABASE agrosysdb;
    USE agrosysdb;
`);

//query para selecionar todos os clientes
const clients = alasql("SELECT * FROM clients");

//função para formatar a data
function explodeHifen(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function formatPhoneNumbersIfNotHave(fone) {
  if (fone === "") {
    return "Não informado";
  }
  return fone;
}

//função para listar os clientes em uma tabela
const tbody = document.querySelector("tbody");
clients.forEach((client) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
        <td>${client.id}</td>
        <td>${client.completeName}</td>
        <td>${client.cpf}</td>
        <td>${explodeHifen(client.birthDate)}</td>
        <td>${formatPhoneNumbersIfNotHave(client.telephone)}</td>
        <td>${formatPhoneNumbersIfNotHave(client.cellphone)}</td>
    `;
  tbody.appendChild(tr);
});
