$(document).ready(function () {
    var token = localStorage.getItem('session_token');
    if (!token) { window.location.href = 'login.html'; return; }

    var demo = window.APP_CONFIG && window.APP_CONFIG.demoMode === true;

    if (demo) {
        try {
            var saved = JSON.parse(localStorage.getItem('profile_data') || '{}');
            if (saved.age !== undefined) $('#age').val(saved.age);
            if (saved.dob !== undefined) $('#dob').val(saved.dob);
            if (saved.contact !== undefined) $('#contact').val(saved.contact);
        } catch (e) {}

        $('#profileForm').submit(function (e) {
            e.preventDefault();
            var data = { age: $('#age').val(), dob: $('#dob').val(), contact: $('#contact').val() };
            localStorage.setItem('profile_data', JSON.stringify(data));
            alert('Profile updated successfully!');
            $('#message').html('<span class="text-success">Profile updated successfully!</span>');
        });

        $('#logoutBtn').click(function () {
            localStorage.removeItem('session_token');
            localStorage.removeItem('profile_data');
            window.location.href = 'login.html';
        });
        return;
    }

    // Real backend mode
    $.ajax({
        type: 'POST',
        url: 'assets/php/profile.php',
        data: { token: token, action: 'fetch' },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success' && response.data) {
                var d = response.data;
                $('#age').val(d.age || '');
                $('#dob').val(d.dob || '');
                $('#contact').val(d.contact || '');
            } else if (response.status !== 'success') {
                localStorage.removeItem('session_token');
                window.location.href = 'login.html';
            }
        }
    });

    $('#profileForm').submit(function (e) {
        e.preventDefault();
        var formData = { token: token, action: 'update', age: $('#age').val(), dob: $('#dob').val(), contact: $('#contact').val() };
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

    $('#logoutBtn').click(function () {
        $.ajax({
            type: 'POST',
            url: 'assets/php/logout.php',
            data: { token: token },
            complete: function () {
                localStorage.removeItem('session_token');
                window.location.href = 'login.html';
            }
        });
    });
});
