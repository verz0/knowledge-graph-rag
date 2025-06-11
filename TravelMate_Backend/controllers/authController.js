const userService = require('../services/userService');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, name, travelInterests, travelStyle, preferredBudget } = req.body;

      // Validate required fields
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and name are required'
        });
      }

      const result = await userService.register({
        email,
        password,
        name,
        travelInterests,
        travelStyle,
        preferredBudget
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await userService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: { user: req.user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, travelInterests, travelStyle, preferredBudget } = req.body;
      const userId = req.user.id;

      const updatedUser = await userService.updateUser(userId, {
        name,
        travelInterests,
        travelStyle,
        preferredBudget
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      const result = await userService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to change password'
      });
    }
  }

  // Verify token (for frontend auth checks)
  async verifyToken(req, res) {
    try {
      // If we reach here, the token is valid (middleware already verified it)
      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: { user: req.user }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Token verification failed'
      });
    }
  }

  // Logout (client-side token removal, but we can log it)
  async logout(req, res) {
    try {
      // In a production app, you might want to blacklist the token
      // For now, just return success as client will remove the token
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
}

module.exports = new AuthController();
