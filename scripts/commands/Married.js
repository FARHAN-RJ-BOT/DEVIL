module.exports.config = {
  name: "married",
  version: "2.0.0",
  permission: 0,
  prefix: true,
  credits: "Clarence DK",
  description: "Sends a hug image",
  category: "img",
  usage: "[@mention]",
  cooldown: 5,
  dependencies: {
    "axios": "latest",
    "fs-extra": "latest",
    "path": "latest",
    "jimp": "latest"
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache', 'canvas', 'married.png');
  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.ibb.co/PjWvsBr/13bb9bb05e53ee24893940892b411ad2.png", path);
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let batgiam_img = await jimp.read(__root + "/married.png");
  let pathImg = __root + `/batman${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'binary'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'binary'));

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));
  batgiam_img.composite(circleOne.resize(150, 150), 280, 45).composite(circleTwo.resize(150, 150), 130, 90);

  let raw = await batgiam_img.getBufferAsync(jimp.MIME_PNG);

  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync(jimp.MIME_PNG);
}

module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);
  if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
  else {
    const one = senderID, two = mention[0];
    return makeImage({ one, two }).then(path => api.sendMessage({ body: "যা্ঁ তু্ঁমা্ঁর্ঁ তো্ঁ বি্ঁয়ে্ঁ ক্ঁরে্ঁ ফে্ঁল্ঁলো্ঁ।🤧😆 এ্ঁখ্ঁন্ঁ বা্ঁস্ঁর্ঁ রা্ঁত্ঁ ক্ঁরা্ঁর্ঁ জ্ঁন্য্ঁ রে্ঁডি্ঁ হ্ঁও্ঁ।🤭🤣", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
  }
    }
