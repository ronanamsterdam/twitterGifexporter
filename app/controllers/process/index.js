import fetch        from 'node-fetch';
import fs           from 'fs';
import gify         from 'gify';
import puppeteer    from 'puppeteer';
import { logger }   from '~/app/configs/runtime/logger';
import config       from '~/app/configs/env'

import {insufficientParamsReject} from '~/app/controllers/utils';

export default class ProcessAssetController {
      browser = null
      page = null

      beforeAll = async () => {
        // headless chrome does NO support html5 vide :\
        const headless = false;
        let pappeteerAdditionalConf = {};
        if (!headless) {
            pappeteerAdditionalConf = {
              devtools: false
            }

            if (config.chromePath) {

              pappeteerAdditionalConf = {
                ...pappeteerAdditionalConf,
                executablePath: config.chromePath
              }
            }
        }

        this.browser = await puppeteer.launch({
            headless,
            args:       ['--no-sandbox', '--disable-setuid-sandbox'],
            devtools:   !headless,
            ...pappeteerAdditionalConf,
        });

        this.page = await this.browser.newPage();

        if (!headless) {
            this.page.emulate({
                viewport: {
                    width: 50,
                    height: 50
                },
                userAgent: ''
            });
        }
    }

    afterAll = () => {
      this.browser.close();
    }

    processTwitterGifUrl = async ({url}) => {

      if (url) {

        await this.beforeAll();

        await this.page.goto(url);
        await this.page.waitForSelector('video');
        const videoSrc = await this.page.evaluate(() =>  document.querySelector('video') && document.querySelector('video').src) || "";

        await this.afterAll();

        console.log(videoSrc);

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

      const fileStream = fs.createWriteStream('./octocat.mp4');
      var input = './octocat.mp4';
      var output = './octocat.gif';

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