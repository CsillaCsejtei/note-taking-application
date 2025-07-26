var noteInput = document.getElementById("note");
var addButton = document.getElementById("addNote");
var noteList = document.getElementById("note-list");

addButton.addEventListener("click", addNote);

window.onload = loadNotes;

function loadNotes() {
  fetch("/note")
    .then(function (response) {
      return response.json(); 
    })
    .then(function (notes) {
      notes.forEach(function (note) {
        showNoteOnPage(note.note);
      });
    });
}

function addNote() {
  var note = noteInput.value.trim();

  if (note === "") {
    alert("Please write something!");
    return;
  }

  fetch("/note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note: note }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showNoteOnPage(data.note.note); 
      noteInput.value = "";
    });
}

function showNoteOnPage(note) {
  var li = document.createElement("li");
  li.textContent = note;
  noteList.appendChild(li);
}
