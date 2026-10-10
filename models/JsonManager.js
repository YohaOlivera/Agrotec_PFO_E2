const fs = require("fs");
const path = require("path");

class JsonManager {
  constructor(filename) {
    this.filepath = path.join(__dirname, "..", "data", filename);
  }

  read() {
    if (!fs.existsSync(this.filepath)) {
      return [];
    }
    const data = fs.readFileSync(this.filepath, "utf-8");
    return JSON.parse(data);
  }

  write(data) {
    fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2), "utf-8");
  }

  generateId() {
    const data = this.read();
    if (data.length === 0) return 1;
    const maxId = Math.max(...data.map((item) => item.id));
    return maxId + 1;
  }

  findAll() {
    return this.read();
  }

  findById(id) {
    return this.read().find((item) => item.id === parseInt(id));
  }

  create(item) {
    const data = this.read();
    const newItem = { id: this.generateId(), ...item };
    data.push(newItem);
    this.write(data);
    return newItem;
  }

  update(id, updatedFields) {
    const data = this.read();
    const index = data.findIndex((item) => item.id === parseInt(id));
    if (index === -1) return null;

    data[index] = { ...data[index], ...updatedFields, id: parseInt(id) };
    this.write(data);
    return data[index];
  }

  delete(id) {
    const data = this.read();
    const index = data.findIndex((item) => item.id === parseInt(id));
    if (index === -1) return false;

    data.splice(index, 1);
    this.write(data);
    return true;
  }
}

module.exports = JsonManager;
