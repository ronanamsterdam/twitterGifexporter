import { logger }     from '~/app/configs/runtime/logger';

import {insufficientParamsReject, notFoundReject} from '~/app/controllers/utils';

export default class ProcessAssetController {
    processTwitterGifUrl = async ({url}) => {

      if (url) {
        logger.info(`Some url passed in ${url}`);

        // logger.info(`[CloverRemoteOrderController.getOrderReceipt] `+
        // `Getting receipt by id: ${remoteOrderId}`);
        // const receiptResp = await fetch(`${baseUrl}/r/${remoteOrderId}`)
        // .then(handleSuccessError)
        // .catch(error => {
        //   logger.error(`[getOrderReceipt] shit happened ${remoteOrderId}: ${JSON.stringify(error)}`);
        //   return error;
        // });

        // if (receiptResp.error || typeof(receiptResp) !== 'string') {
        //   return unexpectedReject({
        //     because: receiptResp.error || "failed to fetch receipt",
        //     _in: 'CloverRemoteOrderController.getOrderReceipt->receiptResp'});
        // }

        return true;

      }

      return insufficientParamsReject();
    }
}