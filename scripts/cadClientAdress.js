// Conectar ao banco de dados e criar a tabela 'adress' se ela não existir
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

// Obter o elemento de erro e definir a cor do texto para vermelho
const error = document.getElementById("error");
error.style.color = "red";

// Função para formatar números de telefone, retornando "Não informado" se o número estiver vazio
function formatPhoneNumbersIfNotHave(fone) {
  if (fone === "") {
    return "Não informado";
  }
  return fone;
}

// Selecionar todos os clientes da tabela 'clients'
const clients = alasql("SELECT * FROM clients");

// Obter o elemento select para clientes
const clientSelect = document.getElementById("clientSelect");

// Adicionar uma opção para cada cliente no menu suspenso
clients.forEach((client) => {
  const option = document.createElement("option");
  option.value = client.id;
  option.innerText = client.completeName;
  clientSelect.appendChild(option);
});

// Função para carregar os dados do cliente selecionado no formulário
function loadClient() {
  // Encontrar o cliente selecionado
  const selectedClient = clients.find(
    (client) => client.id == clientSelect.value
  );
  // Obter os elementos do formulário
  const name = document.getElementById("completeName");
  const cpf = document.getElementById("cpf");
  const birthDate = document.getElementById("birthDate");
  const telephone = document.getElementById("telephone");
  const cellphone = document.getElementById("cellphone");

  // Preencher os campos do formulário com os dados do cliente selecionado
  name.value = selectedClient.completeName;
  cpf.value = selectedClient.cpf;
  birthDate.value = selectedClient.birthDate;
  telephone.value = formatPhoneNumbersIfNotHave(selectedClient.telephone);
  cellphone.value = formatPhoneNumbersIfNotHave(selectedClient.cellphone);
}

// Event listener para validar e buscar dados do CEP quando o campo perde o foco
const cep = document.getElementById("cep");
cep.addEventListener("blur", () => {
  // Verificar se o CEP tem pelo menos 8 caracteres
  if (cep.value.length < 8) {
    error.innerText = "CEP inválido";
    return;
  }
  error.innerText = ""; // Limpar mensagem de erro
  // Buscar informações do CEP usando a API ViaCEP
  fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then((response) => response.json())
    .then((data) => {
      // Se o CEP não for encontrado, exibir mensagem de erro
      if (data.erro) {
        error.innerText = "CEP não encontrado";
        return;
      }
      // Preencher os campos de endereço com os dados retornados
      document.getElementById("street").value = data.logradouro;
      document.getElementById("neighborhood").value = data.bairro;
      document.getElementById("city").value = data.localidade;
      document.getElementById("state").value = data.uf;
      document.getElementById("country").value = "Brasil";
    });
});

// Função para adicionar o endereço do cliente ao banco de dados
function addClientAdress(event) {
  event.preventDefault(); // Prevenir o comportamento padrão do formulário

  // Encontrar o cliente selecionado
  const selectedClient = clients.find(
    (client) => client.id == clientSelect.value
  );

  // Obter os valores dos campos do formulário
  const cep = document.getElementById("cep").value;
  const street = document.getElementById("street").value;
  const neighborhood = document.getElementById("neighborhood").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const country = document.getElementById("country").value;
  const mainAdress = document.getElementById("mainAdress").checked;

  // Verificar se já existe um endereço principal para o cliente
  const alreadyMainAdress = alasql(
    "SELECT * FROM adress WHERE clientId = ? AND mainAdress = true",
    [selectedClient.id]
  );

  if (mainAdress && alreadyMainAdress.length > 0) {
    error.innerText = "O cliente já possui um endereço principal";
    return;
  }

  // Inserir o novo endereço na tabela 'adress'
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

  // Exibir uma mensagem de sucesso
  const right = document.getElementById("right");
  right.innerText = "Endereço cadastrado com sucesso";
}

// Adicionar um event listener para carregar os dados do cliente quando o select de clientes muda
clientSelect.addEventListener("change", loadClient);
