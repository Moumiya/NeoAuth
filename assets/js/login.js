$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        var $btn = $(this).find('button[type="submit"]');
        $btn.prop('disabled', true).text('Logging in...');

        var demo = window.APP_CONFIG && window.APP_CONFIG.demoMode === true;

        if (demo) {
            var token = 'dummy_' + Date.now().toString(36);
            localStorage.setItem('session_token', token);
            alert('Successfully Logged In');
            $('#message').html('<span class="text-success">Successfully Logged In</span>');
            setTimeout(function () { window.location.href = 'register.html'; }, 1000);
            $btn.prop('disabled', false).text('Login');
            return;
        }

        var email = ($('#email').val() || '').trim();
        var password = ($('#password').val() || '').trim();

        $.ajax({
            type: 'POST',
            url: 'assets/php/login.php',
            data: { email: email, password: password },
            dataType: 'json',
            success: function (res) {
                try {
                    if (res && res.status === 'success' && res.token) {
                        localStorage.setItem('session_token', res.token);
                        alert('Successfully Logged In');
                        $('#message').html('<span class="text-success">Successfully Logged In</span>');
                        setTimeout(function () { window.location.href = 'register.html'; }, 1000);
                    } else {
                        $('#message').html('<span class="text-danger">' + (res.message || 'Invalid response') + '</span>');
                    }
                } finally {
                    $btn.prop('disabled', false).text('Login');
                }
            },
            error: function (xhr, status) {
                try {
                    var txt = xhr && xhr.responseText ? xhr.responseText : '';
                    var msg = 'An error occurred. Please try again.';
                    if (txt) {
                        try { var j = JSON.parse(txt); if (j && j.message) msg = j.message; } catch (_) {}
                    }
                    $('#message').html('<span class="text-danger">' + msg + '</span>');
                    console.error('Login error:', status, txt);
                } finally {
                    $btn.prop('disabled', false).text('Login');
                }
            }
        });
    });
});
