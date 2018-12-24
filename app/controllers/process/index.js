import fetch        from 'node-fetch';
import fs           from 'fs';
import gify         from 'gify';
import { logger }   from '~/app/configs/runtime/logger';
import config       from '~/app/configs/env'

import {insufficientParamsReject} from '~/app/controllers/utils';

export default class ProcessAssetController {
    processTwitterGifUrl = async ({url}) => {

      if (url) {

        logger.info(`[processTwitterGifUrl] `+
        `Getting videoSrc from url: ${url}`);

        const Nightmare = require("nightmare")
        const nightmare = Nightmare();

        const videoSrc = await new Promise((res, rej) => {
          nightmare
          .goto(url)
          .wait('video')
          .evaluate(() => document.querySelector('video').src)
          .end()
          .then(res)
          .catch(_error => {
            logger.error(_error);
            debugger;
            return rej(_error);
          })
        });

        logger.info("got videoSrc: ", videoSrc);

        if (videoSrc) {
          return await this.processUrl(videoSrc);
        }

        return videoSrc;
      }

      return insufficientParamsReject();
    }

    processUrl = async (mp4Url) => {
      logger.info(`[processUrl] `+
      `Getting video: ${mp4Url}`);

      const salt = new Date().getTime();

      const fileStream = fs.createWriteStream(`./${salt}.mp4`);

      var input = `./${salt}.mp4`;
      var output = `./${salt}.gif`;

      return fetch(mp4Url)
      .then(async (res) => {
        return await new Promise((resolve, reject) => {
          res.body.pipe(fileStream);
          res.body.on("error", (err) => {
            debugger;
            reject(err);
          });
          fileStream.on("finish", () => {
            gify(input, output, function(err){
              if (err) {
                reject(err);
              } else {
                fileStream.close();
                fileStream.destroy()
                resolve({
                  fileStream: fs.createReadStream(output),
                  fileSize:   fs.statSync(output).size,
                  filePath:   output
                });

                // deleting input file after it's been used
                fs.unlink(input, (err) => {
                  if (err) {
                    logger.error(`[processUrl] Error deleting file ${input}: ` + err);
                  }
                  logger.info(`[processUrl] File ${input} deleted: `);
                });
              }
            });
          });
        });
      })
      .catch(error => {
        debugger;
        logger.error(`[processUrl] shit happened ${mp4Url}: ${JSON.stringify(error)}`);
        return error;
      });
    }
}