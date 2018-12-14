
import { logger }     from '~/app/configs/runtime/logger';

import express from 'express';
const router =  express.Router();

import {errorResp} from './utils';

import ProcessAssetController from '~/app/controllers/process'

const processAssetController = new ProcessAssetController();

/**
 * @api {get} /?url=:url Request Test route
 * @apiName ProcessAssetFromUrl
 * @apiGroup ProcessAssets
 *
 * @apiQuery {String} url twitter url with gif in it
 *
 * @apiSuccess {File} processed file back
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
router.get('/', async (req, res) => {
  const { url } = req.query;
  if (url) {
    logger.info('Some request on /');
    try {
      await processAssetController.processTwitterGifUrl({url});
      res.status(200).send(`Hola amigo ${url}`);
    } catch (e) {
        errorResp({res, code:500, e, _in: '/process/'});
    }
  } else {
      errorResp({res});
  }
});

module.exports = router;