const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
const POSTS_FILE = path.join(__dirname, '../data/posts.json');
const JWT_SECRET = process.env.JWT_SECRET || 'nihongo-next-secret-key-2024';

function readPosts() {
  return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    } catch {
      // ignore invalid token
    }
  }
  next();
}

// GET /api/posts — list all posts (supports ?category=grammar&search=particles)
router.get('/', (req, res) => {
  let posts = readPosts();
  const { category, search } = req.query;
  if (category && category !== 'all') {
    posts = posts.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
  }
  // Don't expose comments in listing
  res.json(posts.map(({ comments, ...p }) => ({ ...p, commentCount: comments.length })));
});

// GET /api/posts/:slug — single post with comments
router.get('/:slug', (req, res) => {
  const posts = readPosts();
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.json(post);
});

// POST /api/posts/:slug/comments — add a comment (auth optional; uses name from token or body)
router.post('/:slug/comments', optionalAuth, (req, res) => {
  const { text, name: bodyName } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Comment text is required.' });
  }

  const posts = readPosts();
  const idx = posts.findIndex((p) => p.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: 'Post not found.' });

  const comment = {
    id: Date.now(),
    name: req.user ? req.user.name : (bodyName || 'Anonymous'),
    text: text.trim(),
    time: new Date().toISOString(),
    likes: 0,
  };
  posts[idx].comments.push(comment);
  writePosts(posts);

  res.status(201).json(comment);
});

// POST /api/posts/:slug/comments/:commentId/like — like a comment
router.post('/:slug/comments/:commentId/like', (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: 'Post not found.' });

  const comment = posts[idx].comments.find((c) => c.id === Number(req.params.commentId));
  if (!comment) return res.status(404).json({ error: 'Comment not found.' });

  comment.likes = (comment.likes || 0) + 1;
  writePosts(posts);
  res.json({ likes: comment.likes });
});

module.exports = router;
