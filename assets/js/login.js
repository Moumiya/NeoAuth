$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        var email = ($('#email').val() || '').trim();
        var password = ($('#password').val() || '').trim();
        var $btn = $(this).find('button[type="submit"]');

        $btn.prop('disabled', true).text('Logging in...');

        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: { email: email, password: password },
            dataType: 'json',
            success: function (res) {
                try {
                    // If jQuery already parsed JSON, res is an object
                    if (res && res.status === 'success' && res.token) {
                        localStorage.setItem('session_token', res.token);
                        alert('Successfully Logged In');
                        $('#message').html('<span class="text-success">Successfully Logged In</span>');
                        // Redirecting to Sign-In page (login.html) as requested
                        setTimeout(function () { window.location.href = 'login.html'; }, 1000);
                    } else {
                        $('#message').html('<span class="text-danger">' + (res.message || 'Invalid response') + '</span>');
                    }
                } finally {
                    $btn.prop('disabled', false).text('Login');
                }
            },
            error: function (xhr, status) {
                try {
                    // Try to extract JSON error if available
                    var txt = xhr && xhr.responseText ? xhr.responseText : '';
                    var msg = 'An error occurred. Please try again.';
                    if (txt) {
                        try {
                            var j = JSON.parse(txt);
                            if (j && j.message) msg = j.message;
                        } catch (_) { /* not JSON */ }
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
