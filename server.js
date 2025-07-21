const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3001;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const dataFilePath = path.join(__dirname, "data.json");

const readNote = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const note = fs.readFileSync(dataFilePath);
  return JSON.parse(note);
};

const writeNote = (note) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(note, null, 2));
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

app.post("/echo", (req, res) => {
  res.json({ received: req.body });
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

