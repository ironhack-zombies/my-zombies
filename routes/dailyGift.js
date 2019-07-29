const express = require('express');
const router = express.Router();

router.get('/dailyGift', (req, res, next) => {

    res.render("dailyGift")
});

module.exports = router;