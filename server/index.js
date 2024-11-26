const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());



const filepath = path.join(__dirname, "items.json");

app.get("/", (req, res) => {
  res.send("Add /items to the URL to access all the items.");
});

app.get("/items", (req, res) => {
  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send({ error: "Unable to read items file." });
    }
    try {
      const items = JSON.parse(data);
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(items);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).send({ error: "Invalid JSON format in items file." });
    }
  });
});
app.get("/items/:id" , (req , res)=>{
  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send({ error: "Unable to read items file." });
    }
    try {
      const items = JSON.parse(data);
      const specifiedItem = items.find(i => i.id == req.params.id);
      if(!specifiedItem){
        res.status(404).send({error : "item NOT found !"});
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(specifiedItem);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).send({ error: "Invalid JSON format in items file." });
    }
  });
});
app.post("/items" , (req , res)=> {
    const newItem = req.body;
    if(!newItem || !newItem.id ||!newItem.item){
      res.send("invalid item!");
      return;
    }
    console.log("item sent succesfully");

    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      let items;
      try {
        items = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return res.status(500).json({ error: "Internal server error" });
      }
      items.push(newItem);

      fs.writeFile(filepath, JSON.stringify(items, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          return res.status(500).json({ error: "Internal server error" });
        }
  
        console.log("New item added:", newItem);
        res.status(201).json({ message: "Item added successfully", newItem });
      });
    });
  });
  app.delete("/items/:id" , (req , res)=>{
      const itemToDelId = req.params.id;
      fs.readFile(filepath, "utf-8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).send({ error: "Unable to read items file." });
        }
        try {
          const items = JSON.parse(data);
          const newItems = items.filter(i => i.id != itemToDelId);
          if(items.length === newItems.length) {
            res.status(404).send({error : "item NOT found !"});
            return;
          }
            
          fs.writeFile(filepath, JSON.stringify(newItems, null, 2), (writeErr) => {
            if (writeErr) {
              console.error("Error writing file:", writeErr);
              return res.status(500).json({ error: "Internal server error" });
            }
  
            console.log("item deleted with id :", itemToDelId);
            res.status(201).json({ message: "item deleted of id", itemToDelId });
          });
        } catch (parseErr) {
          console.error("Error parsing JSON:", parseErr);
          res.status(500).send({ error: "Invalid JSON format in items file." });
        }
    });});
app.delete("/items" , (req , res)=>{
  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send({ error: "Unable to read items file." });
    }
    try {
      const items = JSON.parse(data);
      const newItems = [];
      if(!items) {
        res.status(404).send({error : "items NOT found !"});
        return;
      }
        
      fs.writeFile(filepath, JSON.stringify(newItems, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          return res.status(500).json({ error: "Internal server error" });
        }

        console.log("data cleared");
        res.status(204).json({ message: "data clearead" });
      });
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).send({ error: "Invalid JSON format in items file." });
    }
});
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
