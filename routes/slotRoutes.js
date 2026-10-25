const router = require('express').Router();
const c = require('../controllers/slotController');
const wrap = require('../middleware/asyncHandler');
router.post('/', wrap(c.create));
router.get('/', wrap(c.list));
router.get('/:id', wrap(c.get));
module.exports = router;
