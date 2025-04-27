/**
 * Ceylon Burgers POS System - Authentication Controller
 * This file handles authentication and authorization for protected pages
 */

// Check if user has valid session
function validateSession() {
    const authToken = sessionStorage.getItem('authToken');
    const userRole = sessionStorage.getItem('userRole');
    
    // No token means no authenticated session
    if (!authToken || !userRole) {
        redirectToLogin();
        return false;
    }
    
    // Get active sessions from localStorage
    const sessions = JSON.parse(localStorage.getItem("ActiveSessions")) || {};
    
    // Look for matching session
    let isValidSession = false;
    for (const user in sessions) {
        if (sessions[user].token === authToken) {
            // Check if session is expired
            if (sessions[user].expires < new Date().getTime()) {
                // Session expired, remove it
                delete sessions[user];
                localStorage.setItem("ActiveSessions", JSON.stringify(sessions));
                redirectToLogin();
                return false;
            }
            isValidSession = true;
            // Refresh session expiry time
            sessions[user].expires = new Date().getTime() + (userRole === 'admin' ? 24 : 12) * 60 * 60 * 1000;
            localStorage.setItem("ActiveSessions", JSON.stringify(sessions));
            break;
        }
    }
    
    if (!isValidSession) {
        redirectToLogin();
        return false;
    }
    
    return true;
}

// Validate authorization based on required role
function checkAuthorization(requiredRole) {
    const userRole = sessionStorage.getItem('userRole');
    
    if (!userRole || userRole !== requiredRole) {
        alert(`Access denied. You need ${requiredRole} privileges to access this page.`);
        redirectToLogin();
        return false;
    }
    
    return true;
}

// Redirect to login page
function redirectToLogin() {
    // Clear session data
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('selectedCashier');
    
    // Determine relative path to login page based on current URL
    const isInSubfolder = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/cashier/');
    window.location.href = isInSubfolder ? '../index.html' : 'index.html';
}

// Logout user
function logout() {
    const authToken = sessionStorage.getItem('authToken');
    const sessions = JSON.parse(localStorage.getItem("ActiveSessions")) || {};
    
    // Remove the current session
    for (const user in sessions) {
        if (sessions[user].token === authToken) {
            delete sessions[user];
            break;
        }
    }
    
    localStorage.setItem("ActiveSessions", JSON.stringify(sessions));
    redirectToLogin();
}

// Check HTTPS status
function ensureSecureConnection() {
    if (window.ceylonBurgerUtils) {
        window.ceylonBurgerUtils.checkHttps();
    } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        // Fallback if utilities aren't loaded
        console.warn('This application is not running over HTTPS. For production environments, HTTPS is strongly recommended for security.');
        
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
        
        if (document.body) {
            document.body.prepend(warningBanner);
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.prepend(warningBanner);
            });
        }
    }
}

// Run security checks when page loads
document.addEventListener('DOMContentLoaded', function() {
    ensureSecureConnection();
    
    // Only validate session on pages that require authentication
    // (exclude the login page)
    if (!window.location.pathname.endsWith('index.html') && 
        !window.location.pathname.endsWith('/') &&
        !window.location.pathname.endsWith('/Ceylon-Burgers/')) {
        validateSession();
        
        // Check specific role authorization
        if (window.location.pathname.includes('/admin/')) {
            checkAuthorization('admin');
        } else if (window.location.pathname.includes('/cashier/')) {
            checkAuthorization('cashier');
        }
    }
});