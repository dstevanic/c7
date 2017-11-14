let firstName = 'Test'
let lastName = 'Testi3434c'
let imageUrl = 'https://cdn.dribbble.com/users/78637/avatars/small/radium_clear.png?1348170349'

let attendees = [];

function showForm() {
  //TODO: funkcija zaduzena za prikazivanje forme za kreiranje novog i editovanje postojeceg zapisa
  let formElem = document.getElementById('add-attendee');
  formElem.style.display = 'block';

}

function hideForm() {
  //TODO: funkcija zaduzena za skrivanje formi
  let formElem = document.getElementById('add-attendee');
  formElem.style.display = 'none';

}

function resetForm() {
  //TODO: funkcija za resetovanje forme 
  let attForm = document.getElementById('attendeeForm').reset();
}

function setupTable() {
  //TODO: funkcija za iscrtavanje HTML tabele na osnovu podataka dobijenih sa servera
  resetTable();
  getAttendees();

}

function resetTable() {
  //TODO: fukcija za resetovanje tabele
  var Table = document.getElementsByTagName("tbody")[0];
  Table.innerHTML = "";
}

function createAttendee() {
  //TODO: funkcija za pripremu forme za kreiranje novog zapisa
  let btnAdd = document.getElementById('btnAdd'),
    btnSave = document.getElementById('btnSave');

  btnAdd.style.display = 'block';
  btnSave.style.display = 'none';
  resetForm();
  showForm();
}

function editAttendee(attendeeId) {
  //TODO: funkcija za pripremu forme za editovanje izabrnog zapisa
  let btnAdd = document.getElementById('btnAdd'),
    btnSave = document.getElementById('btnSave');

  btnAdd.style.display = 'none';
  btnSave.style.display = 'block';

  showForm();
  getAttendee(attendeeId);

}

function postAttendee() {
  //TODO: funkcija za slanje podataka na server(new attendee)
  let attendeeId = document.getElementById('id-attendee'),
    first = document.getElementById('first-name-entry'),
    lastName = document.getElementById('last-name-entry'),
    email = document.getElementById('email-entry'),
    date = document.getElementById('date-entry');

  let xhr = new XMLHttpRequest();
  let url = 'https://3uc5taw99i.execute-api.us-east-1.amazonaws.com/latest/attendees';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {//Call a function when the state changes.
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      // Request finished. Do processing here.

      setupTable();
    }

  }
  xhr.send(JSON.stringify({
    firstName: first.value, lastName: lastName.value, email: email.value, dateBirth: date.value
  }));


  hideForm();
}

function putAttendee() {
  //TODO: funkcija za slanje editovanih podataka na server
  let attendeeId = document.getElementById('id-attendee'),
    first = document.getElementById('first-name-entry'),
    lastName = document.getElementById('last-name-entry'),
    email = document.getElementById('email-entry'),
    date = document.getElementById('date-entry');


  let xhr = new XMLHttpRequest();
  let url = 'https://3uc5taw99i.execute-api.us-east-1.amazonaws.com/latest/attendees/' + attendeeId.value;
  xhr.open('PUT', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  resetTable();
  xhr.onreadystatechange = function () {
    if (xhr.status == 200) {
      setupTable();
    } else {
      alert("Greska");
    }
  }
  // console.log('str', JSON.stringify({
  //   firstName: first.value, lastName: lastName.value, email: email.value, dateBirth: date.value
  // }));
  xhr.send(JSON.stringify({
    attendeesid: attendeeId.value, firstName: first.value, lastName: lastName.value, email: email.value, dateBirth: date.value
  }));
  console.log('str', JSON.stringify({
      firstName: first.value, lastName: lastName.value, email: email.value, dateBirth: date.value
    }));
  hideForm();

}

function deleteAttendee(attendeeId) {
  //TODO: funkcija brisanje podataka sa servera(za izabrani zapis)

  var xhr = new XMLHttpRequest();
  let url = 'https://3uc5taw99i.execute-api.us-east-1.amazonaws.com/latest/attendees/' + attendeeId;
  xhr.open("DELETE", url, true);
  xhr.onload = function () {
    let attendee = JSON.parse(xhr.responseText);
    if (xhr.status == 200) {
      setupTable();
    } else {
      alert('error');
    }



  }

  xhr.send(null);
  alert("Attendee deleted")
}

function getAttendees() {
  //TODO: funkcija za preuzimanje svih zapisa sa servera
  var xhr = new XMLHttpRequest();
  let url = 'https://3uc5taw99i.execute-api.us-east-1.amazonaws.com/latest/attendees';

  xhr.open('GET', url, true);
  xhr.onload = function () {
    //console.log('========> dsadasdasdasdsadd ', xhr);
    attendees = JSON.parse(xhr.response);

    for (let i = 0; i < attendees.length; i++) {
      let attendee = attendees[i];
      addAttendeeToTable(attendee.attendeesid, attendee.firstName, attendee.lastName, attendee.email, attendee.dateBirth);
    };
  }
  xhr.send(null);
}


function getAttendee(attendeeId) {
  //TODO: funkcija za preuzimanje izabranog zapisa sa servera
  var xhr = new XMLHttpRequest();
  let url = 'https://3uc5taw99i.execute-api.us-east-1.amazonaws.com/latest/attendees/' + attendeeId;

  xhr.open('GET', url, true);
  xhr.onload = function () {
    //console.log('========> dsadasdasdasdsadd ', xhr.response);
    attendee = JSON.parse(xhr.response);
    //console.log('========> dsadasdasdasdsadd ', attendee);
    let attendeeId = document.getElementById('id-attendee'),
      first = document.getElementById('first-name-entry'),
      lastName = document.getElementById('last-name-entry'),
      email = document.getElementById('email-entry'),
      date = document.getElementById('date-entry');
    attendeeId.value = attendee.attendeesid;
    first.value = attendee.firstName;
    lastName.value = attendee.lastName;
    email.value = attendee.email;
    date.value = attendee.dateBirth;

  }
  xhr.send(null);


}


function addAttendeeToTable(attendeeId, firstName, lastName, email, dateBirth) {
  //TODO: funkcija koja dodaje novi red u HTML tabelu

  let foundTables = document.getElementsByTagName('table');
  if (foundTables.length < 1) throw 'No table found';

  let table = foundTables[0].tBodies[0];

  let tr = document.createElement('tr');
  tr.className = 'attendee-row';
  let firstNameCell = document.createElement('td'),
    firstNameText = document.createTextNode(firstName);
  firstNameCell.appendChild(firstNameText);

  let lastNameCell = document.createElement('td'),
    lastNameText = document.createTextNode(lastName);
  lastNameCell.appendChild(lastNameText);

  let emailCell = document.createElement('td'),
    emailText = document.createTextNode(email);
  emailCell.appendChild(emailText);

  let dateCell = document.createElement('td'),
    dateText = document.createTextNode(dateBirth);
  dateCell.appendChild(dateText);

  let actionCell = document.createElement('td'),
    acttionButtonEdit = document.createElement('button'),
    acttionButtonDelete = document.createElement('button');
  acttionButtonEdit.id = "btnEdit";
  acttionButtonEdit.innerText = "Edit";
  acttionButtonDelete.innerText = "Delete";
  acttionButtonDelete.onclick = function () { deleteAttendee(attendeeId) };// function () { deleteRow(currentRowId) };===>drugi nacin , kada imamo id// deleteRow(acttionButtonDelete);//function(){deleteRow(this);};
  acttionButtonEdit.onclick = function () { editAttendee(attendeeId) };

  actionCell.appendChild(acttionButtonEdit);
  actionCell.appendChild(acttionButtonDelete);


  tr.appendChild(firstNameCell)
  tr.appendChild(lastNameCell)
  tr.appendChild(emailCell)
  tr.appendChild(dateCell)
  tr.appendChild(actionCell)


  table.appendChild(tr)

}

function setupCredentials() {
  let firstElem = document.getElementById('first-name-cred');
  let lastElem = document.getElementById('last-name-cred');
  let imageElem = document.getElementById('image');

  firstElem.innerText = firstName;
  lastElem.innerText = lastName;
  imageElem.src = imageUrl;
}

setupCredentials();
setupTable();

