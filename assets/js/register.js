$(document).ready(function () {
    $('#registerForm').submit(function (e) {
        e.preventDefault();

        var demo = window.APP_CONFIG && window.APP_CONFIG.demoMode === true;

        if (demo) {
            var token = 'dummy_' + Date.now().toString(36);
            localStorage.setItem('session_token', token);
            alert('Successfully Registered');
            $('#message').html('<span class="text-success">Successfully Registered</span>');
            setTimeout(function () { window.location.href = 'profile.html'; }, 1500);
            return;
        }

        var formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };

        $.ajax({
            type: 'POST',
            url: 'assets/php/register.php',
            data: formData,
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    alert('Successfully Registered');
                    $('#message').html('<span class="text-success">Successfully Registered</span>');
                    setTimeout(function () { window.location.href = 'profile.html'; }, 1500);
                } else {
                    $('#message').html('<span class="text-danger">' + response.message + '</span>');
                }
            },
            error: function () {
                $('#message').html('<span class="text-danger">An error occurred. Please try again.</span>');
            }
        });
    });
});
