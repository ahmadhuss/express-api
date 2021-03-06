import express from 'express';
import {
  findAllPosts,
  findById,
  createPost,
  updatePost,
  removePost
} from '../models/post';

const router = express.Router();

// GET Methods
router.get('/posts', (req, res) => {
  findAllPosts((posts) => {
    res.json({
      response: posts
    });
  });
});

router.get('/post/:id', (req, res) => {
  const {
    params: { id }
  } = req;
  findById(id, (singlePost) => {
    console.log('single', singlePost);
    if (!singlePost || singlePost.length === 0) {
      res.send({
        error: true,
        message: 'Post not found'
      });
    } else {
      res.json({
        response: [singlePost]
      });
    }
  });
});

// POST Methods
router.post('/post', (req, res) => {
  const { text, rating } = req.body;
  createPost(text, rating, (data, error = false) => {
    if (error) {
      res.json({
        error: true,
        details: error
      });
    } else {
      res.json({
        response: {
          saved: true,
          post: data
        }
      });
    }
  });
});

// PUT Methods
router.put('/post/:id', (req, res) => {
  const {
    params: { id },
    body: { text, rating }
  } = req;

  updatePost(id, text, rating, (affected, error) => {
    if (error) {
      res.json({
        error: true,
        details: error ? error : 'There was an error trying to update the post'
      });
    } else {
      res.json({
        response: {
          updated: true,
          affected
        }
      });
    }
  });
});

// DELETE Methods
router.delete('/post/:id', (req, res) => {
  const {
    params: { id }
  } = req;
  removePost(id, (removed, error) => {
    if (error) {
      res.json({
        error: true,
        details: error ? error : 'There was an error trying to remove this post'
      });
    } else {
      res.json({
        response: {
          removed: true
        }
      });
    }
  });
});

// All other routes
router.get('*', function (req, res) {
  res.status(404).send({ error: true, message: `It doesn't exist.` });
});

export default router;
