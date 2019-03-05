"use strict";

const request = require("request");

const subscriptionKey = "05052f29b95f472c8c295114c3b5fafc";

const uriBase = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect";

// const imageUrl =
//   "https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg";
const imageUrl =
  "https://previews.123rf.com/images/believeinme33/believeinme331607/believeinme33160700620/61086651-portrait-of-young-angry-man-toned-photo-.jpg";

export const detectEmotion = () => {
  // Request parameters.
  const params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes: "emotion"
  };
  // "age,gender,headPose,smile,facialHair,glasses," +
  //     "emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"

  const data = { url: imageUrl };

  const options = {
    uri: uriBase,
    qs: params,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
    console.log("JSON Response\n");
    console.log(jsonResponse);
  });
};
