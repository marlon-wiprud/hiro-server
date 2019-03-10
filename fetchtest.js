const fetch = require('node-fetch');

const fetchUrl = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion";
const subscriptionKey = "05052f29b95f472c8c295114c3b5fafc";

const imageUrl =
  "https://previews.123rf.com/images/believeinme33/believeinme331607/believeinme33160700620/61086651-portrait-of-young-angry-man-toned-photo-.jpg";


  fetch(fetchUrl,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      },
      body: JSON.stringify({url: imageUrl})
  })
  .then(res => res.json())
  .then(data => console.log(data[0].faceAttributes.emotion))
  .catch(err => console.log(err))