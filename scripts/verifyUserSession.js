alasql(`
    ATTACH LOCALSTORAGE DATABASE agrosysdb;
    USE agrosysdb;
`);

// Verifica se há usuario logado na session, se não redireciona para a página de login
const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
if (!user) {
  window.location.href = "login.html";
}
