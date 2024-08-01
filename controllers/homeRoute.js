const router = require('express').Router();
const withAuth = require('../utilities/auth');
const { formatDate } = require('../utilities/date.js');
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        const posts = postData.map((post) => {
            let plainPost = post.get({ plain: true });
            plainPost.formattedDate = formatDate(plainPost.creationDate);
            return plainPost;
        });

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
            pageTitle: 'CodeChronicles',
        });
    } catch (err) {
        console.error('homepage route error', err);
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['username'] }],
        });
        if (!postData) {
            res.status(404).json({ message: 'No Post found, incorrect ID' });
            return;
        }
        const post = postData.get({ plain: true });
        post.formattedDate = formatDate(post.created_on);

        res.render('posts', {
            ...post,
            loggedIn: req.session.loggedIn,
            pageTitle: 'Single Post',
        });
    } catch (error) {
        console.error('post route error', error);
        res.status(500).json(error);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.userId, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Post,
                where: {
                    userId: req.session.userId,
                },
                required: false,
            }],
        });
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }

        const user = userData.get({ plain: true });
        user.posts = user.posts.map((post) => {
            post.formattedDate = formatDate(post.created_on);
            return post;
        });

        res.render('dashboard', {
            ...user,
            loggedIn: true,
            pageTitle: 'Dashboard',
        });
    } catch (err) {
        console.error('dashboard route error', err);
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login', {
        pageTitle: 'Login',
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        pageTitle: 'register',
    });
});

router.get('/newPost', withAuth, (req, res) => {
    res.render('newPost', {
        loggedIn: req.session.loggedIn,
        pageTitle: 'Create New Post',
    });
});

router.get('/editPost/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['username'] }],
        });
        if (!postData) {
            res.status(404).json({ message: 'No Post found, incorrect ID' });
            return;
        }
        const post = postData.get({ plain: true });
        post.formattedDate = formatDate(post.created_on);

        res.render('editPost', {
            ...post,
            loggedIn: req.session.loggedIn,
            pageTitle: 'Edit Post',
        });
    } catch (error) {
        console.error('edit post route error', error);
        res.status(500).json(error);
    }
});

router.get('/commentPost/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['username'] },
                { model: Comment, include: [{ model: User, attributes: ['username'] }] },
            ],
        });
        if (!postData) {
            res.status(404).json({ message: 'No Post found, incorrect ID' });
            return;
        }
    } catch (error) {
        console.error('comment route error', error);
        res.status(500).json(error);
    }
});

module.exports = router;