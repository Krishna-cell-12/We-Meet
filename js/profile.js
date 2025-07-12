        // Firebase configuration (replace with your config)
        const firebaseConfig = {
    apiKey: "AIzaSyChI2TEywn1HH4uI4OqyEeYiTTmolHTu7g",
    authDomain: "we-meet-36738.firebaseapp.com",
    projectId: "we-meet-36738",
    storageBucket: "we-meet-36738.firebasestorage.app",
    messagingSenderId: "327097298490",
    appId: "1:327097298490:web:3935e1558f09af17a18f03",
    measurementId: "G-TLJRFHQJ1H"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();
        const storage = firebase.storage();

        // Interest options
        const interests = [
            { id: 'travel', name: 'Travel', icon: '✈️' },
            { id: 'music', name: 'Music', icon: '🎵' },
            { id: 'movies', name: 'Movies', icon: '🎬' },
            { id: 'books', name: 'Books', icon: '📚' },
            { id: 'fitness', name: 'Fitness', icon: '💪' },
            { id: 'cooking', name: 'Cooking', icon: '👨‍🍳' },
            { id: 'art', name: 'Art', icon: '🎨' },
            { id: 'photography', name: 'Photography', icon: '📸' },
            { id: 'gaming', name: 'Gaming', icon: '🎮' },
            { id: 'sports', name: 'Sports', icon: '⚽' },
            { id: 'dancing', name: 'Dancing', icon: '💃' },
            { id: 'hiking', name: 'Hiking', icon: '🥾' },
            { id: 'pets', name: 'Pets', icon: '🐕' },
            { id: 'technology', name: 'Technology', icon: '💻' },
            { id: 'food', name: 'Food', icon: '🍕' },
            { id: 'wine', name: 'Wine', icon: '🍷' }
        ];

        let selectedInterests = [];
        let currentUser = null;

        // Check authentication state
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                displayUserInfo(user);
                loadUserProfile();
            } else {
                // Redirect to login page
                window.location.href = '/login.html';
            }
        });

        // Display user authentication info
        function displayUserInfo(user) {
            const userEmail = document.getElementById('userEmail');
            const userJoined = document.getElementById('userJoined');
            
            userEmail.textContent = `Email: ${user.email}`;
            
            const joinDate = user.metadata.creationTime ? 
                new Date(user.metadata.creationTime).toLocaleDateString() : 
                'Unknown';
            userJoined.textContent = `Member since: ${joinDate}`;
        }

        // Load existing user profile
        async function loadUserProfile() {
            try {
                const doc = await db.collection('profiles').doc(currentUser.uid).get();
                if (doc.exists) {
                    const data = doc.data();
                    populateForm(data);
                    if (data.photoUrl) {
                        displayProfilePhoto(data.photoUrl);
                    }
                    selectedInterests = data.interests || [];
                    updateInterestsDisplay();
                    setFormEditable(false);
                    showProfileSavedUI(true);
                } else {
                    setFormEditable(true);
                    showProfileSavedUI(false);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        }

        // Populate form with existing data
        function populateForm(data) {
            document.getElementById('displayName').value = data.displayName || '';
            document.getElementById('age').value = data.age || '';
            document.getElementById('gender').value = data.gender || '';
            document.getElementById('location').value = data.location || '';
            document.getElementById('bio').value = data.bio || '';
            document.getElementById('lookingFor').value = data.lookingFor || '';
            document.getElementById('ageMin').value = data.ageMin || '';
            document.getElementById('ageMax').value = data.ageMax || '';
        }

        // Create interests grid
        function createInterestsGrid() {
            const grid = document.getElementById('interestsGrid');
            grid.innerHTML = '';
            
            interests.forEach(interest => {
                const item = document.createElement('div');
                item.className = 'interest-item';
                item.dataset.interest = interest.id;
                item.innerHTML = `
                    <i>${interest.icon}</i>
                    <span>${interest.name}</span>
                `;
                
                item.addEventListener('click', () => toggleInterest(interest.id));
                grid.appendChild(item);
            });
        }

        // Toggle interest selection
        function toggleInterest(interestId) {
            const item = document.querySelector(`[data-interest="${interestId}"]`);
            
            if (selectedInterests.includes(interestId)) {
                selectedInterests = selectedInterests.filter(id => id !== interestId);
                item.classList.remove('selected');
            } else {
                selectedInterests.push(interestId);
                item.classList.add('selected');
            }
        }

        // Update interests display
        function updateInterestsDisplay() {
            selectedInterests.forEach(interestId => {
                const item = document.querySelector(`[data-interest="${interestId}"]`);
                if (item) {
                    item.classList.add('selected');
                }
            });
        }

        // Handle photo upload
        document.getElementById('photoInput').addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file && currentUser) {
                try {
                    const storageRef = storage.ref(`profile-photos/${currentUser.uid}`);
                    const snapshot = await storageRef.put(file);
                    const downloadURL = await snapshot.ref.getDownloadURL();
                    displayProfilePhoto(downloadURL);
                    // Save photo URL to profile as 'photoUrl'
                    await db.collection('profiles').doc(currentUser.uid).set({
                        photoUrl: downloadURL
                    }, { merge: true });
                    // Also update localStorage
                    let profiles = JSON.parse(localStorage.getItem('weMeetProfiles')) || [];
                    profiles = profiles.filter(p => p.userId !== currentUser.uid && p.id !== currentUser.uid);
                    // Get current profile data from form
                    const formData = new FormData(document.getElementById('profileForm'));
                    const profileData = {
                        displayName: formData.get('displayName'),
                        age: parseInt(formData.get('age')),
                        gender: formData.get('gender'),
                        location: formData.get('location'),
                        bio: formData.get('bio'),
                        lookingFor: formData.get('lookingFor'),
                        ageMin: parseInt(formData.get('ageMin')),
                        ageMax: parseInt(formData.get('ageMax')),
                        interests: selectedInterests,
                        userId: currentUser.uid,
                        email: currentUser.email,
                        photoUrl: downloadURL
                    };
                    profiles.unshift({ ...profileData, id: currentUser.uid });
                    localStorage.setItem('weMeetProfiles', JSON.stringify(profiles));
                } catch (error) {
                    console.error('Error uploading photo:', error);
                    alert('Error uploading photo. Please try again.');
                }
            }
        });

        // Display profile photo
        function displayProfilePhoto(url) {
            const photo = document.getElementById('profilePhoto');
            const placeholder = document.getElementById('photoPlaceholder');
            
            photo.src = url;
            photo.style.display = 'block';
            placeholder.style.display = 'none';
        }

        // Handle form submission
        document.getElementById('profileForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const saveBtn = document.getElementById('saveBtn');
            const loading = document.getElementById('loading');
            const successMessage = document.getElementById('successMessage');
            
            // Disable button and show loading
            saveBtn.disabled = true;
            loading.classList.add('show');
            successMessage.classList.remove('show');
            
            try {
                const formData = new FormData(event.target);
                const profileData = {
                    displayName: formData.get('displayName'),
                    age: parseInt(formData.get('age')),
                    gender: formData.get('gender'),
                    location: formData.get('location'),
                    bio: formData.get('bio'),
                    lookingFor: formData.get('lookingFor'),
                    ageMin: parseInt(formData.get('ageMin')),
                    ageMax: parseInt(formData.get('ageMax')),
                    interests: selectedInterests,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    userId: currentUser.uid,
                    email: currentUser.email
                };
                
                // Save to Firestore
                await db.collection('profiles').doc(currentUser.uid).set(profileData, { merge: true });
                
                // Save to localStorage for home page integration
                let profiles = JSON.parse(localStorage.getItem('weMeetProfiles')) || [];
                // Remove any existing profile for this user
                profiles = profiles.filter(p => p.userId !== currentUser.uid && p.id !== currentUser.uid);
                // Add the new/updated profile
                profiles.unshift({
                    ...profileData,
                    id: currentUser.uid, // for compatibility
                    photoUrl: document.getElementById('profilePhoto').src || '',
                });
                localStorage.setItem('weMeetProfiles', JSON.stringify(profiles));
                
                // Show success message
                loading.classList.remove('show');
                successMessage.classList.add('show');
                
                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 3000);
                
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('Error saving profile. Please try again.');
            } finally {
                saveBtn.disabled = false;
                loading.classList.remove('show');
            }
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            createInterestsGrid();
        });

        // Redirect to home.html after successful profile save
        document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('profileForm');
            const loading = document.getElementById('loading');
            const successMessage = document.getElementById('successMessage');

            if (form) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    loading.style.display = 'block';
                    successMessage.style.display = 'none';

                    // Simulate async save (replace with your actual save logic)
                    // If you already have save logic in js/profile.js, call it here and redirect after success
                    setTimeout(function () {
                        loading.style.display = 'none';
                        successMessage.style.display = 'block';
                        setTimeout(function () {
                            window.location.href = 'home.html';
                        }, 1500); // 1.5 seconds delay before redirect
                    }, 1200);
                });
            }
        });

            document.addEventListener('DOMContentLoaded', function() {
        // Firebase config (replace with your own config)
        const firebaseConfig = {
            // Your Firebase config here
        };
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const auth = firebase.auth();
        const db = firebase.firestore();
        const storage = firebase.storage();

        const profileForm = document.getElementById('profileForm');
        const loadingDiv = document.getElementById('loading');
        const successMessage = document.getElementById('successMessage');
        const saveBtn = document.getElementById('saveBtn');
        const photoInput = document.getElementById('photoInput');
        const profilePhoto = document.getElementById('profilePhoto');
        const photoPlaceholder = document.getElementById('photoPlaceholder');

        // Example interests
        const interestsList = [
            "Music", "Movies", "Sports", "Travel", "Cooking", "Reading", "Dancing", "Gaming", "Fitness", "Art"
        ];
        const interestsGrid = document.getElementById('interestsGrid');
        interestsList.forEach(interest => {
            const label = document.createElement('label');
            label.className = 'interest-item';
            label.innerHTML = `<input type="checkbox" name="interests" value="${interest}"> ${interest}`;
            interestsGrid.appendChild(label);
        });

        let currentUser = null;
        let profileDocRef = null;
        let profilePhotoUrl = "";

        // Show loading spinner
        function showLoading(show) {
            loadingDiv.style.display = show ? 'block' : 'none';
            saveBtn.disabled = show;
        }

        // Show success message
        function showSuccess(show) {
            successMessage.style.display = show ? 'block' : 'none';
        }

        // Populate form with saved data
        function populateForm(data) {
            document.getElementById('displayName').value = data.displayName || '';
            document.getElementById('age').value = data.age || '';
            document.getElementById('gender').value = data.gender || '';
            document.getElementById('location').value = data.location || '';
            document.getElementById('bio').value = data.bio || '';
            document.getElementById('lookingFor').value = data.lookingFor || '';
            document.getElementById('ageMin').value = data.ageMin || '';
            document.getElementById('ageMax').value = data.ageMax || '';
            // Interests
            if (data.interests) {
                Array.from(document.querySelectorAll('input[name="interests"]')).forEach(cb => {
                    cb.checked = data.interests.includes(cb.value);
                });
            }
            // Profile photo
            if (data.photoUrl) {
                profilePhoto.src = data.photoUrl;
                profilePhoto.style.display = 'block';
                photoPlaceholder.style.display = 'none';
            }
        }

        // Set form to readonly or editable
        function setFormEditable(editable) {
            Array.from(profileForm.elements).forEach(el => {
                if (el.type !== 'button' && el.type !== 'submit') {
                    el.disabled = !editable;
                }
            });
            photoInput.disabled = !editable;
            saveBtn.style.display = editable ? 'inline-block' : 'none';
            let editBtn = document.getElementById('editProfileBtn');
            if (!editable && !editBtn) {
                editBtn = document.createElement('button');
                editBtn.id = 'editProfileBtn';
                editBtn.type = 'button';
                editBtn.className = 'save-btn';
                editBtn.textContent = '✏️ Edit Profile';
                editBtn.onclick = function() {
                    setFormEditable(true);
                    editBtn.style.display = 'none';
                };
                saveBtn.parentNode.insertBefore(editBtn, saveBtn.nextSibling);
            }
            if (editBtn) {
                editBtn.style.display = editable ? 'none' : 'inline-block';
            }
            const badge = document.getElementById('profileSavedBadge');
            if (badge) badge.style.display = editable ? 'none' : 'inline-block';
        }

        // Load user profile
        function loadUserProfile(uid) {
            profileDocRef = db.collection('profiles').doc(uid);
            profileDocRef.get().then(doc => {
                if (doc.exists) {
                    populateForm(doc.data());
                    setFormEditable(false);
                } else {
                    setFormEditable(true);
                }
            });
        }

        // Auth state
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                document.getElementById('userEmail').textContent = "Email: " + user.email;
                document.getElementById('userJoined').textContent = "Member since: " + (user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A');
                loadUserProfile(user.uid);
                // Load photo if exists
                db.collection('profiles').doc(user.uid).get().then(doc => {
                    if (doc.exists && doc.data().photoUrl) {
                        profilePhoto.src = doc.data().photoUrl;
                        profilePhoto.style.display = 'block';
                        photoPlaceholder.style.display = 'none';
                    }
                });
            } else {
                window.location.href = "login.html";
            }
        });

        // Photo upload
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file || !currentUser) return;
            showLoading(true);
            const storageRef = storage.ref('profile_photos/' + currentUser.uid);
            storageRef.put(file).then(snapshot => {
                return snapshot.ref.getDownloadURL();
            }).then(url => {
                profilePhoto.src = url;
                profilePhoto.style.display = 'block';
                photoPlaceholder.style.display = 'none';
                profilePhotoUrl = url;
                showLoading(false);
            }).catch(() => {
                showLoading(false);
            });
        });

        // Save profile
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!currentUser) return;
            showLoading(true);
            const formData = {
                displayName: document.getElementById('displayName').value,
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                location: document.getElementById('location').value,
                bio: document.getElementById('bio').value,
                lookingFor: document.getElementById('lookingFor').value,
                ageMin: document.getElementById('ageMin').value,
                ageMax: document.getElementById('ageMax').value,
                interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
                photoUrl: profilePhoto.src || profilePhotoUrl || ""
            };
            db.collection('profiles').doc(currentUser.uid).set(formData).then(() => {
                showLoading(false);
                showSuccess(true);
                setFormEditable(false);
                showProfileSavedUI(true);
                setTimeout(() => showSuccess(false), 2000);
            }).catch(() => {
                showLoading(false);
            });
        });
    });

    // In profile.js, modify the form submission handler
profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!currentUser) return;
    
    showLoading(true);
    const formData = {
        displayName: document.getElementById('displayName').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        location: document.getElementById('location').value,
        bio: document.getElementById('bio').value,
        lookingFor: document.getElementById('lookingFor').value,
        ageMin: document.getElementById('ageMin').value,
        ageMax: document.getElementById('ageMax').value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
        photoUrl: profilePhoto.src || profilePhotoUrl || "",
        userId: currentUser.uid,
        email: currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('profiles').doc(currentUser.uid).set(formData);
        
        // Dispatch a custom event with the profile data
        const profileCreatedEvent = new CustomEvent('profileCreated', {
            detail: formData
        });
        window.dispatchEvent(profileCreatedEvent);
        
        showLoading(false);
        showSuccess(true);
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    } catch (error) {
        console.error('Error saving profile:', error);
        showLoading(false);
        alert('Error saving profile. Please try again.');
    }
});

function showProfileSavedUI(show) {
    const badge = document.getElementById('profileSavedBadge');
    const editBtn = document.getElementById('editProfileBtn');
    if (badge) badge.style.display = show ? 'inline-block' : 'none';
    if (editBtn) editBtn.style.display = show ? 'inline-block' : 'none';
}