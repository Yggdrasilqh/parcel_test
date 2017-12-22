import * as express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('ok')
});

router.head('/', (req, res, next) => {
  res.send('ok')
})

router.options('/', (req, res, next) => {
  res.header('Allow', 'GET,HEAD,OPTIONS')
  res.sendStatus(200)
})

export default router
