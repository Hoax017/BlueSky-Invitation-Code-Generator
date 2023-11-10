const fs = require('fs');

const username = 'Hoax.bsky.social';
const email = 'whooop';
const password = 'topsecret';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatResetTime(timestamp) {
  const resetDate = new Date(timestamp * 1000);
  return resetDate.toLocaleString(); // Vous pouvez ajuster le format en fonction de vos préférences
}

(async () => {
  let result;

  //  si 'bsky-social.txt' existe pas il faut le cree
  if (!fs.existsSync('bsky-social.txt')) {
    fs.writeFileSync('bsky-social.txt', '');
  }

  let file = fs.readFileSync('bsky-social.txt', 'utf8');
  do {
    // generate code like 7ds9u
    const code1 = Math.random().toString(36).substring(2, 7);
    const code2 = Math.random().toString(36).substring(2, 7);
    // compare with file

    if (file.includes(`bsky-social-${code1}-${code2}`)) {
      continue;
    }
    const response = await (await fetch("https://bsky.social/xrpc/com.atproto.server.createAccount", {
      "credentials": "omit",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
        "Accept": "*/*",
        "Accept-Language": "fr,en;q=0.5",
        "content-type": "application/json",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
      },
      "referrer": "https://bsky.app/",
      "body": `{"handle":"${username}","password":"${password}","email":"${email}","inviteCode":"bsky-social-${code1}-${code2}"}`,
      "method": "POST",
      "mode": "cors"
    }))
    result = await response.json();

    console.log(result)
    console.log(`Code: bsky-social-${code1}-${code2}`)

    // get headers from response
    const rateLimitLimit = parseInt(response.headers.get('ratelimit-limit'));
    const rateLimitReset = parseInt(response.headers.get('ratelimit-reset'));
    const rateLimitRemaining  = parseInt(response.headers.get('ratelimit-remaining'));

    // afficher le statut de la limite de taux
    console.log(`Limite de taux: ${rateLimitRemaining}/${rateLimitLimit}`);
    console.log(`Réinitialiser la limite de taux: ${formatResetTime(rateLimitReset)}`);

    if (rateLimitRemaining === 0) {
      console.log("Limite de taux atteinte. Attente avant de continuer...");
      await delay((rateLimitReset - Math.floor(Date.now() / 1000) + 5) * 1000);
    }


    // write code in file
    if (result.error === 'InvalidInviteCode') {
      fs.appendFileSync('bsky-social.txt', `bsky-social-${code1}-${code2}\n`)
      file += `bsky-social-${code1}-${code2}\n`
    }
  } while (result.error === 'InvalidInviteCode' || result.error === 'RateLimitExceeded');
})();


