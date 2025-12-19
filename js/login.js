$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        var $btn = $(this).find('button[type="submit"]');
        $btn.prop('disabled', true).text('Logging in...');

        $.ajax({
            url: 'php/login.php',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    localStorage.setItem('session_token', response.token);
                    alert(response.message);
                    $('#message').html('<span class="text-success">' + response.message + '</span>');
                    setTimeout(function () {
                        window.location.href = 'profile.html';
                    }, 1000);
                } else {
                    $('#message').html('<span class="text-danger">' + response.message + '</span>');
                    $btn.prop('disabled', false).text('Login');
                }
            },
            error: function () {
                $('#message').html('<span class="text-danger">Login failed. Please try again.</span>');
                $btn.prop('disabled', false).text('Login');
            }
        });
    });
});
