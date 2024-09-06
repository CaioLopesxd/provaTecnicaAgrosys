// Conectar ao banco de dados
alasql(`
  ATTACH LOCALSTORAGE DATABASE agrosysdb;
  USE agrosysdb;
  CREATE TABLE IF NOT EXISTS adress (
      id INT AUTOINCREMENT PRIMARY KEY,
      clientId INT,
      cep STRING,
      street STRING,
      neighborhood STRING,
      city STRING,
      state STRING,
      country STRING,
      mainAdress BOOLEAN,
      FOREIGN KEY (clientId) REFERENCES clients(id)
  );
`);

const error = document.getElementById("error");
error.style.color = "red";

function formatPhoneNumbersIfNotHave(fone) {
  if (fone === "") {
    return "Não informado";
  }
  return fone;
}

// Selecionar todos os clientes
const clients = alasql("SELECT * FROM clients");

const clientSelect = document.getElementById("clientSelect");
clients.forEach((client) => {
  const option = document.createElement("option");
  option.value = client.id;
  option.innerText = client.completeName;
  clientSelect.appendChild(option);
});

// função para carregar os dados do cliente selecionado
function loadClient() {
  const selectedClient = clients.find(
    (client) => client.id == clientSelect.value
  );
  const name = document.getElementById("completeName");
  const cpf = document.getElementById("cpf");
  const birthDate = document.getElementById("birthDate");
  const telephone = document.getElementById("telephone");
  const cellphone = document.getElementById("cellphone");

  name.value = selectedClient.completeName;
  cpf.value = selectedClient.cpf;
  birthDate.value = selectedClient.birthDate;
  telephone.value = formatPhoneNumbersIfNotHave(selectedClient.telephone);
  cellphone.value = formatPhoneNumbersIfNotHave(selectedClient.cellphone);
}

// Event listener para carregar os dados do cep
const cep = document.getElementById("cep");
cep.addEventListener("blur", () => {
  if (cep.value.length < 8) {
    error.innerText = "CEP inválido";
    return;
  }
  error.innerText = "";
  fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        error.innerText = "CEP não encontrado";
        return;
      }
      document.getElementById("street").value = data.logradouro;
      document.getElementById("neighborhood").value = data.bairro;
      document.getElementById("city").value = data.localidade;
      document.getElementById("state").value = data.uf;
      document.getElementById("country").value = "Brasil";
    });
});

//função para adicionar o endereço do cliente
function addClientAdress(event) {
  event.preventDefault();
  const selectedClient = clients.find(
    (client) => client.id == clientSelect.value
  );
  const cep = document.getElementById("cep").value;
  const street = document.getElementById("street").value;
  const neighborhood = document.getElementById("neighborhood").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const country = document.getElementById("country").value;
  const mainAdress = document.getElementById("mainAdress").checked;

  const alreadyMainAdress = alasql(
    "SELECT * FROM adress WHERE clientId = ? AND mainAdress = true",
    [selectedClient.id]
  );

  if (mainAdress && alreadyMainAdress.length > 0) {
    error.innerText = "O cliente já possui um endereço principal";
    return;
  }

  alasql(
    `
    INSERT INTO adress (clientId, cep, street, neighborhood, city, state, country, mainAdress)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      selectedClient.id,
      cep,
      street,
      neighborhood,
      city,
      state,
      country,
      mainAdress,
    ]
  );
  const right = document.getElementById("right");
  right.innerText = "Endereço cadastrado com sucesso";
}
// Event listener para o select de clientes
clientSelect.addEventListener("change", loadClient);
