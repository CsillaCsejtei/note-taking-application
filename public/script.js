const noteInput = document.getElementById("note");
const addButton = document.getElementById("addNote");
const noteList = document.getElementById("note-list");

let editingNoteId = null;

window.onload = loadNotes;

addButton.addEventListener("click", function (e) {
  e.preventDefault();
  const noteText = noteInput.value.trim();
  if (!noteText) return alert("Please write something!");

  if (editingNoteId) {
    updateNote(editingNoteId, noteText);
  } else {
    addNote(noteText);
  }
});

function loadNotes() {
  fetch("/note")
    .then((res) => res.json())
    .then((notes) => {
      noteList.innerHTML = ""; 
      notes.forEach((note) => showNote(note.note, note.id));
    });
}

function addNote(text) {
  fetch("/note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: text }),
  })
    .then((res) => res.json())
    .then((data) => {
      showNote(data.note.note, data.note.id);
      noteInput.value = "";
    });
}

function updateNote(id, text) {
  fetch(`/note/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: text }),
  })
    .then((res) => res.json())
    .then(() => {
      loadNotes(); 
      noteInput.value = "";
      addButton.textContent = "Add";
      editingNoteId = null;
    });
}

function showNote(text, id) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    noteInput.value = text;
    editingNoteId = id;
    addButton.textContent = "Update";
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    fetch(`/note/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => li.remove());
  };

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  noteList.appendChild(li);
}
