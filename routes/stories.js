const express = require('express');
var secured = require('../lib/middleware/secured');
const router = express.Router();
const Story = require('../models/story')

router.get('/village', (req, res, next) => {
    Story.find({})
        .populate("author")
        .then(stories => {
            for (let story of stories) {
                if(story.text[0].length > 100) {
                    story.short = []
                    story.short[0] = story.text[0].substring(0, 100) + "..."
                } else if (story.text.length > 1){
                    story.short = []
                    story.short[0] = story.text[0]
                    story.short[1] = "..."
                }
            }
            res.render("village", {
                stories
            })
        }).catch(error => {
            console.error(error)
            next(error)
        })
});

router.post('/village', secured(), function(req, res, next) {
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

router.get('/story/:id', function(req, res, next) {
    Story.findById(req.params.id)
        .populate("author")
        .then(story => {
            if (!story) {
                res.redirect("/village")
                return;
            } else {
                res.render("story", { story })
            }
        }).catch(error => {
            console.error(error)
            next(error)
        })
});



router.post('/story/:id/like', secured(), function(req, res, next) {
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