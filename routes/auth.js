const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const pool = require('../db');

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nickname: Joi.string().min(2).max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});




// 회원가입 
router.post('/signup', async (req, res) => {
  //입력값 검사 먼저 
  const { error, value } = signupSchema.validate(req.body);
  if (error) return res.status(400).send(error.message);
  // 공백 제거
  const email = value.email.trim();
  const password = value.password.trim();
  const nickname = value.nickname.trim();
  // 해시 (암호화)
  const hash = await bcrypt.hash(password, 12);
  //pool 은 db 에 구현해둠 
  const conn = await pool.getConnection();
  try {
    await conn.execute(
      'INSERT INTO users (email, password_hash, nickname) VALUES (:email, :hash, :nickname)',
      { email, hash, nickname }
    );
    return res.redirect('/login'); // 통일
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).send('이미 가입된 이메일입니다.');
    return res.status(500).send('서버 오류');
  } finally {
    conn.release();
  }
});





// 로그인 구현 
router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).send('이메일/비밀번호 형식을 확인하세요.');

  const email = value.email.trim();
  const password = value.password.trim();

  try {
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, nickname FROM users WHERE email=:email',
      { email }
    );
    if (rows.length === 0) return res.status(401).send('이메일 또는 비밀번호가 틀렸습니다.');

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).send('이메일 또는 비밀번호가 틀렸습니다.');

    // 세션에 저장 해주기 (로그인 상태 유지)
    req.session.regenerate((err) => {
      if (err) return res.status(500).send('세션 오류');
      req.session.user = { id: user.id, email: user.email, nickname: user.nickname };
      return res.redirect('/studies');
    });

  } catch (e) {
    console.error(e);
    return res.status(500).send('서버 오류');
  }
});


// 로그아웃 : 세션 디스트로이 해주면 처리됨 이후 로그인 페이지로 이동
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
