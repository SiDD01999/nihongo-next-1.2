const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
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
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    const where = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        author: true,
        date: true,
        readTime: true,
        tags: true,
        featured: true,
        image: true,
        _count: {
          select: { comments: true },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      commentCount: post._count.comments,
      _count: undefined,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:slug — single post with comments
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        comments: {
          select: {
            id: true,
            name: true,
            text: true,
            time: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts/:slug/comments — add a comment (auth optional)
router.post('/:slug/comments', optionalAuth, async (req, res) => {
  try {
    const { text, name: bodyName } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required.' });
    }

    // Find post by slug
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        name: req.user ? req.user.name : (bodyName || 'Anonymous'),
        text: text.trim(),
        time: new Date().toISOString(),
        postId: post.id,
        userId: req.user ? req.user.id : null,
      },
    });

    res.status(201).json({
      id: comment.id,
      name: comment.name,
      text: comment.text,
      time: comment.time,
      likes: comment.likes,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// POST /api/posts/:slug/comments/:commentId/like — like a comment
router.post('/:slug/comments/:commentId/like', async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);

    // Find and update comment
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    res.json({ likes: comment.likes });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

module.exports = router;
