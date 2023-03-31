const express = require('express')
const { addList, updateList, deleteList, getList} = require('../controllers/list')
const { validation } = require('../middleware/auth')
const router = express.Router()

router.get('/', getList)
router.post('/:id?', validation, addList)
router.put('/:id', updateList)
router.delete('/:id', deleteList)

module.exports = router