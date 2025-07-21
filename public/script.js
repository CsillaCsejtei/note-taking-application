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
        showNoteOnPage(note.text);
      });
    });
}

function addNote() {
  var text = noteInput.value.trim();

  if (text === "") {
    alert("Please write something!");
    return;
  }

  fetch("/note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showNoteOnPage(data.note.text); 
      noteInput.value = "";
    });
}

function showNoteOnPage(text) {
  var li = document.createElement("li");
  li.textContent = text;
  noteList.appendChild(li);
}
