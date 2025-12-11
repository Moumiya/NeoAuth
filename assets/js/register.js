$(document).ready(function () {
    $('#registerForm').submit(function (e) {
        e.preventDefault();

        // Always-success registration: set dummy token, show success, redirect to Profile
        var token = 'dummy_' + Date.now().toString(36);
        localStorage.setItem('session_token', token);

        alert('Successfully Registered');
        $('#message').html('<span class="text-success">Successfully Registered</span>');

        setTimeout(function () {
            window.location.href = 'profile.html';
        }, 1500);
    });
});
