// User model for TravelMate application
class User {
  constructor({
    id,
    email,
    name,
    password,
    travelInterests = [],
    travelStyle = 'adventure',
    preferredBudget = 'medium',
    createdAt = new Date(),
    updatedAt = new Date(),
    isActive = true
  }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password; // This will be hashed
    this.travelInterests = travelInterests;
    this.travelStyle = travelStyle;
    this.preferredBudget = preferredBudget;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }

  // Convert to safe object (without password)
  toSafeObject() {
    const { password, ...safeUser } = this;
    return safeUser;
  }

  // Validate user data
  validate() {
    const errors = [];

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!Array.isArray(this.travelInterests)) {
      errors.push('Travel interests must be an array');
    }

    if (!['budget', 'medium', 'luxury'].includes(this.preferredBudget)) {
      errors.push('Invalid preferred budget');
    }

    if (!['adventure', 'relaxation', 'cultural', 'business', 'family'].includes(this.travelStyle)) {
      errors.push('Invalid travel style');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = User;
