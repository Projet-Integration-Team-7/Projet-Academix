const { Router } = require('express')
const Transaction = require('../models/Transaction')

const router = Router()

function ensureLogin(req, res, next) {
    if(!req.isAuthenticated()) {
        return res.status(401).send({message: 'Not authenticated'})
    }
    next()
}

router.get('/', ensureLogin, async (req, res) => {
    try {
        const transactions = await Transaction.find({user_id: req.user._od}).exec()
        if (!transactions) {
            throw new Error('No transactions')
        }
        res.status(200).json(transactions)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/', ensureLogin, async (req, res) => {
    const { value, date } = req.body
    const newTransaction = new Transaction({ value, date, user_id: req.user_id })

    try {
        const transaction = await newTransaction.save()
        if (!transaction) {
            throw new Error('There was an error saving the transaction')
        }
        res.status(200).json(transaction)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', ensureLogin, async (req, res) => {
  const { id } = req.params;
  console.log('Deleting transaction with ID:', id);

  try {
      const transaction = await Transaction.findById(id);
      if (!transaction) {
          throw new Error('No transaction was found');
      }

      if(transaction,user_id !== String(req.user._id)) {
        return res.status(403).json({message: 'Unauthorized' })
      }

      const removed = await Transaction.deleteOne({ _id: id });

      if (!removed) {
          throw new Error('There was a problem deleting the transaction');
      }
      res.status(200).json({ id });
  } catch (error) {
      console.error('Error deleting transaction:', error.message);
      res.status(404).json({ message: error.message });
  }
});


module.exports = router
