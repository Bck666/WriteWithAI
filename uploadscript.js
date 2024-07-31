var exampletext = "";
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            exampletext = content
            console.log(exampletext,1)
            document.getElementById('fileContent').textContent = content;
            fileIcon.src = 'alreadyupload.png'; // 上传后的图标
        };
        reader.readAsText(file);
        var Container = document.getElementById("uploadconter");
        var btn = document.createElement("button");
        btn.onclick = function() {
            window.location.replace('style.html');
        };
        btn.className = "button"
        btn.innerHTML = "Next"
        var newDiv = document.createElement("div");
        newDiv.appendChild(btn);

        // 将这个新的div添加到按钮容器中
        Container.appendChild(newDiv);
    } else {
        alert('Please select a txt file');
    }
});