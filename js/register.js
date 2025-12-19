$(document).ready(function () {
    $('#registerForm').submit(function (e) {
        e.preventDefault();

        // Basic client-side validation could be added here

        $.ajax({
            url: 'php/register.php',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    alert(response.message);
                    $('#message').html('<span class="text-success">' + response.message + '</span>');
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    $('#message').html('<span class="text-danger">' + response.message + '</span>');
                }
            },
            error: function () {
                $('#message').html('<span class="text-danger">Registration failed. properties.</span>');
            }
        });
    });
});
