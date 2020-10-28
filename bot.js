const http = require('http');
const axios = require('axios');
const { Telegraf } = require('telegraf');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const words = require('./3000_words')

const hostname = '0.0.0.0';
const PORT = process.env.PORT || 3000;
const bot = new Telegraf('1336845635:AAHlYm8EWFWxW6cWJisq4oD1dHOLaL_m3R4')
let language

bot.help((ctx) => ctx.reply('Hi I am YourVocabularyBot my purpose is help you to study vocabulary with the 3000 most common words in English according to the oxford dictionary. Press /start  Take care @chunioor 😜'))

bot.start(({ reply }) => {
    return reply("Welcome to Improve your vocabulary. Press button [🔍 Random word']", Markup
      .keyboard([
        ['🔍 Random word']
      ])
      .oneTime()
      .resize()
      .extra()
    )
  })

bot.hears('🔍 Random word', async (ctx) => {
    let data = {}
    const word = words[Math.floor(Math.random() * 3001)];
    await axios.get(`https://manager-english-bot.herokuapp.com/word/${word}`)
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
            title: word.toUpperCase(),
            caption: `✅ Definition: ${data.definitions} ❗️Example ${data.examples}`
        })
    } else {
        ctx.reply(`${word} word not found 👎`)
    }
})

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
            title: ctx.message.text.toUpperCase(),
            caption: data.definitions
        })
    } else {
        ctx.reply(`${ctx.message.text} word not found 👎`)
    }
})

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola Mundo');
});

server.listen(PORT, hostname, () => {
  bot.launch()
  console.log(`El servidor se está ejecutando en http://${hostname}:${PORT}/`);
});