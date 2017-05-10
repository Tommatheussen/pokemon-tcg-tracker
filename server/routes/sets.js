const express = require('express');
const router = express.Router();

const request = require('request-promise');

/* GET api listing. */
router.get('/', (req, res) => {
	let limit = req.query.limit || 10;
	let sort = req.query.sort || 'openDate';
  let order = req.query.order || 'ASC';
  let page = req.query.page || 1;

  let where = {}
  req.query.status ? where.status = req.query.status : null;

  request({
    uri: 'https://api.pokemontcg.io/v1/sets',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }).then(function (sets) {
    return res.send(sets.sets);
  }).catch(function (err) {
    return res.send(err);
  });
});

module.exports = router;