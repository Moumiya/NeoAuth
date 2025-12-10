$(document).ready(function () {
    // Check for Auth Token
    var token = localStorage.getItem('session_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch Profile Data
    $.ajax({
        type: 'POST',
        url: 'assets/php/profile.php',
        data: { token: token, action: 'fetch' },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var data = response.data;
                if (data) {
                    $('#age').val(data.age);
                    $('#dob').val(data.dob);
                    $('#contact').val(data.contact);
                }
            } else {
                // If token invalid, redirect
                localStorage.removeItem('session_token');
                window.location.href = 'login.html';
            }
        },
        error: function () {
            // Helper for offline dev or errors
            console.log('Error fetching profile');
        }
    });

    // Update Profile
    $('#profileForm').submit(function (e) {
        e.preventDefault();

        var formData = {
            token: token,
            action: 'update',
            age: $('#age').val(),
            dob: $('#dob').val(),
            contact: $('#contact').val()
        };

        $.ajax({
            type: 'POST',
            url: 'assets/php/profile.php',
            data: formData,
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    alert('Profile updated successfully!');
                    $('#message').html('<span class="text-success">Profile updated successfully!</span>');
                } else {
                    $('#message').html('<span class="text-danger">' + response.message + '</span>');
                }
            },
            error: function () {
                $('#message').html('<span class="text-danger">An error occurred.</span>');
            }
        });
    });

    // Logout
    $('#logoutBtn').click(function () {
        // Optional: Call server to delete token from Redis
        $.ajax({
            type: 'POST',
            url: 'assets/php/logout.php',
            data: { token: token },
            success: function () {
                localStorage.removeItem('session_token');
                window.location.href = 'login.html';
            }
        });
    });
});
