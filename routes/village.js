const express = require('express');
var secured = require('../lib/middleware/secured');
const router = express.Router();
const Story = require('../models/story')

router.get('/village', (req, res, next) => {
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

router.get('/village/storyBoard', (req, res, next) => {
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
                if (story.writtenAt.getDate() === now.getDate() &&
                    story.writtenAt.getMonth() === now.getMonth() &&
                    story.writtenAt.getFullYear() === now.getFullYear()) {
                    story.niceTime = "today " + (story.writtenAt.getHours() < 10 ? "0" + story.writtenAt.getHours().toString() : story.writtenAt.getHours().toString()) + ":" +
                        (story.writtenAt.getMinutes() < 10 ? "0" + story.writtenAt.getMinutes().toString() : story.writtenAt.getMinutes().toString()) + ":" +
                        (story.writtenAt.getSeconds() < 10 ? "0" + story.writtenAt.getSeconds().toString() : story.writtenAt.getSeconds().toString());
                } else if (story.writtenAt.getMonth() === now.getMonth() &&
                story.writtenAt.getFullYear() === now.getFullYear() &&
                story.writtenAt.getDate() === now.getDate() - 1) {
                    story.niceTime = "yesterday " + (story.writtenAt.getHours() < 10 ? "0" + story.writtenAt.getHours().toString() : story.writtenAt.getHours().toString()) + ":" +
                        (story.writtenAt.getMinutes() < 10 ? "0" + story.writtenAt.getMinutes().toString() : story.writtenAt.getMinutes().toString()) + ":" +
                        (story.writtenAt.getSeconds() < 10 ? "0" + story.writtenAt.getSeconds().toString() : story.writtenAt.getSeconds().toString());
                } else if (story.writtenAt.getFullYear() === now.getFullYear()) {
                    story.niceTime = (story.writtenAt.getDate() < 10 ? "0" + story.writtenAt.getDate().toString() : story.writtenAt.getDate().toString()) + "." +
                        (story.writtenAt.getMonth() < 10 ? "0" + story.writtenAt.getMonth().toString() : story.writtenAt.getMonth().toString()) +
                        ". " + (story.writtenAt.getHours() < 10 ? "0" + story.writtenAt.getHours().toString() : story.writtenAt.getHours().toString()) + ":" +
                        (story.writtenAt.getMinutes() < 10 ? "0" + story.writtenAt.getMinutes().toString() : story.writtenAt.getMinutes().toString()) + ":" +
                        (story.writtenAt.getSeconds() < 10 ? "0" + story.writtenAt.getSeconds().toString() : story.writtenAt.getSeconds().toString());
                } else {
                    story.niceTime = (story.writtenAt.getDate() < 10 ? "0" + story.writtenAt.getDate().toString() : story.writtenAt.getDate()) + "." +
                        (story.writtenAt.getMonth() < 10 ? "0" + story.writtenAt.getMonth().toString() : story.writtenAt.getMonth()) + "." +
                        story.writtenAt.getFullYear().toString() +
                        " " + (story.writtenAt.getHours() < 10 ? "0" + story.writtenAt.getHours().toString() : story.writtenAt.getHours()) + ":" +
                        (story.writtenAt.getMinutes() < 10 ? "0" + story.writtenAt.getMinutes().toString() : story.writtenAt.getMinutes()) + ":" +
                        (story.writtenAt.getSeconds() < 10 ? "0" + story.writtenAt.getSeconds().toString() : story.writtenAt.getSeconds());
                }

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

router.get('/village/challanges', (req, res, next) => {
    res.render("village/challanges")
});

router.get('/story/:id', function (req, res, next) {
    Story.findById(req.params.id)
        .populate("author")
        .then(story => {
            if (!story) {
                req.flash("message", "Story not found!")
                res.redirect("/village/storyBoard")
                return;
            } else {
                res.render("story", {
                    story
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
            res.redirect("/village")
            return;
        }
        let userID = req.user._id;
        console.log(story.likes)
        if (story.likes.indexOf(userID) > -1) {}
        story.update({
                $addToSet: {
                    likes: userID
                }
            })
            .then(res.redirect(`/story/${story._id}`))
    }).catch(error => {
        console.error(error)
        next(error)
    })
});

module.exports = router;