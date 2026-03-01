const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { requireAdmin } = require('../middleware/auth');

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

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function estimateReadTime(content) {
  if (!content) return '1 min read';
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// GET /api/posts — list all posts
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
      orderBy: { createdAt: 'desc' },
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
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            name: true,
            text: true,
            time: true,
            likes: true,
            userId: true,
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

// POST /api/posts — create a new post (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, featured, image } = req.body;

    if (!title || !excerpt || !category) {
      return res.status(400).json({ error: 'Title, excerpt, and category are required.' });
    }

    let slug = generateSlug(title);
    // Ensure slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        excerpt,
        content: content || '',
        category,
        author: req.user.name,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        readTime: estimateReadTime(content),
        tags: tags || [],
        featured: featured || false,
        image: image || null,
        authorId: req.user.id,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:slug — update a post (admin only)
router.put('/:slug', requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, featured, image } = req.body;

    const existing = await prisma.post.findUnique({ where: { slug: req.params.slug } });
    if (!existing) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) {
      updateData.content = content;
      updateData.readTime = estimateReadTime(content);
    }
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (featured !== undefined) updateData.featured = featured;
    if (image !== undefined) updateData.image = image;

    const post = await prisma.post.update({
      where: { slug: req.params.slug },
      data: updateData,
    });

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:slug — delete a post (admin only)
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.post.findUnique({ where: { slug: req.params.slug } });
    if (!existing) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    await prisma.post.delete({ where: { slug: req.params.slug } });
    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/posts/:slug/comments — add a comment (login required)
router.post('/:slug/comments', optionalAuth, async (req, res) => {
  try {
    const { text, name: bodyName } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required.' });
    }

    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

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
      userId: comment.userId,
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
