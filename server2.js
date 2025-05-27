const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ✅ MySQL 연결 설정
const db = mysql.createConnection({
    host: "localhost",
    user: "root",   // ⚠️ MySQL 사용자명 (필요에 따라 변경)
    password: "1027", // ⚠️ MySQL 비밀번호 입력
    database: "yoodain"
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL 연결 실패:", err);
    } else {
        console.log("✅ MySQL 연결 성공!");
    }
});

// ✅ 세션 설정 추가
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 600000 } // 🔥 10분 동안 로그인 유지
}));

app.use("/auth", authRoutes);

// ✅ 피라미드 프로그램 페이지 (로그인한 사용자만 접근 가능)
app.get("/pyramid", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/"); // ✅ 로그인하지 않았으면 홈으로 이동
    }
    res.sendFile(path.join(__dirname, "public", "pyramid.html"));
});

app.listen(3000, () => console.log("🚀 서버 실행 중..."));
