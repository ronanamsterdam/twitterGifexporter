import { logger }     from '~/app/configs/runtime/logger';

import express from 'express';
const router =  express.Router();

/**
 * @api {post} /somepath/:id Request Test route
 * @apiName PostTst
 * @apiGroup Tst
 *
 * @apiParam {Number/String} id unique ID.
 *
 * @apiSuccess {String} test string "Hola amigo from id".
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
router.get('*', (req, res) => {
    logger.info('Some request on *');
    res.status(200).send('Hola amigo');
});

/**
 * @api {get} /somepath/:id Request Test route
 * @apiName GetTstId
 * @apiGroup Tst
 *
 * @apiParam {Number/String} id unique ID.
 *
 * @apiSuccess {String} test string "Hola amigo from id".
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
router.get('/somepath/:id', (req, res) => {
    const { id } = req.params;
    logger.info('Some request on /somepath/:id');
    res.status(200).send(`Hola amigo from ${id}`);
});

module.exports = router;