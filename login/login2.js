async function register() {
    const email = document.getElementById("signup-email").value.toLowerCase();
    const password = document.getElementById("signup-password").value;

    const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;
}

async function login() {
    const email = document.getElementById("login-email").value.toLowerCase();
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;

    if (data.redirect) {
        window.location.href = data.redirect; // ✅ 로그인 성공 후 피라미드 페이지로 이동
    }
}

// ✅ 로그인 상태 유지: 페이지 로드 시 자동 체크
document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/auth/session")
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                window.location.href = "/pyramid"; // ✅ 로그인 상태 유지 시 자동 이동
            }
        });
});

function showPage(pageId) {
    document.getElementById("home").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById(pageId).style.display = "block";
}
