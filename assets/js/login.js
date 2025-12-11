$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        var $btn = $(this).find('button[type="submit"]');
        $btn.prop('disabled', true).text('Logging in...');

        // Always-success login: set dummy token, show success, redirect to Sign-Up
        var token = 'dummy_' + Date.now().toString(36);
        localStorage.setItem('session_token', token);

        alert('Successfully Logged In');
        $('#message').html('<span class="text-success">Successfully Logged In</span>');

        setTimeout(function () {
            window.location.href = 'register.html';
        }, 1000);

        $btn.prop('disabled', false).text('Login');
    });
});
