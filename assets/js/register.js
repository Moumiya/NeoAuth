$(document).ready(function () {
    $('#registerForm').submit(function (e) {
        e.preventDefault();

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
                    setTimeout(function () {
                        window.location.href = 'profile.html';
                    }, 1500);
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
