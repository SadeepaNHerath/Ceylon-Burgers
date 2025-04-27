/**
 * Ceylon Burgers POS System - Security Utilities
 * Contains functions for password hashing and security operations
 */

// Simple hash function to encrypt passwords
// In a production environment, use a stronger hashing library like bcrypt
function hashPassword(password) {
    let hash = 0;
    if (password.length === 0) return hash;
    
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Make the hash positive and convert to string with additional salt
    return Math.abs(hash).toString(16) + "cb" + (password.length * 7).toString(16);
}

// Verify password against stored hash
function verifyPassword(password, storedHash) {
    const calculatedHash = hashPassword(password);
    return calculatedHash === storedHash;
}

// Generate a session token
function generateSessionToken(username) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return hashPassword(username + timestamp + random);
}

// Initialize the credential store with hashed passwords
function initializeSecureCredentials() {
    if (JSON.parse(localStorage.getItem("SecureUserCredentials")) == null) {
        const credentials = {
            admin: {
                passwordHash: hashPassword("CBA@2004"),
                role: "admin"
            },
            cashier1: {
                passwordHash: hashPassword("CBC@2004"),
                role: "cashier",
                cashierId: "CASH001"
            },
            cashier2: {
                passwordHash: hashPassword("CBC@2004"),
                role: "cashier",
                cashierId: "CASH002"
            }
        };
        localStorage.setItem("SecureUserCredentials", JSON.stringify(credentials));
        console.log("Secure credentials initialized with hashed passwords");
    }
}

// Check for HTTPS and warn if not secure
function checkHttps() {
    if (window.location.protocol !== 'https:') {
        console.warn('This application is not running over HTTPS. For production environments, HTTPS is strongly recommended for security.');
        
        // Add a security warning to the page for non-HTTPS connections
        const warningBanner = document.createElement('div');
        warningBanner.style.backgroundColor = '#ffcccc';
        warningBanner.style.padding = '10px';
        warningBanner.style.textAlign = 'center';
        warningBanner.style.position = 'fixed';
        warningBanner.style.top = '0';
        warningBanner.style.left = '0';
        warningBanner.style.right = '0';
        warningBanner.style.zIndex = '1000';
        warningBanner.innerHTML = '<strong>Security Warning:</strong> This application is not running over a secure connection (HTTPS). Do not enter sensitive information.';
        
        // Add to body when it's available
        if (document.body) {
            document.body.prepend(warningBanner);
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.prepend(warningBanner);
            });
        }
        
        return false;
    }
    return true;
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return {
        score: strength,
        feedback: getStrengthFeedback(strength)
    };
}

function getStrengthFeedback(strength) {
    switch (strength) {
        case 0:
        case 1:
            return { message: "Very weak", color: "#ff0000" };
        case 2:
            return { message: "Weak", color: "#ff3300" };
        case 3:
            return { message: "Medium", color: "#ffcc00" };
        case 4:
            return { message: "Strong", color: "#99cc00" };
        case 5:
            return { message: "Very strong", color: "#00cc00" };
        default:
            return { message: "Unknown", color: "#cccccc" };
    }
}

// Function to securely store sensitive data
function secureStore(key, data) {
    try {
        // Encrypt the data in a real application
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Error storing data:", error);
    }
}

// Function to retrieve securely stored data
function secureRetrieve(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
}

// Export all utilities
window.ceylonBurgerUtils = {
    hashPassword,
    verifyPassword,
    generateSessionToken,
    initializeSecureCredentials,
    checkHttps,
    checkPasswordStrength,
    secureStore,
    secureRetrieve
};