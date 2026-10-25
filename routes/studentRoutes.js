const router = require('express').Router();
const c = require('../controllers/studentController');
const wrap = require('../middleware/asyncHandler');
router.post('/', wrap(c.create));
router.get('/:regNo', wrap(c.get));
router.post('/:regNo/bookings', wrap(c.book));
router.get('/:regNo/bookings', wrap(c.listBookings));
router.delete('/:regNo/bookings/:slotId', wrap(c.cancel));
module.exports = router;
