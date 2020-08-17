const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const axios = require('axios');
const { Telegraf } = require('telegraf');

const bot = new Telegraf('1226295178:AAHYjBb6I-AMpfSw3CG3GtHeDOEV6l7w3Zk')
let language

bot.start((ctx) => ctx.reply('Welcome'))

bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.command('lang', (ctx) => {
    const lang = ctx.message.text.split(" ")
    if(lang[1] === 'ES'){
        language = 'spanish'
    }

    ctx.reply(`You have selected ${language}`)
})

bot.use(async (ctx) => {
    let data = {}
    await axios.get(`https://manager-english-bot.herokuapp.com/word/${ctx.message.text}`)
        .then(res => {
            data = res.data
        })
        .catch(err => {
            console.log(err)
        });
    if (data.pronunciations) {
        ctx.replyWithAudio({
            url: data.pronunciations
        }, {
            title: ctx.message.text,
            caption: data.definitions
        })
    } else {
        ctx.reply(`${data} 👎`)
    }
})

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola Mundo');
});

server.listen(process.env.PORT || port, hostname, () => {
  bot.launch()
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});