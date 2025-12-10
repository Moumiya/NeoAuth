$(document).ready(function () {
    // Require a session token (set by our always-success login/register)
    var token = localStorage.getItem('session_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load any locally saved profile data (no server calls)
    try {
        var saved = JSON.parse(localStorage.getItem('profile_data') || '{}');
        if (saved.age !== undefined) $('#age').val(saved.age);
        if (saved.dob !== undefined) $('#dob').val(saved.dob);
        if (saved.contact !== undefined) $('#contact').val(saved.contact);
    } catch (e) {
        // ignore parse errors
    }

    // Always-success update: save to localStorage and show success
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

    // Logout: clear local session + profile and go to login
    $('#logoutBtn').click(function () {
        localStorage.removeItem('session_token');
        localStorage.removeItem('profile_data');
        window.location.href = 'login.html';
    });
});
