const express = require('express');
const path = require('path');
require('dotenv').config(); // .env 파일 읽어서 process.env 환경변수 주입

const app = express();
const PORT = process.env.PORT || 3000;

// --- 세션 & MySQL 설정 ---
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'study_user',
  password: process.env.DB_PASS || 'study_pass',
  database: process.env.DB_NAME || 'studydb',
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000
});

// --- 기본 미들웨어 ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 세션 미들웨어 ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// --- 모든 EJS에서 user 접근 가능하게 ---
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

// --- EJS 설정 ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 정적 파일 설정 ---
app.use(express.static(path.join(__dirname, 'public')));

// --- 로그인 체크 미들웨어 ---
function requireLogin(req, res, next) {
  if (!req.session?.user) {
    return res.redirect('/login');
  }
  next();
}

// --- DB & 라우터 등록 ---
const pool = require('./db');
const studiesRouter = require('./routes/studies');

app.use('/auth', require('./routes/auth'));
app.use('/studies', studiesRouter);   // ✅ 스터디 라우터만 사용

// --- 페이지 라우트 ---
app.get('/',        (req, res) => res.render('index'));
app.get('/login',   (req, res) => res.render('login'));
app.get('/summary', (req, res) => res.render('summary'));

// 마이페이지: 내가 만든 스터디만 표시
app.get('/mypage', requireLogin, async (req, res) => {
  const userId = req.session.user.id;

  try {
    const [myStudies] = await pool.query(`
      SELECT 
        id,
        title,
        description,
        max_members AS maxMembers,
        day,
        created_at AS createdAt
      FROM studies
      WHERE creator_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    res.render('mypage', {
      pageTitle: '마이페이지',
      myStudies       
    });
  } catch (err) {
    console.error('GET /mypage error:', err);
    res.status(500).send('서버 에러');
  }
});

// ====== 알라딘 기반 책 검색 API ======
app.get('/search-books', async (req, res) => {
  const keyword = (req.query.keyword || '').trim();
  if (!keyword) return res.json({ books: [] });

  const ALADIN_KEY = 'ttbjck03691635001';
  const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ALADIN_KEY}&Query=${encodeURIComponent(keyword)}&QueryType=Title&MaxResults=10&Start=1&SearchTarget=Book&Output=JS&Version=20131101`;

  try {
    const fetchFn = global.fetch ? global.fetch : (await import('node-fetch')).default;
    const apiRes = await fetchFn(url);
    const text = await apiRes.text();

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    let json = {};
    if (start !== -1 && end !== -1) {
      const jsonStr = text.slice(start, end + 1);
      json = JSON.parse(jsonStr);
    } else {
      json = JSON.parse(text);
    }

    const items = json.item || json.items || [];
    const rawList = Array.isArray(items) ? items : [items];

    const books = rawList.map(it => ({
      title: it.title || it.itemTitle || '',
      author: it.author || it.authorInfo || '',
      cover: it.cover || it.coverLarge || it.coverSmall || '',
      isbn: it.isbn || ''
    }));

    res.json({ books });
  } catch (err) {
    console.error('search-books error', err);
    res.status(500).json({ books: [] });
  }
});

// --- 404 핸들러 ---
app.use((req, res) => res.status(404).send('Not Found'));

// --- 서버 실행 ---
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
