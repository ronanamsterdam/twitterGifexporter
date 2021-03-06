
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
    logger.info('[/process] incoming request');
    try {
      const {fileStream, fileSize, filePath} = await processAssetController.processTwitterGifUrl({url});

      logger.info(`[/process] `+
      `processing done. Straming back...`);

      if (fileStream) {
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': fileSize
        });
        fileStream.pipe(res);

        fileStream.on("end", () => {
          // deleting output file after it's been used
          // TODO: delete by timeout if streaming taking too long
          fs.unlink(filePath, (err) => {
            if (err) {
              logger.error(`[/process] Error deleting Gif file ${filePath}: ` + err);
            }
            logger.info(`[/process] Gif File ${filePath} deleted: `);
          });
        });

      } else {
        res.status(403).send(`[/process]Failed. Something is odd with that url.`);
      }
    } catch (e) {
        errorResp({res, code:500, e, _in: '/process'});
    }
  } else {
      errorResp({res});
  }
});

module.exports = router;