$(document).ready(function () {
    // Always-success login: show success, set a dummy token, redirect to Sign-In page
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        var $btn = $(this).find('button[type="submit"]');
        $btn.prop('disabled', true).text('Logging in...');

        // Set a dummy session token so Profile page doesn't redirect away
        var token = 'dummy_' + Date.now().toString(36);
        localStorage.setItem('session_token', token);

        alert('Successfully Logged In');
        $('#message').html('<span class="text-success">Successfully Logged In</span>');

        // Redirect to Sign-In page (login.html) as requested
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 1000);
    });
});
