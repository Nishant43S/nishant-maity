// send mail
 // custom alert function
function showAlert(message, type="success") {
    const overlay = document.getElementById("customAlert");
    const box = document.getElementById("alertBox");
    const msg = document.getElementById("alertMessage");
    msg.textContent = message;

    box.className = "alert-box " + type; 
    overlay.style.display = "flex";
    }

    function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}

// send mail function
function sendMail() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let subject = document.getElementById("subject").value.trim();
    let message = document.getElementById("message").value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
        alert("⚠️ Please fill in all fields!");
        return;
    }

    if (!email.endsWith("@gmail.com")) {
        alert("⚠️ Please enter a valid Gmail address!");
        return;
    }

    let parms = { name, email, subject, message };

   
    emailjs.send("service_az9y94n", "template_9y7hg59", parms).then(
            () => alert("✅ Email Sent Successfully!", "success"),
            () => alert("❌ Email Not Sent!", "error")
    );
}      
        
// Generate animated stars
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        
        // Random size variation
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        starsContainer.appendChild(star);
    }
}

// Form animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    
    // Social icon click effects
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
        
// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);