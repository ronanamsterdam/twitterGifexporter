
import { logger }     from '~/app/configs/runtime/logger';

import fs from 'fs';

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

      var filePath = './octocat.gif';
      var stat = fs.statSync(filePath);

      res.writeHead(200, {
          'Content-Type': 'image/gif',
          'Content-Length': stat.size
      });

      var readStream = fs.createReadStream(filePath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      readStream.pipe(res);

      // res.status(200).send(`Hola amigo ${url}`);
    } catch (e) {
        errorResp({res, code:500, e, _in: '/process/'});
    }
  } else {
      errorResp({res});
  }
});

module.exports = router;