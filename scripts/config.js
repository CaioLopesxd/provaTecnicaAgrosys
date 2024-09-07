// Anexar e usar o banco de dados
alasql(`
    ATTACH LOCALSTORAGE DATABASE agrosysdb;
    USE agrosysdb;
`);

// Função para consultar e obter dados de uma tabela
function getTableData(tableName) {
  return alasql(`SELECT * FROM ${tableName}`);
}

// Função para criar um arquivo JSON e iniciar o download
function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Função para exportar o banco de dados
function exportDatabase() {
  const usersData = getTableData("users");
  const adressData = getTableData("adress");
  const clientsData = getTableData("clients");

  const allData = {
    users: usersData,
    adress: adressData,
    clients: clientsData,
  };

  // Baixar o arquivo JSON com os dados do banco de dados
  downloadJSON("database_export.json", allData);
}
// Adicionar um manipulador de eventos ao botão
document.getElementById("downloadDb").addEventListener("click", exportDatabase);

// Agora ele pode importar um arquivo JSON com os dados do banco de dados.
document.getElementById("importDb").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");

  if (fileInput.files.length === 0) {
    alert("Por favor, selecione um arquivo JSON.");
    return;
  }

  const file = fileInput.files[0];

  // Verificar se o arquivo é JSON
  if (file.type !== "application/json") {
    alert("Por favor, selecione um arquivo JSON.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      // Parse o conteúdo do arquivo JSON
      const data = JSON.parse(event.target.result);

      // Inserir dados nas tabelas correspondentes
      if (data.adress) {
        alasql("INSERT INTO adress SELECT * FROM ?", [data.adress]);
      }
      if (data.clients) {
        alasql("INSERT INTO clients SELECT * FROM ?", [data.clients]);
      }

      document.getElementById("status").innerText =
        "Banco de dados importado com sucesso!";
    } catch (e) {
      console.error("Erro ao importar banco de dados:", e);
      document.getElementById("status").innerText =
        "Erro ao importar banco de dados.";
    }
  };

  reader.readAsText(file);
});
