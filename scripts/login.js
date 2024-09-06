// Inicialização do banco de dados
alasql(`
    CREATE LOCALSTORAGE DATABASE IF NOT EXISTS agrosysdb;
    ATTACH LOCALSTORAGE DATABASE agrosysdb;
    USE agrosysdb;
  `);

// Script para alteração dos formulários, login e registro
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function toggleForm() {
  if (registerForm.style.display === "none") {
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
  } else {
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
  }
}

// Função para criptografar a senha
function hashedPassWord(password) {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}

// Função para registrar um novo usuário
function registerNewUser(event) {
  // Evita o recarregamento da página e esconde os dados da url
  event.preventDefault();
  alasql(`
      CREATE TABLE IF NOT EXISTS users (username STRING, password STRING);
    `);

  const userName = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const hashedPassword = hashedPassWord(password);

  const existingUser = alasql(
    `
      SELECT * FROM users WHERE username = ?
    `,
    [userName]
  );

  if (existingUser.length > 0) {
    alert("Usuário já cadastrado!");
    return;
  }

  try {
    alasql(
      `
        INSERT INTO users (username, password) VALUES (?, ?)
      `,
      [userName, hashedPassword]
    );
    alert("Usuário cadastrado com sucesso!");
    toggleForm();
  } catch (error) {
    alert("Erro ao cadastrar usuário!");
  }
}

// Função para login do usuário
function login(event) {
  // Evita o recarregamento da página e esconde os dados da url
  event.preventDefault();
  const userName = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const hashedPassword = hashedPassWord(password);

  const userExists = alasql(
    `
      SELECT * FROM users WHERE username = ? AND password = ?
    `,
    [userName, hashedPassword]
  );

  if (userExists.length > 0) {
    // Utilização da sessionStorage para armazenar os dados do usuario logado
    sessionStorage.setItem("loggedInUser", JSON.stringify(userExists[0]));
    window.location.href = "hub.html";
  } else {
    alert("Usuário ou senha inválidos!");
  }
}
