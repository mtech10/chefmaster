import express from 'express';
// import pg from 'pg';
import pkg from 'pg';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// const { Pool } = pg;
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Successfully connected to the database!');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

const SECRET_KEY = 'mysecretkey';

app.get('/', (req, res) => { 
  res.json({ message: 'Server is running' }); 
});

app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const usernameCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (usernameCheck.rows.length > 0) {
    return res.status(409).json({ message: "That username is already taken. Please choose another." });
  }

  const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (emailCheck.rows.length > 0) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUserResult =await pool.query(
      'INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, email',
      [firstname, lastname, username, email, hashedPassword]
    );
    const user = newUserResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.json({ 
      message: 'User registered successfully!', 
      token, 
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.json({ 
      message: 'Login successfully', 
      token, 
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
}

app.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching single recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/recipes', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, ingredients, instructions, prepTime, calories, servings, difficulty, cookTime } = req.body;
    
    const imageUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    const authorId = req.user.id;

    const sqlQuery = `
      INSERT INTO recipes (title, category, description, ingredients, instructions, prep_time, calories, image_url, servings, difficulty, cook_time, author_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *; -- Returns the newly created row
    `;
    
    const values = [title, category, description, ingredients, instructions, prepTime, calories, imageUrl, servings, difficulty, cookTime, authorId];

    const result = await pool.query(sqlQuery, values);

    res.status(201).json({ 
      message: "Recipe created successfully!",
      recipe: result.rows[0] 
    });

  } catch (error) {
    console.error("Database error saving recipe:", error);
    res.status(500).json({ error: "Failed to save recipe" });
  }
});

app.get('/api/favorites', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sql = `
      SELECT r.* FROM recipes r
      JOIN favorites f ON r.id = f.recipe_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;
    
    const result = await pool.query(sql, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

app.post('/api/favorites/toggle', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.body;

    const checkResult = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );

    if (checkResult.rows.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
      return res.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      await pool.query('INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
      return res.json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    if (error.code === '23505') {
      console.warn("Race condition ignored: Favorite already exists.");
      return res.json({ message: "Already in favorites", isFavorite: true });
    }
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

app.get('/api/my-recipes', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recipes WHERE author_id = $1 ORDER BY created_at DESC', 
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete('/api/recipes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 AND author_id = $2 RETURNING *', 
      [id, req.user.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Not authorized to delete this recipe" });
    }
    
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/recipes/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, ingredients, instructions, prepTime, calories, servings, difficulty, cookTime } = req.body;
    
   let sqlQuery, values;

    if (req.file) {
      const imageUrl = `https://chefmaster-85kn.onrender.com//uploads/${req.file.filename}`;
      sqlQuery = `UPDATE recipes SET title=$1, category=$2, description=$3, ingredients=$4, instructions=$5, prep_time=$6, calories=$7, image_url=$8, servings=$9, difficulty=$10, cook_time=$11 WHERE id=$12 AND author_id=$13 RETURNING *`;
      values = [title, category, description, ingredients, instructions, prepTime, calories, imageUrl, servings, difficulty, cookTime, id, req.user.id];
    } else {
      sqlQuery = `UPDATE recipes SET title=$1, category=$2, description=$3, ingredients=$4, instructions=$5, prep_time=$6, calories=$7, servings=$8, difficulty=$9, cook_time=$10 WHERE id=$11 AND author_id=$12 RETURNING *`;
      values = [title, category, description, ingredients, instructions, prepTime, calories, servings, difficulty, cookTime, id, req.user.id];
    }

    const result = await pool.query(sqlQuery, values);
    if (result.rowCount === 0) return res.status(403).json({ error: "Not authorized to edit" });

    res.json({ message: "Recipe updated!", recipe: result.rows[0] });
  } catch (error) {
    console.error("Database error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

app.post('/logout', (req, res) => {
  return res.json({ message: 'Logout successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


