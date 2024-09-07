alasql(`
    ATTACH LOCALSTORAGE DATABASE agrosysdb;
    USE agrosysdb;
  `);

const clients = alasql(`
    SELECT * FROM clients;
  `);

const clientSelect = document.getElementById("clientSelect");

clients.forEach((client) => {
  const option = document.createElement("option");
  option.value = client.id;
  option.innerText = client.completeName;
  clientSelect.appendChild(option);
});

clientSelect.addEventListener("change", (e) => {
  const clientId = e.target.value;
  const client = alasql(`
    SELECT * FROM adress WHERE clientId = ${clientId};
  `);
  const adress = document.getElementById("adress");

  if (client.length === 0) {
    adress.innerHTML = "<p>Não há endereço cadastrado para este cliente</p>";
    return;
  }

  adress.innerHTML = "";

  client.forEach((c) => {
    const addressCard = document.createElement("div");
    addressCard.classList.add("address-card");

    addressCard.innerHTML = `
      <p><strong>CEP:</strong> ${c.cep}</p>
      <p><strong>Rua:</strong> ${c.street}</p>
      <p><strong>Bairro:</strong> ${c.neighborhood}</p>
      <p><strong>Cidade:</strong> ${c.city}</p>
      <p><strong>Estado:</strong> ${c.state}</p>
      <p id="trueAdress"><strong>Endereço Principal:</strong> ${
        c.mainAdress ? "Sim" : "Não"
      }</p>
    `;
    const trueAdress = addressCard.querySelector("#trueAdress");
    if (c.mainAdress) {
      trueAdress.style.fontWeight = "bold";
      trueAdress.style.color = "green";
    } else {
      trueAdress.style.fontWeight = "bold";
      trueAdress.style.color = "red";
    }

    adress.appendChild(addressCard);
  });
});
