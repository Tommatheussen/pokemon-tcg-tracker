const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.use('/sets', require('./sets'));
router.use('/cards', require('./cards'));
router.use('/collection', require('./collection'));

module.exports = router;