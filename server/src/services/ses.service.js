const https = require("https");
const crypto = require("crypto");
const fs = require("fs");

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || "support@skilium.in";

const SERVICE = "ses";
const HOST = `email.${AWS_REGION}.amazonaws.com`;
const ENDPOINT = `https://${HOST}/v2/email/outbound-emails`;

/**
 * SHA256 hash.
 */
const sha256 = (data) => {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
};

/**
 * HMAC-SHA256.
 */
const hmac = (key, data) => {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
};

/**
 * Derive AWS Signature V4 signing key.
 */
const getSigningKey = (secretKey, dateStamp, region, service) => {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");

  return kSigning;
};

/**
 * Send an email through AWS SES API v2.
 *
 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string|string[]} [options.cc]
 * @param {string|string[]} [options.bcc]
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 * @param {string} [options.from]
 * @param {string|string[]} [options.replyTo]
 *
 * @returns {Promise<Object>}
 */
const sendEmail = async ({
  to,
  cc = [],
  bcc = [],
  subject,
  html,
  text = "",
  from = SES_FROM_EMAIL,
  replyTo = [],
  attachments = [],
}) => {
  if (!AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID is not configured.");
  }

  if (!AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not configured.");
  }

  if (!to || (Array.isArray(to) && to.length === 0)) {
    throw new Error("At least one recipient is required.");
  }

  if (!subject) {
    throw new Error("Email subject is required.");
  }

  if (!html && !text) {
    throw new Error("Email body is required.");
  }

  const toAddresses = Array.isArray(to) ? to : [to];
  const ccAddresses = Array.isArray(cc) ? cc : [cc];
  const bccAddresses = Array.isArray(bcc) ? bcc : [bcc];
  const replyToAddresses = Array.isArray(replyTo) ? replyTo : [replyTo];

  const sesAttachments = attachments.map((attachment) => {
    const content = fs.readFileSync(attachment.path);

    return {
      RawContent: content.toString("base64"),
      FileName: attachment.filename,
      ContentType: attachment.contentType || "application/octet-stream",
      ContentDisposition: attachment.disposition || "ATTACHMENT",
      ContentTransferEncoding: "BASE64",
      ...(attachment.contentId ? { ContentId: attachment.contentId } : {}),
      ...(attachment.description
        ? { ContentDescription: attachment.description }
        : {}),
    };
  });

  /**
   * SES API v2 request body.
   */
  const payload = {
    FromEmailAddress: from,

    Destination: {
      ToAddresses: toAddresses,
    },

    Content: {
      Simple: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },

        Body: {
          ...(html
            ? {
                Html: {
                  Data: html,
                  Charset: "UTF-8",
                },
              }
            : {}),

          ...(text
            ? {
                Text: {
                  Data: text,
                  Charset: "UTF-8",
                },
              }
            : {}),
        },

        ...(sesAttachments.length > 0
          ? {
              Attachments: sesAttachments,
            }
          : {}),
      },
    },
  };

  if (ccAddresses.length > 0) {
    payload.Destination.CcAddresses = ccAddresses;
  }

  if (bccAddresses.length > 0) {
    payload.Destination.BccAddresses = bccAddresses;
  }

  if (replyToAddresses.length > 0) {
    payload.ReplyToAddresses = replyToAddresses;
  }

  const body = JSON.stringify(payload);

  /**
   * AWS Signature V4 timestamps.
   *
   * Example:
   * 20260916T091500Z
   */
  const now = new Date();

  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");

  const dateStamp = amzDate.substring(0, 8);

  /**
   * Credential scope.
   */
  const credentialScope = `${dateStamp}/${AWS_REGION}/${SERVICE}/aws4_request`;

  /**
   * Headers included in the signature.
   */
  const contentType = "application/json";

  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${HOST}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders = "content-type;host;x-amz-date";

  /**
   * Hash request payload.
   */
  const payloadHash = sha256(body);

  /**
   * SES API v2 uses:
   *
   * POST /v2/email/outbound-emails
   */
  const canonicalUri = "/v2/email/outbound-emails";

  const canonicalQueryString = "";

  /**
   * Canonical request.
   */
  const canonicalRequest = [
    "POST",
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  /**
   * String to sign.
   */
  const algorithm = "AWS4-HMAC-SHA256";

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  /**
   * Generate signing key.
   */
  const signingKey = getSigningKey(
    AWS_SECRET_ACCESS_KEY,
    dateStamp,
    AWS_REGION,
    SERVICE,
  );

  /**
   * Final signature.
   */
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  /**
   * Authorization header.
   */
  const authorization =
    `${algorithm} ` +
    `Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, ` +
    `Signature=${signature}`;

  /**
   * HTTPS request.
   */
  const requestOptions = {
    hostname: HOST,
    port: 443,
    path: canonicalUri,
    method: "POST",

    headers: {
      Host: HOST,
      "Content-Type": contentType,
      "Content-Length": Buffer.byteLength(body),
      "X-Amz-Date": amzDate,
      Authorization: authorization,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseBody = "";

      res.setEncoding("utf8");

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        let parsedResponse;

        try {
          parsedResponse = responseBody ? JSON.parse(responseBody) : {};
        } catch {
          parsedResponse = {
            raw: responseBody,
          };
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          return resolve({
            success: true,
            statusCode: res.statusCode,
            messageId: parsedResponse.MessageId || null,
            response: parsedResponse,
          });
        }

        const error = new Error(
          parsedResponse.message ||
            parsedResponse.Message ||
            parsedResponse.__type ||
            `AWS SES request failed with status ${res.statusCode}`,
        );

        error.statusCode = res.statusCode;
        error.awsResponse = parsedResponse;

        reject(error);
      });
    });

    req.setTimeout(30000, () => {
      req.destroy(new Error("AWS SES request timed out."));
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(body);
    req.end();
  });
};

module.exports = {
  sendEmail,
};
