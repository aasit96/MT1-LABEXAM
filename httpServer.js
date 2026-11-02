import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2 },
  { id: 2, productName: "Keyboard", price: 1200, quantity: 1 },
  { id: 3, productName: "USB Cable", price: 299, quantity: 3 }
];

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const url = req.url;

  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>Welcome to Shopping Cart Management</h1>");
  }

  if (method === "GET" && url === "/cart") {
    return sendJSON(res, 200, cart);
  }

  if (method === "POST" && url === "/add-to-cart") {
    try {
      const product = await readRequestBody(req);
      const { id, productName, price, quantity } = product;

      if (
        id === undefined || !productName ||
        typeof price !== "number" || price < 0 ||
        !Number.isInteger(quantity) || quantity <= 0
      ) {
        return sendJSON(res, 400, {
          message: "Required fields: id, productName, valid price and positive quantity"
        });
      }

      if (cart.some(item => item.id === id)) {
        return sendJSON(res, 409, { message: "Product ID already exists" });
      }

      const newProduct = { id, productName, price, quantity };
      cart.push(newProduct);
      return sendJSON(res, 201, {
        message: "Product added successfully",
        product: newProduct
      });
    } catch (error) {
      return sendJSON(res, 400, { message: error.message });
    }
  }

  if (method === "GET" && url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>About</h1><p>This application manages shopping cart products.</p>");
  }

  if (method === "GET" && url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, "utf8", (error, html) => {
      if (error) {
        return sendJSON(res, 500, { message: "Unable to read index.html file" });
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
    return;
  }

  return sendJSON(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
