var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("hello world!");
});

router.get('/test',(req, res)=>{
  return res.send("test")
})

router.get('*', (req, res) => {
  return res.redirect('/')
})
module.exports = router;
