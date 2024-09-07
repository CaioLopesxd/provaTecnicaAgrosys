alasql(`
    ATTACH LOCALSTORAGE DATABASE agrosysdb;
    USE agrosysdb;
`);

const showUserData = document.querySelector(".showUserData");

showUserData.innerHTML = `
    <h1>Olá, ${user.username}!</h1>
    <h2>Seja bem-vindo ao AgroSys!</h2>
    

    `;
