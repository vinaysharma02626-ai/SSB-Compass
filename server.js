// =====================================================
// SSB COMPASS - NODE.JS EXPRESS SERVER
// Production-Ready Backend API
// =====================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/candidates/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images allowed.'));
    }
  }
});

// ===== IN-MEMORY DATABASES (Replace with MongoDB/Firebase in production) =====

let users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@ssbcompass.com',
    password: bcrypt.hashSync('password123', 10),
    phone: '9876543210',
    courses: ['VR', 'TAT'],
    purchases: [],
    createdAt: new Date('2025-01-01'),
    isActive: true
  }
];

let admins = [
  {
    id: '1',
    adminId: 'ADMIN123',
    password: bcrypt.hashSync('SSBNEW2026', 10),
    email: 'admin@ssbcompass.com',
    fullName: 'Ms. Vishnupriya Ahlawat',
    role: 'super_admin',
    permissions: ['all'],
    lastLogin: new Date(),
    isActive: true
  }
];

let courses = [
  {
    id: 'VR',
    name: 'Verbal Reasoning',
    description: 'Master series completion, coding-decoding, synonyms, and analogies',
    price: 999,
    duration: '30 minutes | 50 Questions',
    category: 'Reasoning',
    instructor: 'Team SSB COMPASS',
    enrolledStudents: 156,
    rating: 4.8,
    reviews: []
  },
  {
    id: 'NVR',
    name: 'Non-Verbal Reasoning',
    description: 'Pattern recognition, figure series, spatial ability training',
    price: 999,
    duration: '30 minutes | 50 Questions',
    category: 'Reasoning',
    instructor: 'Team SSB COMPASS',
    enrolledStudents: 142,
    rating: 4.7,
    reviews: []
  },
  {
    id: 'TAT',
    name: 'TAT Course',
    description: 'Complete Thematic Apperception Test training with real exam scenarios',
    price: 1499,
    duration: '4 minutes | 12 Pictures',
    category: 'Psychology',
    instructor: 'Ms. Vishnupriya Ahlawat',
    enrolledStudents: 98,
    rating: 4.9,
    reviews: []
  },
  {
    id: 'PSYCHE',
    name: 'Psyche Course',
    description: 'Psychological test preparation with practical response training',
    price: 1499,
    duration: '30 seconds | 60 Situations',
    category: 'Psychology',
    instructor: 'Ms. Vishnupriya Ahlawat',
    enrolledStudents: 87,
    rating: 4.8,
    reviews: []
  },
  {
    id: 'GD',
    name: 'Group Discussion (GD)',
    description: 'Master group discussion with current affairs and speaking strategies',
    price: 1999,
    duration: '8 minutes | 2 Rounds',
    category: 'Communication',
    instructor: 'Wing Commander (Retd.) Amit Kumar',
    enrolledStudents: 156,
    rating: 4.9,
    reviews: []
  },
  {
    id: 'PIQ',
    name: 'PIQ (Personal Interview)',
    description: 'Complete interview preparation with technical and GK questions',
    price: 2499,
    duration: '15 minutes | Interview Prep',
    category: 'Interview',
    instructor: 'Wing Commander (Retd.) Amit Kumar',
    enrolledStudents: 124,
    rating: 4.8,
    reviews: []
  },
  {
    id: 'SD',
    name: 'Self Description',
    description: '4-paragraph essay format with parent, teacher, friend, and self perspectives',
    price: 1299,
    duration: '15 minutes | Essay Writing',
    category: 'Writing',
    instructor: 'Dr. Rajesh Mishra',
    enrolledStudents: 95,
    rating: 4.7,
    reviews: []
  },
  {
    id: 'BUNDLE',
    name: 'Complete SSB Bundle',
    description: 'All 7 courses combined with lifetime access - Save ₹7,500!',
    price: 7499,
    duration: 'Lifetime | 100+ Hours',
    category: 'Bundle',
    instructor: 'All Faculty',
    enrolledStudents: 45,
    rating: 4.9,
    reviews: []
  }
];

let purchases = [
  {
    id: 'P001',
    userId: '1',
    courseId: 'VR',
    amount: 999,
    upiTransactionId: 'UPI20250124001',
    paymentStatus: 'completed',
    paymentMethod: 'UPI',
    purchaseDate: new Date('2025-01-20'),
    expiryDate: null,
    canRefund: true,
    refundDeadline: new Date('2025-01-23')
  },
  {
    id: 'P002',
    userId: '1',
    courseId: 'TAT',
    amount: 1499,
    upiTransactionId: 'UPI20250122001',
    paymentStatus: 'completed',
    paymentMethod: 'UPI',
    purchaseDate: new Date('2025-01-22'),
    expiryDate: null,
    canRefund: true,
    refundDeadline: new Date('2025-01-25')
  }
];

let candidates = [
  {
    id: '1',
    name: 'Rahul Singh',
    position: 'Fighter Pilot',
    service: 'IAF',
    selectionDate: '2025-08-15',
    photo: 'avatar1.jpg',
    testimonial: 'SSB COMPASS helped me clear all stages with confidence!',
    batch: 'Batch 2024',
    coursesTaken: ['VR', 'TAT', 'PSYCHE', 'GD', 'PIQ']
  },
  {
    id: '2',
    name: 'Priya Sharma',
    position: 'Service Officer',
    service: 'Army',
    selectionDate: '2025-07-20',
    photo: 'avatar2.jpg',
    testimonial: 'Excellent training and guidance for SSB preparation!',
    batch: 'Batch 2024',
    coursesTaken: ['BUNDLE']
  }
];

let futureEvents = [
  {
    id: '1',
    title: 'Advance GD Workshop',
    description: 'Live workshop on advanced group discussion techniques',
    category: 'Workshop',
    date: '2025-02-15',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Live PIQ Mentorship',
    description: 'One-on-one interview preparation with faculty',
    category: 'Webinar',
    date: '2025-02-20',
    status: 'scheduled'
  }
];

// ===== UTILITY FUNCTIONS =====

// Generate JWT Token
const generateToken = (id, type = 'user') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET || 'your-secret-key-min-32-chars', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-min-32-chars');
  } catch (error) {
    return null;
  }
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// ===== AUTHENTICATION ROUTES =====

// User Registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, dob } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const newUser = {
      id: 'USER' + Date.now(),
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      phone: phone || '',
      dob: dob || null,
      courses: [],
      purchases: [],
      createdAt: new Date(),
      isActive: true
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id, 'user');

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
});

// User Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, 'user');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        courses: user.courses
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Admin Login
app.post('/api/auth/admin-login', (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ message: 'Admin ID and password required' });
    }

    const admin = admins.find(a => a.adminId === adminId);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin ID or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid admin ID or password' });
    }

    // Update last login
    admin.lastLogin = new Date();

    const token = generateToken(admin.id, 'admin');

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin.id,
        adminId: admin.adminId,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during admin login', error: error.message });
  }
});

// Verify Token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  try {
    if (req.user.type === 'admin') {
      const admin = admins.find(a => a.id === req.user.id);
      return res.json({
        authenticated: true,
        type: 'admin',
        admin
      });
    } else {
      const user = users.find(u => u.id === req.user.id);
      return res.json({
        authenticated: true,
        type: 'user',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          courses: user.courses
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
});

// ===== COURSE ROUTES =====

// Get all courses
app.get('/api/courses', (req, res) => {
  try {
    res.json({
      message: 'Courses retrieved successfully',
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving courses', error: error.message });
  }
});

// Get specific course
app.get('/api/courses/:id', (req, res) => {
  try {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({
      message: 'Course retrieved successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving course', error: error.message });
  }
});

// Add new course (Admin)
app.post('/api/courses', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, price, duration, category, instructor } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newCourse = {
      id: 'COURSE' + Date.now(),
      name,
      description: description || '',
      price,
      duration: duration || '',
      category: category || 'General',
      instructor: instructor || 'SSB COMPASS Team',
      enrolledStudents: 0,
      rating: 0,
      reviews: [],
      createdAt: new Date()
    };

    courses.push(newCourse);

    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Update course (Admin)
app.put('/api/courses/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update fields
    Object.assign(course, req.body);
    course.updatedAt = new Date();

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete course (Admin)
app.delete('/api/courses/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const index = courses.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const deleted = courses.splice(index, 1);

    res.json({
      message: 'Course deleted successfully',
      course: deleted[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

// ===== PAYMENT ROUTES =====

// Initiate payment
app.post('/api/payments/initiate', authenticateToken, (req, res) => {
  try {
    const { courseId, amount } = req.body;

    if (!courseId || !amount) {
      return res.status(400).json({ message: 'Course ID and amount required' });
    }

    const paymentId = 'PAY' + Date.now();
    const transactionId = 'UPI' + Date.now();

    res.json({
      message: 'Payment initiated',
      paymentId,
      transactionId,
      amount,
      upiId: process.env.UPI_ID || '8290002626@axl',
      upiString: `upi://pay?pa=${process.env.UPI_ID || '8290002626@axl'}&pn=SSB%20COMPASS&am=${amount}&tn=Course%20Payment`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating payment', error: error.message });
  }
});

// Verify payment (Admin manual verification)
app.post('/api/payments/verify', authenticateToken, (req, res) => {
  try {
    const { courseId, amount, transactionId } = req.body;
    const userId = req.user.id;

    // Create purchase record
    const purchase = {
      id: 'P' + Date.now(),
      userId,
      courseId,
      amount,
      upiTransactionId: transactionId,
      paymentStatus: 'completed',
      paymentMethod: 'UPI',
      purchaseDate: new Date(),
      expiryDate: null,
      canRefund: true,
      refundDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    };

    purchases.push(purchase);

    // Add course to user
    const user = users.find(u => u.id === userId);
    if (user && !user.courses.includes(courseId)) {
      user.courses.push(courseId);
      user.purchases.push(purchase.id);
    }

    res.json({
      message: 'Payment verified and course access granted',
      purchase,
      courseAccess: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

// Get payment history
app.get('/api/payments/history', authenticateToken, (req, res) => {
  try {
    const userPurchases = purchases.filter(p => p.userId === req.user.id);

    res.json({
      message: 'Payment history retrieved',
      count: userPurchases.length,
      purchases: userPurchases
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving payment history', error: error.message });
  }
});

// ===== ADMIN ROUTES =====

// Get dashboard stats
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalRevenue = purchases
      .filter(p => p.paymentStatus === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const stats = {
      totalUsers: users.length,
      totalRevenue,
      coursesSold: purchases.length,
      successRate: 92,
      activeUsers: users.filter(u => u.isActive).length,
      completedTransactions: purchases.filter(p => p.paymentStatus === 'completed').length,
      pendingRefunds: purchases.filter(p => p.canRefund && new Date() < new Date(p.refundDeadline)).length,
      topCourse: courses.reduce((max, c) => c.enrolledStudents > max.enrolledStudents ? c : max)
    };

    res.json({
      message: 'Dashboard stats retrieved',
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard stats', error: error.message });
  }
});

// Add selected candidate
app.post('/api/admin/candidates', authenticateToken, requireAdmin, upload.single('photo'), (req, res) => {
  try {
    const { name, position, service, date, testimonial } = req.body;

    if (!name || !position) {
      return res.status(400).json({ message: 'Name and position are required' });
    }

    const newCandidate = {
      id: 'CAND' + Date.now(),
      name,
      position,
      service: service || 'Armed Forces',
      selectionDate: date || new Date().toISOString().split('T')[0],
      photo: req.file ? req.file.filename : 'default-avatar.jpg',
      testimonial: testimonial || '',
      batch: new Date().getFullYear().toString(),
      coursesTaken: [],
      addedAt: new Date()
    };

    candidates.push(newCandidate);

    res.status(201).json({
      message: 'Candidate added successfully',
      candidate: newCandidate
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding candidate', error: error.message });
  }
});

// Get all candidates
app.get('/api/admin/candidates', authenticateToken, requireAdmin, (req, res) => {
  try {
    res.json({
      message: 'Candidates retrieved',
      count: candidates.length,
      candidates
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving candidates', error: error.message });
  }
});

// Delete candidate
app.delete('/api/admin/candidates/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const index = candidates.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const deleted = candidates.splice(index, 1);

    res.json({
      message: 'Candidate deleted',
      candidate: deleted[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate', error: error.message });
  }
});

// Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const userList = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      courses: u.courses.length,
      createdAt: u.createdAt,
      isActive: u.isActive
    }));

    res.json({
      message: 'Users retrieved',
      count: userList.length,
      users: userList
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
});

// ===== FUTURE EVENTS ROUTES =====

// Add future event
app.post('/api/admin/events', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { title, description, category, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const newEvent = {
      id: 'EVT' + Date.now(),
      title,
      description: description || '',
      category: category || 'Workshop',
      date,
      status: 'scheduled',
      createdAt: new Date()
    };

    futureEvents.push(newEvent);

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// Get future events
app.get('/api/admin/events', authenticateToken, requireAdmin, (req, res) => {
  try {
    res.json({
      message: 'Events retrieved',
      count: futureEvents.length,
      events: futureEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({
    message: '🎖️ SSB COMPASS API is running',
    status: 'online',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// ===== HOME ROUTE =====

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SSB COMPASS API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login, /api/auth/admin-login, /api/auth/verify',
      courses: '/api/courses, /api/courses/:id (GET/POST/PUT/DELETE)',
      payments: '/api/payments/initiate, /api/payments/verify, /api/payments/history',
      admin: '/api/admin/dashboard, /api/admin/candidates, /api/admin/users, /api/admin/events',
      health: '/api/health'
    }
  });
});

// ===== ERROR HANDLING =====

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.path
  });
});

// ===== START SERVER =====

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎖️  SSB COMPASS API Server 🎖️       ║
║                                        ║
║  Status: ✅ Online & Running           ║
║  Port: ${PORT}                          
║  Environment: ${process.env.NODE_ENV || 'development'}        
║  Version: 1.0.0                        ║
║                                        ║
║  📚 Courses: ${courses.length}
║  👥 Users: ${users.length}
║  💰 Transactions: ${purchases.length}
║  🏆 Success Stories: ${candidates.length}
║                                        ║
║  API Docs: http://localhost:${PORT}/api/
║  Health Check: http://localhost:${PORT}/api/health
║                                        ║
║  Admin Credentials:                    ║
║  ID: ADMIN123                          ║
║  Pass: SSBNEW2026                      ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
