// routes/studies.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // db.js 사용

// 로그인 체크
function requireLogin(req, res, next) {
  if (!req.session?.user) {
    return res.redirect('/login');
  }
  next();
}

// 🔹 새 스터디 작성 폼
router.get('/new', requireLogin, (req, res) => {
  res.render('study-form', { pageTitle: '새 스터디 만들기' });
});

// 🔹 스터디 생성
router.post('/create', requireLogin, async (req, res) => {
  try {
    const {
      title,
      description,
      maxMembers,
      day,
      bookTitle,
      bookIsbn,
      bookCoverUrl,
      bookAuthor
    } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).send('제목을 2글자 이상 입력하세요.');
    }

    const [result] = await pool.query(
      `INSERT INTO studies
       (title, description, max_members, day, book_isbn, book_title,
        book_cover_url, book_author, creator_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title.trim(),
        description || '',
        maxMembers || 10,
        day || '',
        bookIsbn || null,
        bookTitle || null,
        bookCoverUrl || null,
        bookAuthor || null,
        req.session.user.id
      ]
    );

    const newStudyId = result.insertId;
    return res.redirect('/studies/' + newStudyId);
  } catch (err) {
    console.error('POST /studies/create error:', err);
    return res.status(500).send('서버 에러');
  }
});

// 🔹 스터디 목록
router.get('/', async (req, res) => {
  try {
    const keyword = (req.query.keyword || '').trim();
    const day = (req.query.day || '').trim();

    let sql = `
      SELECT
        s.id,
        s.title,
        s.description,
        s.max_members AS maxMembers,
        s.day,
        s.book_isbn AS bookIsbn,
        s.book_title AS bookTitle,
        s.book_cover_url AS bookCoverUrl,
        s.book_author AS bookAuthor,
        s.created_at AS createdAt,
        u.nickname AS creatorName
      FROM studies s
      LEFT JOIN users u ON u.id = s.creator_id
    `;
    const conds = [];
    const params = [];

    if (keyword) {
      conds.push(`(s.title LIKE ? OR s.description LIKE ? OR s.book_title LIKE ?)`);
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (day) {
      conds.push(`s.day = ?`);
      params.push(day);
    }

    if (conds.length > 0) {
      sql += ' WHERE ' + conds.join(' AND ');
    }

    sql += ' ORDER BY s.created_at DESC';

    const [rows] = await pool.query(sql, params);

    res.render('studies', {
      pageTitle: '스터디 찾기',
      studies: rows,
      keyword,
      day
    });
  } catch (err) {
    console.error('GET /studies error:', err);
    res.status(500).send('서버 에러');
  }
});

// 🔹 스터디 수정 폼
router.get('/:id/edit', requireLogin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.session.user.id;

    const [[study]] = await pool.query(`
      SELECT
        s.id,
        s.title,
        s.description,
        s.max_members AS maxMembers,
        s.day,
        s.book_isbn AS bookIsbn,
        s.book_title AS bookTitle,
        s.book_cover_url AS bookCoverUrl,
        s.book_author AS bookAuthor,
        s.created_at AS createdAt,
        s.creator_id AS creatorId,
        u.nickname AS creatorName
      FROM studies s
      LEFT JOIN users u ON u.id = s.creator_id
      WHERE s.id = ?
    `, [id]);

    if (!study) return res.status(404).send('존재하지 않는 스터디입니다.');
    if (study.creatorId !== userId) {
      return res.status(403).send('수정 권한이 없습니다.');
    }

    // study-form.ejs 에 isEditing 모드로 전달
    res.render('study-form', {
      pageTitle: '스터디 수정',
      study
    });
  } catch (err) {
    console.error('GET /studies/:id/edit error:', err);
    res.status(500).send('서버 에러');
  }
});
// 🔹 스터디 수정 처리
router.post('/:id/update', requireLogin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.session.user.id;

    const [[study]] = await pool.query(
      'SELECT * FROM studies WHERE id = ?',
      [id]
    );
    if (!study) return res.status(404).send('존재하지 않는 스터디입니다.');
    if (study.creator_id !== userId) {
      return res.status(403).send('수정 권한이 없습니다.');
    }

    const {
      title,
      description,
      maxMembers,
      day,
      bookTitle,
      bookIsbn,
      bookCoverUrl,
      bookAuthor
    } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).send('제목을 2글자 이상 입력하세요.');
    }

    await pool.query(
      `UPDATE studies
       SET title = ?,
           description = ?,
           max_members = ?,
           day = ?,
           book_isbn = ?,
           book_title = ?,
           book_cover_url = ?,
           book_author = ?
       WHERE id = ?`,
      [
        title.trim(),
        description || '',
        maxMembers || 10,
        day || '',
        bookIsbn || null,
        bookTitle || null,
        bookCoverUrl || null,
        bookAuthor || null,
        id
      ]
    );

    return res.redirect('/studies/' + id);
  } catch (err) {
    console.error('POST /studies/:id/update error:', err);
    res.status(500).send('서버 에러');
  }
});

// 🔹 스터디 삭제 (GET/POST 모두 허용)
async function deleteStudyHandler(req, res) {
  try {
    const id = Number(req.params.id);
    const userId = req.session.user.id;

    const [[study]] = await pool.query(
      'SELECT * FROM studies WHERE id = ?',
      [id]
    );

    if (!study) {
      return res.status(404).send('존재하지 않는 스터디입니다.');
    }

    if (study.creator_id !== userId) {
      return res.status(403).send('삭제 권한이 없습니다.');
    }

    await pool.query('DELETE FROM studies WHERE id = ?', [id]);

    return res.redirect('/mypage');
  } catch (err) {
    console.error('DELETE /studies/:id/delete error:', err);
    return res.status(500).send('서버 에러');
  }
}

// /studies/:id/delete 로 오는 GET/POST 전부 여기로
router.all('/:id/delete', requireLogin, deleteStudyHandler);

// 🔹 스터디 상세
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [[study]] = await pool.query(`
      SELECT
        s.id,
        s.title,
        s.description,
        s.max_members AS maxMembers,
        s.day,
        s.book_isbn AS bookIsbn,
        s.book_title AS bookTitle,
        s.book_cover_url AS bookCoverUrl,
        s.book_author AS bookAuthor,
        s.created_at AS createdAt,
        s.creator_id AS creatorId, 
        u.nickname AS creatorName
      FROM studies s
      LEFT JOIN users u ON u.id = s.creator_id
      WHERE s.id = ?
    `, [id]);

    if (!study) return res.status(404).send('존재하지 않는 스터디입니다.');

    res.render('studies-detail', {
      pageTitle: '스터디 상세',
      study
    });
  } catch (err) {
    console.error('GET /studies/:id error:', err);
    res.status(500).send('서버 에러');
  }
});

module.exports = router;
