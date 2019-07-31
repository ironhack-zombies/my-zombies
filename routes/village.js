const express = require('express');
var secured = require('../lib/middleware/secured');
const router = express.Router();
const Story = require('../models/story')
const Comment = require('../models/comment')
const OwnedZombie = require('../models/ownedZombie')
const User = require('../models/user')
const brainsPerFight = 2;

router.get('/village', secured(), (req, res, next) => {
    res.render("village/village")
});

router.post('/village', secured(), function (req, res, next) {
    let newStory = {
        author: req.user._id,
        title: req.body.title,
        text: req.body.text.split("\n")
    }
    let story = new Story(newStory)
    story.save(
            Story.populate(newStory, 'author'))
        .then(story => {
            res.redirect(`/story/${story._id}`)
        })
        .catch(error => {
            console.error(error)
            next(error)
        })
});

router.get('/village/storyBoard', secured(), (req, res, next) => {
    Story.find({}, null, {
            sort: {
                writtenAt: -1
            }
        })
        .populate("author")
        .then(stories => {
            let now = new Date();
            for (let story of stories) {
                if (story.text[0].length > 100) {
                    story.short = []
                    story.short[0] = story.text[0].substring(0, 100) + "..."
                } else if (story.text.length > 1) {
                    story.short = []
                    story.short[0] = story.text[0]
                    story.short[1] = "..."
                }
                story.niceTime = formatWrittenAt(story.writtenAt, now);
            }
            res.render("village/storyBoard", {
                stories: stories,
                message: req.flash('message')
            })
        }).catch(error => {
            console.error(error)
            next(error)
        })
});

router.get('/village/arena', secured(), (req, res, next) => {
    OwnedZombie.find({
        _id: {
            '$in': req.user.zombiesOwned
        }
    }).then(zombies => {
        res.render("village/arena", {zombies: zombies, message: req.flash("message")})
    }).catch(error => {
        console.error(error);
        next(new Error(error.message))
    })
});

router.post('/village/arena/fight', secured(), (req, res, next) => {
    OwnedZombie.findById({
        _id: req.body.zombie
    }).then(zombie => {
        if(req.user.brains < brainsPerFight) {
            req.flash("message", `Not enough brains! (${brainsPerFight})`);
            res.redirect("/village/arena");
            return;
        }
        if(zombie.owner.toString() !== req.user._id.toString()) {
            req.flash("message", "Not your zombie!");
            res.redirect("/village/arena");
            return;
        }
        let fight = {
            won: Math.random() > 0.5,
            rewards: {
                brains: Math.floor(2 + Math.random() * 9)
            }
        }
        res.locals.user.brains = req.user.brains - brainsPerFight
        res.render("village/arenaFight", {zombie: zombie, fight: fight})
        if(fight.won) {
            let brains = fight.rewards.brains - brainsPerFight
            return User.findByIdAndUpdate({_id: zombie.owner}, {$inc: { fightsWon: 1}, $inc: {brains: brains} })
        } else {
            return User.findByIdAndUpdate({_id: zombie.owner}, {$inc: {brains: -brainsPerFight} })
        }
    }).catch(error => {
        console.error(error);
        next(new Error(error.message))
    })
});

router.get('/story/:id', secured(), function (req, res, next) {
    Story.findById(req.params.id)
        .populate("author")
        .then(story => {
            if (!story) {
                req.flash("message", "Story not found!")
                res.redirect("/village/storyBoard")
                return;
            } else {
                story.niceTime = formatWrittenAt(story.writtenAt, new Date())
                Comment.find({
                        story: req.params.id
                    }, null, {
                        sort: {
                            writtenAt: -1
                        }
                    })
                    .populate("author")
                    .then(comments => {
                        let now = new Date();
                        for (let comment of comments) {
                            comment.niceTime = formatWrittenAt(comment.writtenAt, now);
                        }
                        res.render("story", {
                            story: story,
                            comments: comments
                        })
                    })
            }
        }).catch(error => {
            console.error(error)
            req.flash("message", error.message)
            res.redirect("/village/storyBoard")
        })
});

router.post('/story/:id/like', secured(), function (req, res, next) {
    Story.findById(req.params.id).then(story => {
        if (!story) {
            res.status(500).send(`{liked: false, message: 'Story not found'}`)
            return;
        }
        let userID = req.user._id;
        if (story.likes.indexOf(userID) > -1) {
            res.status(500).send(`{liked: false, message: 'User not found'}`)
            return;
        }
        story.updateOne({
                $addToSet: {
                    likes: userID
                }
            })
            .then(res.status(200).send(`{liked: true}`))
    }).catch(error => {
        res.status(500).send(`{liked: false}`)
    })
});

router.post('/story/:id/comment', secured(), function (req, res, next) {
    Story.findById(req.params.id).then(story => {
        if (!story) {
            req.flash("message", 'story not found')
            res.redirect(`/story/${req.params.id}`)
            return;
        }
        let newComment = {
            author: req.user._id,
            story: story._id,
            text: req.body.text.split("\n")
        }
        let comment = new Comment(newComment)
        comment.save().then(() => {
            res.redirect(`/story/${req.params.id}`)
        })
    }).catch(error => {
        console.log("Error while posting new comment...")
        console.error(error)
        req.flash("message", 'Server error')
        res.redirect(`/story/${req.params.id}`)
    })
});

function formatWrittenAt(writtenAt, now) {
    if (writtenAt.getDate() === now.getDate() &&
        writtenAt.getMonth() === now.getMonth() &&
        writtenAt.getFullYear() === now.getFullYear()) {
        return "today " + (writtenAt.getHours() < 10 ? "0" + writtenAt.getHours().toString() : writtenAt.getHours().toString()) + ":" +
            (writtenAt.getMinutes() < 10 ? "0" + writtenAt.getMinutes().toString() : writtenAt.getMinutes().toString()) + ":" +
            (writtenAt.getSeconds() < 10 ? "0" + writtenAt.getSeconds().toString() : writtenAt.getSeconds().toString());
    } else if (writtenAt.getMonth() === now.getMonth() &&
        writtenAt.getFullYear() === now.getFullYear() &&
        writtenAt.getDate() === now.getDate() - 1) {
        return "yesterday " + (writtenAt.getHours() < 10 ? "0" + writtenAt.getHours().toString() : writtenAt.getHours().toString()) + ":" +
            (writtenAt.getMinutes() < 10 ? "0" + writtenAt.getMinutes().toString() : writtenAt.getMinutes().toString()) + ":" +
            (writtenAt.getSeconds() < 10 ? "0" + writtenAt.getSeconds().toString() : writtenAt.getSeconds().toString());
    } else if (writtenAt.getFullYear() === now.getFullYear()) {
        return (writtenAt.getDate() < 10 ? "0" + writtenAt.getDate().toString() : writtenAt.getDate().toString()) + "." +
            (writtenAt.getMonth() < 10 ? "0" + writtenAt.getMonth().toString() : writtenAt.getMonth().toString()) +
            ". " + (writtenAt.getHours() < 10 ? "0" + writtenAt.getHours().toString() : writtenAt.getHours().toString()) + ":" +
            (writtenAt.getMinutes() < 10 ? "0" + writtenAt.getMinutes().toString() : writtenAt.getMinutes().toString()) + ":" +
            (writtenAt.getSeconds() < 10 ? "0" + writtenAt.getSeconds().toString() : writtenAt.getSeconds().toString());
    } else {
        return (writtenAt.getDate() < 10 ? "0" + writtenAt.getDate().toString() : writtenAt.getDate()) + "." +
            (writtenAt.getMonth() < 10 ? "0" + writtenAt.getMonth().toString() : writtenAt.getMonth()) + "." +
            writtenAt.getFullYear().toString() +
            " " + (writtenAt.getHours() < 10 ? "0" + writtenAt.getHours().toString() : writtenAt.getHours()) + ":" +
            (writtenAt.getMinutes() < 10 ? "0" + writtenAt.getMinutes().toString() : writtenAt.getMinutes()) + ":" +
            (writtenAt.getSeconds() < 10 ? "0" + writtenAt.getSeconds().toString() : writtenAt.getSeconds());
    }
}

module.exports = router;