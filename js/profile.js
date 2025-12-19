$(document).ready(function () {
    var token = localStorage.getItem('session_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch Profile
    $.ajax({
        url: 'php/profile.php',
        type: 'POST',
        data: { token: token, action: 'fetch' },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success' && response.data) {
                var d = response.data;
                if (d.name) $('#name').val(d.name); // Using name from profile or session?
                // Profile schema has (email, age, dob, contact). Name is in users table.
                // php/profile.php fetches from user_profiles.
                // If we want name, php needs to join or fetch from users.
                // Current php/profile.php only selects age, dob, contact.

                if (d.age) $('#age').val(d.age);
                if (d.dob) $('#dob').val(d.dob);
                if (d.contact) $('#contact').val(d.contact);
            } else if (response.message === 'Session expired') {
                window.location.href = 'login.html';
            }
        }
    });

    // Update Profile
    $('#profileForm').submit(function (e) {
        e.preventDefault();
        var data = $(this).serializeArray();
        data.push({ name: 'token', value: token });
        data.push({ name: 'action', value: 'update' });

        $.ajax({
            url: 'php/profile.php',
            type: 'POST',
            data: data,
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
                $('#message').html('<span class="text-danger">Update failed.</span>');
            }
        });
    });

    // Logout
    $('#logoutBtn').click(function () {
        // Optional: Call logout.php to clear session in DB
        localStorage.removeItem('session_token');
        window.location.href = 'login.html';
    });
});
