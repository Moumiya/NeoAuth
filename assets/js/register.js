$(document).ready(function () {
    // Always-success registration: show success and redirect to Profile page
    $('#registerForm').submit(function (e) {
        e.preventDefault();

        // Set a dummy session token so Profile page is accessible right away
        var token = 'dummy_' + Date.now().toString(36);
        localStorage.setItem('session_token', token);

        alert('Successfully Registered');
        $('#message').html('<span class="text-success">Successfully Registered</span>');

        setTimeout(function () {
            window.location.href = 'profile.html';
        }, 1500);
    });
});
