const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const crypto = require("crypto");
const { URL } = require("url");
const QueryString = require("querystring");

const spClientId = process.env.SPOTIFY_CLIENT_ID;
const spClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spClientCallback = process.env.SPOTIFY_CLIENT_CALLBACK;

const authString = Buffer.from(spClientId + ":" + spClientSecret).toString(
  "base64"
);
const authHeader = `Basic ${authString}`;
const spotifyEndpoint = "https://accounts.spotify.com/api/token";

//encryption
const encSecret = process.env.ENCRYPTION_SECRET;
const encMethod = "aes-256-ctr";

const encrypt = text => {
  const aes = crypto.createCipher(encMethod, encSecret);
  let encrypted = aes.update(text, "utf8", "hex");
  encrypted += aes.final("hex");
  return encrypted;
};
const decrypt = text => {
  const aes = crypto.createDecipher(encMethod, encSecret);
  let decrypted = aes.update(text, "hex", "utf8");
  decrypted += aes.final("utf8");
  return decrypted;
};

function postRequest(url, data = {}) {
  return new Promise((resolve, reject) => {
    // build request data
    url = new URL(url);
    const reqData = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    // create request
    const req = https.request(reqData, res => {
      // build response
      let buffers = [];
      res.on("data", chunk => {
        buffers.push(chunk);
      });

      res.on("end", () => {
        // parse response

        let result = null;
        try {
          result = Buffer.concat(buffers);
          result = result.toString();
          var contentType = res.headers["content-type"];
          if (typeof contentType == "string") {
            contentType = contentType.split(";")[0].trim();
          }
          if (contentType == "application/x-www-form-urlencoded") {
            result = QueryString.parse(result);
          } else if (contentType == "application/json") {
            result = JSON.parse(result);
          }
        } catch (error) {
          error.response = res;
          error.data = result;
          reject(error);
          return;
        }
        resolve({ response: res, result: result });
      });
    });

    // handle error
    req.on("error", error => {
      reject(error);
    });

    // send
    data = QueryString.stringify(data);
    req.write(data);
    req.end();
  });
}

const tokenSwap = async (req, res) => {
  console.log("Swapping token");
  try {
    // build request data
    const reqData = {
      grant_type: "authorization_code",
      redirect_uri: spClientCallback,
      code: req.body.code
    };

    // get new token from Spotify API
    const { response, result } = await postRequest(spotifyEndpoint, reqData);
    // encrypt refresh_token
    if (result.refresh_token) {
      result.refresh_token = encrypt(result.refresh_token);
    }

    // send response
    res.status(response.statusCode).json(result);
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode);
    } else {
      res.status(500);
    }
    if (error.data) {
      res.send(error.data);
    } else {
      console.log("blank");
      res.send(error);
    }
  }
};

const tokenRefresh = async (req, res) => {
  console.log("refreshing token");
  try {
    // ensure refresh token parameter
    if (!req.body.refresh_token) {
      res.status(400).json({ error: "Refresh token is missing from body" });
      return;
    }

    // decrypt token
    const refreshToken = decrypt(req.body.refresh_token);
    // build request data
    const reqData = {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    };
    // get new token from Spotify API
    const { response, result } = await postRequest(spotifyEndpoint, reqData);

    // encrypt refresh_token
    if (result.refresh_token) {
      result.refresh_token = encrypt(result.refresh_token);
    }

    // send response
    res.status(response.statusCode).json(result);
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode);
    } else {
      res.status(500);
    }
    if (error.data) {
      res.send(error.data);
    } else {
      res.send("");
    }
  }
};

module.exports = { tokenSwap, tokenRefresh };
