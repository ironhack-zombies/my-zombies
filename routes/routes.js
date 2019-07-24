const express = require('express');
const router = express.Router();

// import all other routes from sufiles
router.get("/", require("./index.js"));

// catch 404 and render a not-found.hbs template
router.use((req, res, next) => {
  res.status(404);
  res.render('404');
});

router.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error', {error: err});
  }
});

module.exports = router;