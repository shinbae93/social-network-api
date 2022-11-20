const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { Share } = require('../models/_Share');
const { ShareManager } = require('../services/ShareManager');
const { auth } = require('../middleware/auth');
//
const PATH = '/api/v1';
//
const shareManager = new ShareManager();

router.post(PATH + '/shares', async (req, res) => {
  const PICK_FIELDS = ['userId', 'postId'];
  const ShareObj = lodash.pick(req.body, PICK_FIELDS);
  //
  try {
    const { share } = await shareManager.createShare(ShareObj);
    //
    res.send(share);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete(PATH + '/shares/:id', async (req, res) => {
  //
  try {
    const { share } = await shareManager.deleteShare(req.params.id);
    //
    res.send(share);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
router.get(PATH + '/post/:id/shares', async (req, res) => {
  //
  try {
    const { shares } = await shareManager.getShareByPost(req.params.id);
    //
    res.send(shares);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;
