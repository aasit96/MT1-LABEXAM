import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 1200,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "Water Bottle",
    price: 399,
    quantity: 2,
    category: "Lifestyle",
  },
];

// Validate product data
function isValidProduct(product, requireId = true) {
  if (!product || typeof product !== "object") return false;

  if (requireId && (!Number.isInteger(product.id) || product.id <= 0)) {
    return false;
  }

  return (
    typeof product.productName === "string" &&
    product.productName.trim() !== "" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    Number.isInteger(product.quantity) &&
    product.quantity > 0 &&
    typeof product.category === "string" &&
    product.category.trim() !== ""
  );
}

// GET: Retrieve all cart items
app.get("/cart", (req, res) => {
  res.status(200).json(cart);
});

// GET: Retrieve one cart item by ID
app.get("/cart/:id", (req, res) => {
  const product = cart.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({
    ...product,
    totalPrice: product.price * product.quantity,
  });
});

// POST: Add a new product
app.post("/cart", (req, res) => {
  const product = req.body;

  if (!isValidProduct(product)) {
    return res.status(400).json({
      message:
        "Valid id, productName, price, quantity and category are required",
    });
  }

  if (cart.some((item) => item.id === product.id)) {
    return res.status(409).json({ message: "Product ID already exists" });
  }

  cart.push(product);

  res.status(201).json({
    message: "Product added successfully",
    product,
  });
});

// PUT: Update an existing product
app.put("/cart/:id", (req, res) => {
  const productId = Number(req.params.id);
  const index = cart.findIndex((item) => item.id === productId);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedProduct = {
    ...cart[index],
    ...req.body,
    id: cart[index].id,
  };

  if (!isValidProduct(updatedProduct, false)) {
    return res.status(400).json({
      message: "Valid productName, price, quantity and category are required",
    });
  }

  cart[index] = updatedProduct;

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

// DELETE: Remove a product
app.delete("/cart/:id", (req, res) => {
  const productId = Number(req.params.id);
  const index = cart.findIndex((item) => item.id === productId);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = cart.splice(index, 1)[0];

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

// Handle invalid JSON and other request errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  res.status(500).json({ message: "Internal server error" });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
