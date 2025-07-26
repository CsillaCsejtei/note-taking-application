const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3001;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const noteFilePath = path.join(__dirname, "note.json");

const readNote = () => {
  if (!fs.existsSync(noteFilePath)) {
    return [];
  }
  const note = fs.readFileSync(noteFilePath);
  return JSON.parse(note);
};

const writeNote = (note) => {
  fs.writeFileSync(noteFilePath, JSON.stringify(note, null, 2));
};


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/note", (req, res) => {
  const note = readNote();
  res.json(note);
});

app.post("/note", (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };
  const currentNote = readNote();
  currentNote.push(newNote);
  writeNote(currentNote);
  res.json({ message: "Note saved successfully", note: newNote });
});

app.get("/note/:id", (req, res) => {
  const note = readNote();
  const item = note.find((item) => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.json(item);
});

app.put("/note/:id", (req, res) => {
  const note = readNote();
  const index = note.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Note not found" });
  note[index] = { ...note[index], ...req.body };
  writeNote(note);
  res.json({ message: "Note updated successfully", note: note[index] });
});

app.delete("/note/:id", (req, res) => {
  const note = readNote();
  const index = note.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Note not found" });
  const deletedItem = note.splice(index, 1);
  writeNote(note);
  res.json({
    message: "Note deleted successfully",
    deletedItem: deletedItem[0],
  });
});


app.post("/echo", (req, res) => {
  res.json({ received: req.body });
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

