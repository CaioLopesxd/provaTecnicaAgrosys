alasql(`
    ATTACH LOCALSTORAGE DATABASE agrosysdb;
    USE agrosysdb;
    CREATE TABLE IF NOT EXISTS clients (
        id INT AUTOINCREMENT PRIMARY KEY,
        completeName STRING,
        cpf STRING,
        birthDate DATE,
        telephone STRING,
        cellphone STRING
    );
`);

//Esse script de validação de cpf é um que ja utilizei em varios projetos e tomei a liberdade de reutilizar nesse para deixalo mais completo

// Função para formatar o telefone
function formatTelefone(value) {
  value = value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
  return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

// Função para formatar o CPF
function formatCPF(value) {
  value = value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

//Declaração da variavel onde será exibido o erro
const error = document.getElementById("error");
error.style.color = "red";

function handleInput(event) {
  const input = event.target;
  switch (input) {
    case telefoneInput:
      input.value = formatTelefone(input.value);
      break;
    case cpfInput:
      input.value = formatCPF(input.value);
      if (!validarCPF(input.value) && input.value.length === 14) {
        error.innerHTML = "CPF inválido";
      }
      break;
    case celularInput:
      input.value = formatTelefone(input.value);
      break;
  }
}

const telefoneInput = document.getElementById("telephone");
const cpfInput = document.getElementById("cpf");
const celularInput = document.getElementById("cellphone");

//Event listeners para formatação dos inputs de telefone e cpf
telefoneInput.addEventListener("input", handleInput);
cpfInput.addEventListener("input", handleInput);
celularInput.addEventListener("input", handleInput);

function createClient(event) {
  event.preventDefault();

  //Coleta dos dados do formulario
  const completeName = document.getElementById("completeName").value;
  const cpf = document.getElementById("cpf").value;
  const birthDate = document.getElementById("birthDate").value;
  const telephone = document.getElementById("telephone").value;
  const cellphone = document.getElementById("cellphone").value;

  //Validação dos campos telefone e celular
  if (telephone == "" && cellphone == "") {
    error.innerHTML = "Telefone ou Celular é obrigatório";
    return;
  }

  //Validação do CPF
  if (!validarCPF(cpf)) {
    error.innerHTML = "Preencha um CPF válido";
    return;
  }

  //Verificação se o CPF já está cadastrado
  const existingClient = alasql(`SELECT * FROM clients WHERE cpf = ?`, [cpf]);
  if (existingClient.length > 0) {
    error.innerHTML = "CPF já cadastrado";
    return;
  }

  /*Inserção dos dados na tabela clients
  Como cpf é unico eu poderia usar como primary key mas preferi usar um id autoincrement para facilitar a manipulação dos dados,
  teria que questionar vocês sobre como preferem organizar seus bd  */
  alasql(`
        INSERT INTO clients
        (completeName, cpf, birthDate, telephone, cellphone)
        VALUES
        ('${completeName}', '${cpf}', '${birthDate}', '${telephone}', '${cellphone}')
    `);
  error.innerHTML = "Cliente cadastrado com sucesso";
  error.style.color = "green";
}
