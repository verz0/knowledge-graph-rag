const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

// In-memory user storage (replace with database in production)
class UserService {
  constructor() {
    this.users = new Map();
    this.usersByEmail = new Map();
  }

  // Hash password
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'travelmate-app'
      }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
      );
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Register new user
  async register(userData) {
    const { email, password, name, travelInterests, travelStyle, preferredBudget } = userData;

    // Check if user already exists
    if (this.usersByEmail.has(email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const hashedPassword = await this.hashPassword(password);
    const userId = uuidv4();

    const user = new User({
      id: userId,
      email: email.toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      travelInterests: travelInterests || [],
      travelStyle: travelStyle || 'adventure',
      preferredBudget: preferredBudget || 'medium'
    });

    // Validate user data
    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Store user
    this.users.set(userId, user);
    this.usersByEmail.set(email.toLowerCase(), user);

    // Generate token
    const token = this.generateToken(user);

    return {
      user: user.toSafeObject(),
      token
    };
  }

  // Login user
  async login(email, password) {
    const user = this.usersByEmail.get(email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.updatedAt = new Date();

    // Generate token
    const token = this.generateToken(user);

    return {
      user: user.toSafeObject(),
      token
    };
  }

  // Get user by ID
  getUserById(userId) {
    const user = this.users.get(userId);
    return user ? user.toSafeObject() : null;
  }

  // Get user by email
  getUserByEmail(email) {
    const user = this.usersByEmail.get(email.toLowerCase());
    return user ? user.toSafeObject() : null;
  }

  // Update user
  async updateUser(userId, updateData) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields
    const allowedFields = ['name', 'travelInterests', 'travelStyle', 'preferredBudget'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    user.updatedAt = new Date();

    // Validate updated user
    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return user.toSafeObject();
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    user.password = await this.hashPassword(newPassword);
    user.updatedAt = new Date();

    return { message: 'Password changed successfully' };
  }

  // Delete user
  async deleteUser(userId) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    this.users.delete(userId);
    this.usersByEmail.delete(user.email);

    return { message: 'User deleted successfully' };
  }

  // Get all users (admin function)
  getAllUsers() {
    return Array.from(this.users.values()).map(user => user.toSafeObject());
  }
}

// Create singleton instance
const userService = new UserService();

module.exports = userService;
