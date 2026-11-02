# MT1-LABEXAM - Shopping Cart Management

## Setup
```bash
npm install
```

## Run Part A (built-in HTTP and FS modules)
```bash
node httpServer.js
```
Open `http://localhost:3000/`, `/cart`, `/about`, and `/home`.

POST `/add-to-cart` with JSON:
```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1
}
```

## Run Part B (Express REST API)
Open a second terminal:
```bash
node expressApp.js
```
Use `http://localhost:4000/cart` in Postman.

Endpoints:
- GET `/cart`
- GET `/cart/:id`
- POST `/cart`
- PUT `/cart/:id`
- DELETE `/cart/:id`

For POST, send JSON with `id`, `productName`, `price`, `quantity`, and `category`.
For PUT, send updated `productName`, `price`, `quantity`, and `category`.

## Notes
- No database is used; data is stored in JavaScript arrays.
- The two servers run independently on ports 3000 and 4000.
- Data resets when the server restarts.
- Save your own screenshots in the `screenshots` folder.
