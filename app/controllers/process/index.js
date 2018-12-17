import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import gify from 'gify';
import htmlparser from 'htmlparser2';
const puppeteer = require('puppeteer');
import {handleSuccessError} from '~/app/controllers/utils';
import { logger }     from '~/app/configs/runtime/logger';

import {insufficientParamsReject} from '~/app/controllers/utils';

export default class ProcessAssetController {
      browser = null
      page = null

      beforeAll = async () => {

        const headless = false;
        let pappeteerAdditionalConf = {};
        if (!headless) {
            pappeteerAdditionalConf = {
                ...pappeteerAdditionalConf,
                // slowMo: !headless ? 150 : 0,
                executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
            };
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
                    width: 20,
                    height: 20
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

        console.log(videoSrc);

        if (videoSrc) {
          await this.processUrl(videoSrc);
        }

        await this.afterAll();

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

      const receiptResp = await fetch(mp4Url)
      .then(async (res) => {
        return await new Promise((resolve, reject) => {
          res.body.pipe(fileStream);
          res.body.on("error", (err) => {
            reject(err);
          });
          fileStream.on("finish", function() {
            gify(input, output, function(err){
              if (err) {
                reject(err);
              }
            });
            resolve();
          });
        });
      })
      .catch(error => {
        logger.error(`[processUrl] shit happened ${mp4Url}: ${JSON.stringify(error)}`);
        return error;
      });
    }

    download = function (url, dest, cb) {
      var file = fs.createWriteStream(dest);
      var request = http.get(url, function(response) {
        debugger;
        // response.pipe(file);
        // file.on('finish', function() {
        //   file.close(cb);  // close() is async, call cb after close completes.
        // });
      }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
      });
    };
}