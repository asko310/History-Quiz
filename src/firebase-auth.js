// src/firebase-auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"; // Full URL for Firebase Auth
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"; // Full URL for Firestore

const db = getFirestore(); // Initialize Firestore

// Signup
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const username = document.getElementById('signupUsername').value; // Get username

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save username and email to Firestore using the UserUID
        await setDoc(doc(db, "users", userCredential.user.uid), {
            username: username, // Save the username
            email: email // Save the email
        });

        alert("Account created successfully");
        window.location.href = 'index.html'; // Redirect to index.html after signup
    } catch (error) {
        alert("Error creating account: " + error.message);
        console.error(error);
    }
});

// Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get username from Firestore
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

        // Check if the document exists
        if (userDoc.exists()) {
            const username = userDoc.data().username; // Retrieve username
            localStorage.setItem('username', username); // Store username in local storage
            alert("Logged in successfully");
            window.location.href = 'index.html'; // Redirect to index.html after login
        } else {
            throw new Error("User document does not exist.");
        }
    } catch (error) {
        alert("Login failed: " + error.message);
        console.error(error);
    }
});
