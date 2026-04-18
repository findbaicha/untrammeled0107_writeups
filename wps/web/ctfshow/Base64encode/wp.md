题目界面
"/../../0.png"
可以看到是一个登录界面
来看看源代码
有个javascript显示了他的密码检测逻辑
<script>
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
    
        const correctPassword = "Q1RGe2Vhc3lfYmFzZTY0fQ==";
        const enteredPassword = document.getElementById('password').value;
        const messageElement = document.getElementById('message');
        
        if (btoa(enteredPassword) === correctPassword) {
            messageElement.textContent = "Login successful! Flag: "+enteredPassword;
            messageElement.className = "message success";
        } else {
            messageElement.textContent = "Login failed! Incorrect password.";
            messageElement.className = "message error";
        }
    });
</script>
可以发现是base64
那就cyberchef解码一下
"/../../1.png"
得到密码
CTF{easy_base64}
贴到题目登录页

得到回显
Login successful! Flag: CTF{easy_base64}
"/../../2.png"
看到flag
CTF{easy_base64}