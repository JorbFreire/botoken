const venom = require('venom-bot');

const chromiumArgs = [
  '--disable-web-security', '--no-sandbox', '--disable-web-security',
  '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
  '--disable-offline-load-stale-cache', '--disk-cache-size=0',
  '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
  '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
  '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
  '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'
];
const blockedLinks = []

const extractLink = (body) => {
  const words = body.split(" ")
  const [link] = words.map(word => word.includes("https") ? word : "")
  return link
}

const addTeenMinutes = (cicles, action) => {
  if (cicles === 1)
    setTimeout(() => action(), 600000)
  else
    addTeenMinutes(cicles - 1, action)
}

const addBlockedLink = (link) => {
  blockedLinks.push(link)
  console.log("blocked:")
  console.log(blockedLinks)
  // 72 ta legal
  addTeenMinutes(2, () => {
    blockedLinks.shift()
    console.log("blocked after shift:")
    console.log(blockedLinks)
  })
}


venom
  .create({
    session: 'session-name', //name of session
    logQR: true,
    browserArgs: chromiumArgs,
  })
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

function start(client) {
  client.onMessage((message) => {
    console.log("ô de casa")
    // span timer
    if (message.body.includes("https")) {
      link = extractLink(message.body)
      if (blockedLinks.includes(link))
        client.deleteMessage(message.id)
      addBlockedLink(link)
    }

    if (message.body.includes("https://youtu.be/") && message.isGroupMsg === true) {
      let outPutMessage = ""
      if (message.body.includes(" "))
        outPutMessage = extractLink(message.body)
      else
        outPutMessage = 'SUS!!!'

      client
        .reply(message.from, outPutMessage, message.id)
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((error) => {
          console.error('Error when sending: ', error); //return object error
        });
    }
  });
}

