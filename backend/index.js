import express from "express"
import mysql from "mysql"
import cors from "cors"
import multer from "multer"
import path from 'path'
import { createHash } from 'crypto';


const app= express()


const db= mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "Qwerty123",
    database: "marketplace"

})


app.use(express.json())
app.use(cors())
app.use('/images', express.static('images'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

app.get("/", (req, res)=>{
    res.json("Hiii, this is the backend")
})

// Fetch Active Products Only
app.get("/shoes", (req, res) => {
  const q = "SELECT * FROM shoes WHERE is_active = 1";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(data);
  });
});

// Fetch All Products (Active and Inactive)
app.get("/shoes/all", (req, res) => {
  const q = "SELECT * FROM shoes";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(data);
  });
});

// Activate Product (Mark as Active)
app.put("/shoes/activate/:id", (req, res) => {
  const shoeId = req.params.id;
  const q = "UPDATE shoes SET is_active = 1 WHERE id = ?";

  db.query(q, [shoeId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json("No item found to activate");
    }

    res.status(200).json("Successfully activated");
  });
});


app.get("/shoes/:id", (req, res) => {
  const shoeId = req.params.id;
  const q = "SELECT * FROM shoes WHERE id = ?";
  
  db.query(q, [shoeId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data[0]); 
  });
});

//ADD PRODUCTS
app.post("/shoes", upload.single('image'), (req, res) => {
  const q = "INSERT INTO shoes (`prod_name`, `prod_description`, `image`, `price`, `quantity`) VALUES (?, ?, ?, ?, ?)";
  
  const values = [
      req.body.prod_name,
      req.body.prod_description,
      req.file ? `/images/${req.file.filename}` : null,
      req.body.price,
      req.body.quantity
  ];
  
  db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json("Successfully executed");
  });
});

//MARK PRODUCTS AS INACTIVE
app.delete("/shoes/:id", (req, res) => {
  const shoeId = req.params.id;
  const q = "UPDATE shoes SET is_active = 0 WHERE id = ?";

  db.query(q, [shoeId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json("No item found to delete");
    }

    res.status(200).json("Successfully marked as unlisted");
  });
});



//UPDATE PRODUCTS
app.put("/shoes/:id", upload.single('image'), (req, res) => {
  const shoeId = req.params.id;
  const q = "UPDATE shoes SET `prod_name`=?, `prod_description`=?, `image`=?, `price`=?, `quantity`=? WHERE id=?";
  
  const values = [
      req.body.prod_name,
      req.body.prod_description,
      req.file ? `/images/${req.file.filename}` : req.body.image,
      req.body.price,
      req.body.quantity
  ];

  db.query(q, [...values, shoeId], (err, data) => {
      if (err) return res.json(err);
      return res.json("Successfully updated");
  });
});

//SIGNUP
app.post("/signup", async (req, res) => {
    const { username, fullName, email, phone, address, password } = req.body;

    if (!username || !fullName || !email || !phone || !address || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    try {
      const hashedPassword = createHash('sha256').update(password).digest('hex');
  
      const query = "INSERT INTO users (username, full_name, email, phone_number, address, password) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [username, fullName, email, phone, address, hashedPassword];
  
      db.query(query, values, (err, data) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Username, Email or Phone Number already exists." });
          }
          return res.status(500).json({ error: "Database error." });
        }
  
        res.status(201).json({ message: "User successfully registered!" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  });

  //LOG IN
  app.post("/login", (req, res) => {
    const { userIdentifier, password } = req.body;
  
    if (!userIdentifier || !password) {
      return res.status(400).json({ error: "Username/Email and password are required." });
    }
  
    const userQuery = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(userQuery, [userIdentifier, userIdentifier], (err, userResult) => {
      if (err) return res.status(500).json({ error: "Database error" });
  
      if (userResult.length > 0) {
        const user = userResult[0];
        const hashedPassword = createHash("sha256").update(password).digest("hex");
  
        if (hashedPassword !== user.password) {
          return res.status(400).json({ error: "Invalid credentials" });
        }
  
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
          message: "Login successful",
          user: { ...userWithoutPassword, role: user.role || "customer" },
        });
      } else {
        const adminQuery = "SELECT * FROM admins WHERE email = ? OR username = ?";
        db.query(adminQuery, [userIdentifier, userIdentifier], (err, adminResult) => {
          if (err) return res.status(500).json({ error: "Database error" });
  
          if (adminResult.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
          }
  
          const admin = adminResult[0];
  
          if (password !== admin.password) {
            return res.status(400).json({ error: "Invalid credentials" });
          }
  
          const { password: _, ...adminWithoutPassword } = admin;
          return res.status(200).json({
            message: "Login successful",
            user: { ...adminWithoutPassword, role: "admin" },
          });
        });
      }
    });
  });

  //CUSTOMER UPDATE ACCOUNT
  app.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const { username, full_name, phone_number, address, password } = req.body;
  
    let query = "UPDATE users SET username = ?, full_name = ?, phone_number = ?, address = ?";
    const values = [username, full_name, phone_number, address];
  
    if (password) {
      const hashedPassword = createHash("sha256").update(password).digest("hex");
      query += ", password = ?";
      values.push(hashedPassword);
    }
  
    query += " WHERE id = ?";
    values.push(userId);
  
    db.query(query, values, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Username or phone number already exists." });
        }
        return res.status(500).json({ error: "Database error." });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found." });
      }
  
      return res.json("Profile updated successfully!");
    });
  });

  //CUSTOMER DELETE ACCOUNT
  app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
    
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error occurred.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json({ message: 'Account deleted successfully.' });
    });
  });

  app.get('/shoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const shoe = await Shoe.findById(id); 
      res.json(shoe);
    } catch (err) {
      res.status(500).json({ message: "Error fetching product data" });
    }
  });


   //CUSTOMER ADD TO CART
  app.post("/cart/add", (req, res) => {
    const { userID, productID, quantity } = req.body;
    const query = "INSERT INTO cart (userID, productID, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
  
    db.query(query, [userID, productID, quantity], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      res.json({ success: true });
    });
  });

  //CUSTOMER FETCH ITEMS FROM CART
  app.get("/cart/:userID", (req, res) => {
    const { userID } = req.params;
    const query = `
      SELECT 
        c.cartID, 
        c.userID, 
        c.productID, 
        s.prod_name, 
        s.price, 
        s.image, 
        c.quantity, 
        (c.quantity * s.price) AS total_price
      FROM cart c
      JOIN shoes s ON c.productID = s.id
      WHERE c.userID = ?
    `;
  
    db.query(query, [userID], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(data);
    });
  });
  
  
  //CUSTOMER UPDATE ITEM FROM CART
  app.put("/cart/update", (req, res) => {
    const { userID, productID, quantity } = req.body;
  
    if (!userID || !productID || quantity == null) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
  
    const query = "UPDATE cart SET quantity = ? WHERE userID = ? AND productID = ?";
    db.query(query, [quantity, userID, productID], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      res.json({ success: true });
    });
  });
  
  //CUSTOMER REMOVE ITEM FROM CART
  app.delete("/cart/remove/:userID/:productID", (req, res) => {
    const { userID, productID } = req.params;
  
    if (!userID || !productID) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
  
    const query = "DELETE FROM cart WHERE userID = ? AND productID = ?";
    db.query(query, [userID, productID], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "No matching item found to remove" });
      }
  
      res.json({ success: true, message: "Item removed from cart successfully" });
    });
  });
  
  

//CUSTOMER SAVE ORDERS TO DATABASE
app.post('/orders', (req, res) => {
  const { userID, items, totalAmount, shippingAddress, fullName, phoneNumber, paymentMethod } = req.body;

  if (!userID || !items || items.length === 0 || !totalAmount || !shippingAddress || !fullName || !phoneNumber || !paymentMethod) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  const orderQuery = `
    INSERT INTO orders (userID, full_name, phone_number, totalAmount, shippingAddress, paymentMethod)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(orderQuery, [userID, fullName, phoneNumber, totalAmount, shippingAddress, paymentMethod], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ success: false, error: 'Database error while inserting order.' });
    }

    const orderID = result.insertId; 

    const orderItemsQuery = `
      INSERT INTO order_items (orderID, productID, quantity, price)
      VALUES ?
    `;

    const orderItemsData = items.map(item => [orderID, item.productID, item.quantity, item.price]);

    db.query(orderItemsQuery, [orderItemsData], (err) => {
      if (err) {
        console.error('Error inserting order items:', err);
        return res.status(500).json({ success: false, error: 'Database error while inserting order items.' });
      }

      items.forEach(item => {
        const updateQuantityQuery = `
          UPDATE shoes
          SET quantity = quantity - ?
          WHERE id = ? AND quantity >= ?
        `;
        db.query(updateQuantityQuery, [item.quantity, item.productID, item.quantity], (err) => {
          if (err) console.error('Error updating product quantity:', err);
        });
      });

      res.json({ success: true, message: 'Order placed successfully!' });
    });
  });
});



//CUSTOMER FETCH VIEW ORDERS
app.get('/orders/:userID', (req, res) => {
  const { userID } = req.params;

  const query = `
    SELECT o.orderID, o.orderDate, o.status, o.totalAmount, o.shippingAddress, o.paymentMethod,
           oi.productID, oi.quantity, oi.price, s.prod_name
    FROM orders o
    JOIN order_items oi ON o.orderID = oi.orderID
    JOIN shoes s ON oi.productID = s.id
    WHERE o.userID = ?
    ORDER BY o.orderDate DESC
  `;

  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // ✅ Group items by orderID
    const orders = {};
    results.forEach(row => {
      if (!orders[row.orderID]) {
        orders[row.orderID] = {
          orderID: row.orderID,
          orderDate: row.orderDate,
          status: row.status,
          totalAmount: row.totalAmount,
          shippingAddress: row.shippingAddress,
          paymentMethod: row.paymentMethod,
          items: []
        };
      }

      orders[row.orderID].items.push({
        productID: row.productID,
        prod_name: row.prod_name,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.json(Object.values(orders));
  });
});

  
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT full_name, address, phone_number FROM users WHERE id = ?';
  db.query(query, [id], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(data[0]);
  });
});

//CUSTOMER CLEAR CART
app.delete("/cart/clear/:userID", (req, res) => {
  const { userID } = req.params;

  if (!userID) {
    return res.status(400).json({ success: false, error: "Missing userID" });
  }

  const query = "DELETE FROM cart WHERE userID = ?";
  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "No items found to clear" });
    }

    res.json({ success: true, message: "Cart cleared successfully" });
  });
});



// ADMIN DASHBOARD VIEW PENDING ORDERS

// GET ALL ORDERS
app.get('/orders', (req, res) => {
  const query = `
    SELECT o.orderID, o.orderDate, o.status, o.totalAmount, o.shippingAddress, o.paymentMethod,
           oi.productID, oi.quantity, oi.price, s.prod_name, u.full_name, u.phone_number
    FROM orders o
    JOIN order_items oi ON o.orderID = oi.orderID
    JOIN shoes s ON oi.productID = s.id
    JOIN users u ON o.userID = u.id
    ORDER BY o.orderDate DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    const orders = {};
    results.forEach(row => {
      if (!orders[row.orderID]) {
        orders[row.orderID] = {
          orderID: row.orderID,
          orderDate: row.orderDate,
          status: row.status,
          totalAmount: row.totalAmount,
          shippingAddress: row.shippingAddress,
          paymentMethod: row.paymentMethod, 
          full_name: row.full_name,
          phone_number: row.phone_number,
          items: []
        };
      }

      orders[row.orderID].items.push({
        productID: row.productID,
        prod_name: row.prod_name,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.json(Object.values(orders));
  });
});


//ADMIN DASHBOARD UPDATE ORDER STATUS
app.put('/orders/update/:orderID', (req, res) => {
  const { orderID } = req.params;
  const { status } = req.body;

  if (!orderID || !status) {
    return res.status(400).json({ error: 'Missing orderID or status' });
  }

  const query = 'UPDATE orders SET status = ? WHERE orderID = ?';
  db.query(query, [status, orderID], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, message: 'Order status updated successfully!' });
  });
});

//ADMIN DASHBOARD VIEW USERS
app.get('/users', async (req, res) => {
  try {
    db.query('SELECT id, full_name, username, email, phone_number, address FROM users', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(8800, ()=>{
    console.log("connected to backend")
})