const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');

router.post('/' , async (req , res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:id' , async (req , res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({ $set: req.body });
            res.status(200).json('the post has been updated');
        } else{
            res.status(403).json("you can update only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:id' , async (req , res) => {
    try {
        const post = Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json('the post has been deleted');
        } else{
            res.status(403).json("you can only delete your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:id/like' , async (req , res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json('the post has been liked');
        } else{
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json('the post has been disliked');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:id' , async (req , res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/timeline/all' , async (req , res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPost = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        res.json(userPost.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;