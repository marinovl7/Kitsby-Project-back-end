const express = require('express');
const router = express.Router();
const {
	signup,
	login,
	addBalance,
	getBalance,
	addPassLevel,
	getAllUsers,
	getSingleUser,
	deleteUser,
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/addBalance', addBalance);
router.get('/getBalance/:userId', getBalance);
router.put('/addPassLevel', addPassLevel);
router.get('/getAllUsers', getAllUsers);
router.get('/getSingleUser/:userId', getSingleUser);
router.delete('/deleteUser/:userId', deleteUser);

module.exports = router;
