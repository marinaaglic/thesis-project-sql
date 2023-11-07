function sendGetRequestKolegiji() {
  fetch("/kolegiji")
    .then((response) => response.json())
    .then((data) => {
      const selectElement = document.querySelector(".cmb");
      selectElement.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.text = "Odaberite kolegij";
      selectElement.add(defaultOption);

      for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.value = data[i].ID_kolegij;
        option.text = data[i].Naziv;
        selectElement.add(option);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function sendGetRequestInfo(studentId) {
  fetch("/info?id=" + studentId)
    .then((response) => response.json())
    .then((data) => {
      displayInfoTable(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayInfoTable(data) {
  document.getElementById("overlay").style.display = "block";
  var toggle = document.getElementById("toggle");
  toggle.style.display = "block";
  var table = document.getElementById("info_table");
  table.innerHTML = "";

  var headerRow = table.insertRow();
  var headers = ["Ime", "Prezime", "E-mail", "JMBAG", "Naziv studija"];
  for (var i = 0; i < headers.length; i++) {
    var th = document.createElement("th");
    th.textContent = headers[i];
    headerRow.appendChild(th);
  }

  for (var i = 0; i < data.length; i++) {
    var info = data[i];
    var row = table.insertRow();
    var columns = ["Ime", "Prezime", "Email", "JMBAG", "Naziv_studija"];
    for (var j = 0; j < columns.length; j++) {
      var cell = row.insertCell();
      cell.textContent = info[columns[j]];
    }
  }
}

function Hide() {
  document.getElementById("overlay").style.display = "none";
}

function sendDeleteRequest(statusId) {
  fetch("/deleteStatus/" + statusId, {
    method: "DELETE"
  })
    .then((response) => {
      if (response.ok) {
        const deletedRow = document.getElementById(statusId).parentNode.parentNode;
        if (deletedRow) {
          deletedRow.parentNode.removeChild(deletedRow);
        }
      } else {
        console.log("Error deleting a row.");
      }
    })
    .catch((error) => console.log(error));
}

function sendUpdateRequest(idStatus) {
  var ocjena = document.getElementById("ocjena_" + idStatus).value;
  var requestBody = {
    ocjena: ocjena
  };

  fetch('/updateOcjena/' + idStatus, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(function (response) {
      if (response.ok) {

        console.log('Ocjena updated successfully');

      } else {

        console.log('Failed to update ocjena');
      }
    })
    .catch(function (error) {

      console.log('Error:', error);
    });
}

window.onload = function () {
  sendGetRequestKolegiji();
};



