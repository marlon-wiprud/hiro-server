"use strict";

const fetch = require('node-fetch');
const sizeOf = require('image-size')

const subscriptionKey = "05052f29b95f472c8c295114c3b5fafc";
const fetchUrl = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion";
const imageUrl =
  "https://previews.123rf.com/images/believeinme33/believeinme331607/believeinme33160700620/61086651-portrait-of-young-angry-man-toned-photo-.jpg";

 const detectEmotion = (req,res, next) => {
  // Request parameters.
  // "age,gender,headPose,smile,facialHair,glasses," +
  //     "emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
  const bufferValue = Buffer.from(req.body.img,"base64");
  fetch(fetchUrl,{
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    },
    body: bufferValue
})
.then(res => res.json())
.then(data => {
  const emotion = data[0].faceAttributes.emotion;
  console.log('emotion: ', emotion)
  res.locals.emotion = emotion;
  next()
})
.catch(err => {
  console.log(err)
  res.status(400).send(JSON.stringify(err))
});
  
};

 const parseEmotion = (req,res) => {
  const emotion = res.locals.emotion;
  let x = '';
  for(let key in emotion){
    console.log(key, emotion[key]);
    if(x === ''){
      x = key
    }else{
      if(emotion[x] < emotion[key]){
        x = key
      }
    }
    
  }

  console.log('final answer ===', x)
  res.status(200).send(JSON.stringify({mood: x}))
}

module.exports = { parseEmotion, detectEmotion}
