const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const router = express.Router();
const SECRET_KEY = "supersecretkey";

// ✅ MySQL 연결 설정
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "yoodain" // ✅ 기존 데이터베이스 이름 사용
});

// 🔥 회원가입 API (기존 테이블에 저장)
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 

    const query = "INSERT INTO user (email, password) VALUES (?, ?)"; // ✅ 기존 테이블 이름 사용
    db.query(query, [email, hashedPassword], (err) => {
        if (err) {
            res.status(400).json({ message: "❌ 이미 가입된 이메일입니다." });
        } else {
            res.status(201).json({ message: "✅ 회원가입 성공!" });
        }
    });
});

// 🔐 로그인 API (기존 테이블에서 사용자 조회)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM your_table_name WHERE email = ?"; // ✅ 기존 테이블 이름 사용
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: "❌ 가입되지 않은 이메일입니다." });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.user = email;
            res.status(200).json({ message: "✅ 로그인 성공!", redirect: "/pyramid" });
        } else {
            res.status(401).json({ message: "❌ 비밀번호가 틀렸습니다." });
        }
    });
});

// ✅ 로그인 상태 확인 API
router.get("/session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
