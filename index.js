// // const res = require("express/lib/response");
// // const {
// //   express,
// //   Product,
// //   User,
// //   app,
// //   port,
// //   ObjectId,
// //   Order,
// //   mongoose,
// // } = require("./moduless");
// // const { query } = require("express");
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;

// const multer = require("multer");

// mongoose.set("strictQuery", false);

// const inventory = new mongoose.Schema({
//   name: String,
//   description: String,
//   category: String,
//   quantity: Number,
//   unitPrice: Number,
//   manufacturer: String,
//   weight: Number,
//   storageLocation: String,
//   room: String,
//   shelf: Number,
//   img: {
//     data: Buffer,
//     contentType: String,
//   },
// });

// const Inventory = mongoose.model("Inventory", inventory);
// // dataBase Connection
// mongoose
//   .connect(
//     "mongodb+srv://ng8238:YkOaUlCo1LPAUkSo@cluster0.ofuy8a4.mongodb.net/backend",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

// const Storage = multer.diskStorage({
//   destination: "uploads",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// const upload = multer({
//   storage: Storage,
// }).single("testImage");

// //apis

// app.get("/", (req, res) => {
//   return res.json({ name: "abhh" });
// });

// app.post("/api/submit/", async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       category,
//       quantity,
//       unitPrice,
//       manufacturer,
//       weight,
//       storageLocation,
//       room,
//       shelf,
//     } = req.body;
//     const img = {
//       data: req.file.buffer,
//       contentType: req.file.mimetype,
//     };

//     newInventory = await Inventory.create({
//       name,
//       description,
//       category,
//       quantity,
//       unitPrice,
//       manufacturer,
//       weight,
//       storageLocation,
//       room,
//       shelf,
//       img,
//     });
//     console.log(req);
//     res.status(200).json({});
//   } catch (err) {
//     console.log(err);
//     res.status(404).json({});
//   }
// });

// app.get("/api/inevntory", async (req, res) => {
//   try {
//     const data = await Inventory.find({});
//     res.status(200).json(data);
//     s;
//   } catch (err) {
//     res.status(404).json({});
//   }
// });

// app.post("/api/update/", async (req, res) => {
//   try {
//     const {
//       itemId,
//       name,
//       description,
//       category,
//       quantity,
//       unitPrice,
//       manufacturer,
//       weight,
//       storageLocation,
//       room,
//       shelf,
//       img,
//     } = req.body;
//     let singleItem = await Inventory.findOne({ phone });
//     if (singleItem) {
//       singleItem.name = name;
//       singleItem.description = description;
//       singleItem.category = category;
//       singleItem.quantity = quantity;
//       singleItem.unitPrice = unitPrice;
//       singleItem.manufacturer = manufacturer;
//       singleItem.weight = weight;
//       singleItem.storageLocation = storageLocation;
//       singleItem.room = room;
//       singleItem.shelf = shelf;
//       singleItem.img = img;

//       // Save the updated user
//       await singleItem.save();

//       res.status(200).json({ message: "User updated successfully" });
//     } else {
//       res.status(404).json({});
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(404).json({});
//   }
// });

// app.listen(8000, () => console.log(`Server is Up... Port : ${8000}`));

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();

mongoose.connect(
  "mongodb+srv://ng8238:YkOaUlCo1LPAUkSo@cluster0.ofuy8a4.mongodb.net/backend",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const storage = multer.memoryStorage(); // Using memory storage for simplicity
const upload = multer({ storage: storage });

const inventorySchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  quantity: Number,
  unitPrice: Number,
  manufacturer: String,
  weight: Number,
  storageLocation: String,
  room: String,
  shelf: Number,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

app.use(express.json());

app.post("/api/submit", upload.single("img"), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      unitPrice,
      manufacturer,
      weight,
      storageLocation,
      room,
      shelf,
    } = req.body;

    const img = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    const newInventory = new Inventory({
      name,
      description,
      category,
      quantity,
      unitPrice,
      manufacturer,
      weight,
      storageLocation,
      room,
      shelf,
      img,
    });

    await newInventory.save();

    res.status(201).json({ message: "Form data submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/update/:itemId", upload.single("img"), async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const {
      name,
      description,
      category,
      quantity,
      unitPrice,
      manufacturer,
      weight,
      storageLocation,
      room,
      shelf,
    } = req.body;

    const img = {
      data: req.file ? req.file.buffer : undefined,
      contentType: req.file ? req.file.mimetype : undefined,
    };

    const updatedInventory = await Inventory.findByIdAndUpdate(
      itemId,
      {
        name,
        description,
        category,
        quantity,
        unitPrice,
        manufacturer,
        weight,
        storageLocation,
        room,
        shelf,
        img,
      },
      { new: true, runValidators: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({
      message: "Inventory item updated successfully",
      updatedInventory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/delete/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const deletedInventory = await Inventory.findByIdAndDelete(itemId);

    if (!deletedInventory) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
