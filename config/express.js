const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');
const lusca = require('lusca');
const expressValidator = require('express-validator');
const crypto = require('crypto');

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature'];

  if (!signature) {
    throw new Error("Couldn't validate the request signature.");
  } else {
    const elements = signature.split('=');
    const signatureHash = elements[1];

    const expectedHash = crypto.createHmac('sha1', process.env.APP_SECERT)
                               .update(buf)
                               .digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

function expressConfig(app) {
  // Sets the app port
  app.set('port', process.env.PORT || 3000);

  // Compress response bodies
  app.use(compression());

  // HTTP request logger
  app.use(logger('dev'));

  // An express.js middleware for node-validator
  app.use(expressValidator());

  // Parses json, A new body object containing the parsed data is populated on
  // the request object after the middleware
  app.use(bodyParser.json());

  // Parses urlencoded bodies, A new body object containing the parsed data is
  // populated on the request object after the middleware (i.e. req.body). This
  // object will contain key-value pairs, where the value can be a string or
  // array (when extended is false), or any type (when extended is true).
  app.use(bodyParser.urlencoded({ extended: true }));

  // Enables X-FRAME-OPTIONS headers to help prevent Clickjacking
  app.use(lusca.xframe('SAMEORIGIN'));

  // Enables X-XSS-Protection headers to help prevent cross site scripting (XSS)
  // attacks in older IE browsers (IE8)
  app.use(lusca.xssProtection(true));

  // Indicates the app is behind a front-facing proxy,
  // and to use the X-Forwarded-* headers to determine the connection and the
  // IP address of the client.
  app.set('trust proxy', 'loopback');

  // X-Powered-By header has no functional value.
  // Keeping it makes it easier for an attacker to build the site's profile
  // It can be removed safely
  app.disable('x-powered-by');

  // body-parser verify the request body after it has been read
  app.use(bodyParser.json({ verify: verifyRequestSignature }));

  console.log('Express configured successfully');
}

module.exports = expressConfig;
