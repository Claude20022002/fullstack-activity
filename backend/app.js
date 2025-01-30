const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

// C'est la connexion
mongoose
    .connect(
        "mongodb+srv://clusamote:8Q6g1JGEHK9NXsdM@cluster0.ha0te.mongodb.net/sample_mflix?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((error) => console.log("Connexion à MongoDB échouée : ", error));

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use(express.json());
app.delete("/api/products/:id", (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
        .then((product) => res.status(200).json({ message: "deleted" }))
        .catch((error) => res.status(400).json({ error }));
});
app.put("/api/products/:id", (req, res, next) => {
    Product.updateOne(
        { _id: req.params.id },
        { ...req.body, _id: req.params.id }
    )
        .then((product) => res.status(200).json({ message: "Modified" }))
        .catch((error) => res.status(400).json({ error }));
});
app.post("/api/products", (req, res) => {
    const { name, description, price, inStock } = req.body;
    const product = new Product({ name, description, price, inStock });
    product
        .save()
        .then((savedProduct) => res.status(201).json({ product: savedProduct }))
        .catch((error) => res.status(400).json({ error }));
});
app.get("/api/products/:id", (req, res, next) => {
    Product.findOne({ _id: req.params.id })
        .then((product) => res.status(200).json({ product }))
        .catch((error) => res.status(400).json({ error }));
});

app.use("/api/products", (req, res, next) => {
    Product.find()
        .then((products) => res.status(201).json({ products }))
        .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
