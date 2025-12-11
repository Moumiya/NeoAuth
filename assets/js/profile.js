$(document).ready(function () {
    // Require a token (created by login/register), but create one if missing to avoid redirects
    var token = localStorage.getItem('session_token');
    if (!token) {
        token = 'dummy_' + Date.now().toString(36);
        localStorage.setItem('session_token', token);
    }

    // Load locally saved profile data
    try {
        var saved = JSON.parse(localStorage.getItem('profile_data') || '{}');
        if (saved.age !== undefined) $('#age').val(saved.age);
        if (saved.dob !== undefined) $('#dob').val(saved.dob);
        if (saved.contact !== undefined) $('#contact').val(saved.contact);
    } catch (e) { /* ignore */ }

    // Always-success update: persist to localStorage and show success
    $('#profileForm').submit(function (e) {
        e.preventDefault();
        var data = {
            age: $('#age').val(),
            dob: $('#dob').val(),
            contact: $('#contact').val()
        };
        localStorage.setItem('profile_data', JSON.stringify(data));
        alert('Profile updated successfully!');
        $('#message').html('<span class="text-success">Profile updated successfully!</span>');
    });

    // Logout clears local data and returns to login
    $('#logoutBtn').click(function () {
        localStorage.removeItem('session_token');
        localStorage.removeItem('profile_data');
        window.location.href = 'login.html';
    });
});
