$(document).ready(function () {
    // 文件选择后立即检查大小
    $('.custom-file-input').on('change', function() {
        var fileName = $(this).val().split('\\').pop();
        $(this).next('.custom-file-label').addClass("selected").html(fileName);
        var file = this.files[0];
        if(file && file.size > 26214400) { // 25MB in bytes
            alert("File size should not exceed 25MB");
            this.value = ""; // 清除选中的文件
            $(this).next('.custom-file-label').removeClass("selected").html("Choose image");
        }
    });

    // 上传按钮点击事件
    $('#uploadButton').click(function () {
        var fileInput = document.getElementById('imageInput');
        var file = fileInput.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }
        if (file.size > 26214400) { // 再次检查文件大小
            alert("File size exceeds 25MB. Please select a smaller file.");
            return;
        }

        var formData = new FormData();
        formData.append('image', file);

        // 发起上传请求
        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(json => {
                throw new Error(json.error || 'Network response was not ok.');
            });
        })
        .then(data => {
            $('#imagePreview').attr('src', data.url).removeAttr('hidden');
            $('#imageUrl').val(data.url).parent().removeAttr('hidden');
            $('#copyUrlButton').click(function() {
                navigator.clipboard.writeText(data.url).then(() => {
                    alert('Image URL copied to clipboard!');
                });
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert(error.message); // 显示从服务器返回的错误信息
        });
    });
});