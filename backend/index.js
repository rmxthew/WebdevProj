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

app.get("/shoes", (req, res)=>{
    const q= "SELECT * FROM shoes"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/shoes/:id", (req, res) => {
  const shoeId = req.params.id;
  const q = "SELECT * FROM shoes WHERE id = ?";
  
  db.query(q, [shoeId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data[0]); // Return the first (and should be only) result
  });
});

app.post("/shoes", upload.single('image'), (req, res) => {
  // Note: updated query to explicitly list all columns including quantity
  const q = "INSERT INTO shoes (`prod_name`, `prod_description`, `image`, `price`, `quantity`) VALUES (?, ?, ?, ?, ?)";
  
  const values = [
      req.body.prod_name,
      req.body.prod_description,
      req.file ? `/images/${req.file.filename}` : null,
      req.body.price,
      req.body.quantity
  ];
  
  // Changed to use values directly instead of wrapping in an array
  db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json("Successfully executed");
  });
});


app.delete("/shoes/:id", (req, res)=>{
    const shoeId= req.params.id;
    const q= "DELETE FROM shoes WHERE id = ?"

    db.query(q, [shoeId], (err, data)=>{
        if (err) return res.json(err);
        return res.json("Sucessfully deleted");
    });
})

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


app.post("/signup", async (req, res) => {
    const { username, fullName, email, phone, address, password } = req.body;
  
    // Check if all fields are provided
    if (!username || !fullName || !email || !phone || !address || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    try {
      // Use SHA256 to hash the password
      const hashedPassword = createHash('sha256').update(password).digest('hex');
  
      // SQL query to insert the user data into the database
      const query = "INSERT INTO users (username, full_name, email, phone_number, address, password) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [username, fullName, email, phone, address, hashedPassword];
  
      // Execute the query
      db.query(query, values, (err, data) => {
        if (err) {
          // Handle duplicate entry error (email or username already exists)
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Username, Email or Phone Number already exists." });
          }
          // Handle other types of database errors
          return res.status(500).json({ error: "Database error." });
        }
  
        // Send success message on successful insertion
        res.status(201).json({ message: "User successfully registered!" });
      });
    } catch (error) {
      // Catch any other unexpected errors
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  });

  
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


  app.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const { username, full_name, phone_number, address, password } = req.body;
  
    let query = "UPDATE users SET username = ?, full_name = ?, phone_number = ?, address = ?";
    const values = [username, full_name, phone_number, address];
  
    // If a password is provided, hash it and add it to the query
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
      const shoe = await Shoe.findById(id); // Replace with your database query
      res.json(shoe);
    } catch (err) {
      res.status(500).json({ message: "Error fetching product data" });
    }
  });
  
  
  app.post('/cart', (req, res) => {
    const { userId, items } = req.body;
    const query = 'INSERT INTO cart (user_id, items) VALUES (?, ?)';
    db.query(query, [userId, JSON.stringify(items)], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Cart saved successfully' });
    });
  });
  
  app.post('/orders', (req, res) => {
    const { userId, cart } = req.body;
    const query = 'INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)';
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    db.query(query, [userId, JSON.stringify(cart), total], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Order placed successfully', orderId: result.insertId });
    });
  });

 
  
  

  


  
app.listen(8800, ()=>{
    console.log("connected to backend")
})