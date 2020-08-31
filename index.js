const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json")
const config = require('./config.json')
var appendjson = require('appendjson');

const ytdl = require('ytdl-core');

const fs = require('fs');
const { isNullOrUndefined } = require('util');

var prefix = 'gt?'

function titleCharList(input) {  
  var words = input.splice(' ');  
  var CapitalizedWords = [];  
  words.forEach(element => {  
      CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
  });  
  return CapitalizedWords.join('\n');  
}

function unknownCommand() {
  const embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Unknown Command')
    .setDescription('This command does not exist! Please use ' + sprefix +  'help to get a list of all available commands!')
    .setTimestamp()
    .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
    .setFooter('User ID: ' + message.author.id)

  message.channel.send(embed)
}

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: 'invisible',
    })
});

client.on('message', async message => {
  let guildPrem = JSON.parse(fs.readFileSync('premium_servers.json', 'utf-8'))
  let guildOp = JSON.parse(fs.readFileSync('op_servers.json', 'utf-8'))
  let specialPrefix = JSON.parse(fs.readFileSync('prefixes.json', 'utf-8'))

  var specialPrefixString = JSON.stringify(specialPrefix)

  if (specialPrefixString.includes(message.guild.id)) {
    sprefix = specialPrefix.special_prefixes[message.guild.id]
  } else {
    sprefix = prefix
  }

  if (!message.content.startsWith(sprefix) || message.author.bot) return;

  const args = message.content.slice(sprefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (!config.COMMANDS.includes(command.toLowerCase())) {
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Unknown Command')
      .setDescription('This command does not exist! Please use **' + sprefix +  'help** to get a list of all available commands!')
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
      .setFooter('User ID: ' + message.author.id)
    
    console.log(message.author + ": " + message.content)
    return message.channel.send(embed)
  }

  if (command === 'help') {
    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('Command Help')
      .setDescription('This embed will show you a list of all available commands and how to use them.')
      .addFields(
        { name : 'Administration', value : '**' + sprefix + 'prefix <*new-prefix>** - Sets a new prefix for this guild', inline : false },
        { name : 'Linking and Statistics', value : '**' + sprefix + 'link <account-name>** - Links your MiHoyo account with your discord account, or shows your account if no account-name is given.\n' + '**' + sprefix + 'link** - Shows the MiHoyo account currently linked to your discord account.\n' + '**' + sprefix + 'unlink** - Unlinks your currently linked MiHoyo account.\n' + '**' + sprefix + 'stats** - Shows the in-game stats of your currently linked MiHoyo account.', inline : false },
        { name : 'Characters', value : '**' + sprefix + 'chars** - Shows you a list of all playable characters.\n' + '**' + sprefix + 'char <character name>** - Shows you all information about the given character.', inline : false },
        { name : 'Weapons', value : '**' + sprefix + 'weapons** - Shows you a list of all available weapons.\n' + '**' + sprefix + 'weapon <weapon name>** - Shows you all information about the given weapon', inline : false },
        { name : 'Food and Potions', value : '**' + sprefix + 'foods** - Shows you a list of every available food and snack.\n' + '**' + sprefix + 'food <food name>** - Shows you information about the given food.\n' + '**' + sprefix + 'potions** - Shows you a list of ervery existing potion.\n' + '**' + sprefix + 'potion <potion name>** - Shows you all available information about the given potion.', inline : false },
        { name : 'Maps and Spots', value : '**' + sprefix + 'map** - Shows you a map of Teyvat and additional information', inline : false },
        { name : 'Elements and Regions', value : '**' + sprefix + 'elements** - Shows you a list of all elements in the game.\n' + '**' + sprefix + 'element <element name>** - Shows you information about the given element and its region', inline : false },
        { name : 'In-Game Purchases', value : '**' + sprefix + 'bp** - Shows you all information about the current Battlepass.\n' + '**' + sprefix + 'mp** - Shows you all information about the monthly pass.\n' + '**' + sprefix + 'pg** - Shows you the prices for Primogem purchases', inline : false}
      )
      .setTimestamp()
      .setFooter(`Requested by: ${message.author.id} --- * = Optional`, message.author.displayAvatarURL({ dynamic : true }))
    
    console.log(message.author + ": " + message.content)
    client.channels.cache.get(message.channel.id).send(embed)
  }

  
  if (command === 'char') {
    const PyroE = client.emojis.cache.get("748264365060390933");
    const HydroE = client.emojis.cache.get("748264355724001423");
    const GeoE = client.emojis.cache.get("748264348522381313");
    const ElectroE = client.emojis.cache.get("748264340225786096");
    const DendroE = client.emojis.cache.get("748264332697272484");
    const CryoE = client.emojis.cache.get("748264318574788808");
    const AnemoE = client.emojis.cache.get("748264292897259624");
    if (!args.length) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('No Given Argument')
        .setDescription('You didnt state an argument in position "0". You can find all character names by using **' + sprefix +  'chars**')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    let characters = JSON.parse(fs.readFileSync('characters.json', 'utf-8'))

    const char = args[0].toLowerCase()

    if (!characters.list.includes(char)) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Character Does Not Exist')
        .setDescription('The given character does not exist in our database. Please use **' + sprefix +  'chars** to see all available characters. If you think thats a database issue, please dm me!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    var charElem;

    if (characters[char].element === 'Pyro') charElem = `${PyroE} - ${characters[char].element}`
    if (characters[char].element === 'Hydro') charElem = `${HydroE} - ${characters[char].element}`
    if (characters[char].element === 'Geo') charElem = `${GeoE} - ${characters[char].element}`
    if (characters[char].element === 'Electro') charElem = `${ElectroE} - ${characters[char].element}`
    if (characters[char].element === 'Dendro') charElem = `${DendroE} - ${characters[char].element}`
    if (characters[char].element === 'Cryo') charElem = `${CryoE} - ${characters[char].element}`
    if (characters[char].element === 'Anemo') charElem = `${AnemoE} - ${characters[char].element}`

    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      embed.setTitle(`${client.emojis.cache.get(characters[char].id)}` + ' ' + characters[char].name + ' - ' + characters[char].city)
      if (characters[char].rating === 4) embed.addFields(
        { name : 'Element', value : charElem, inline : true },
        { name : 'Weapon', value : characters[char].weapon, inline : true },
        { name : 'Description', value : characters[char].info, inline : false},
        { name : 'Voice Actor', value : characters[char].cv, inline : true },
        { name : 'Rating', value : ':star::star::star::star:', inline : true}
      )
      if (characters[char].rating === 5) embed.addFields(
        { name : 'Element', value : charElem, inline : true },
        { name : 'Weapon', value : characters[char].weapon, inline : true },
        { name : 'Description', value : characters[char].info, inline : false},
        { name : 'Voice Actor', value : characters[char].cv, inline : true },
        { name : 'Rating', value : ':star::star::star::star::star:', inline : true}
      )
      embed.setDescription(`_**[${characters[char].sp}](${characters[char].link})**_`)
      embed.setTimestamp()
      embed.setImage(url=characters[char].url)
      embed.setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))

    console.log(message.author + ": " + message.content)
    client.channels.cache.get(message.channel.id).send(embed)
  }  
  
  
  if (command === 'chars') {
    let characters = JSON.parse(fs.readFileSync('characters.json', 'utf-8'))

    var pyro = '748264365060390933'
    var hydro = '748264355724001423'
    var geo = '748264348522381313'
    var electro = '748264340225786096'
    var dendro = '748264332697272484'
    var cryo = '748264318574788808'
    var ameno = '748264292897259624'
    
    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('All Characters')
      .setDescription('This embed will show you a list of all characters sorted by their city names.')
      .addFields(
        { name : 'Mondstadt Characters', value : `${client.emojis.cache.get(ameno)} - ${client.emojis.cache.get(characters.jean.id)} - Jean\n${client.emojis.cache.get(pyro)} - ${client.emojis.cache.get(characters.amber.id)} - Amber\n${client.emojis.cache.get(electro)} - ${client.emojis.cache.get(characters.lisa.id)} - Lisa\n${client.emojis.cache.get(cryo)} - ${client.emojis.cache.get(characters.kaeya.id)} - Kaeya\n${client.emojis.cache.get(hydro)} -  ${client.emojis.cache.get(characters.barbara.id)} - Barbara\n${client.emojis.cache.get(pyro)} - ${client.emojis.cache.get(characters.diluc.id)} - Diluc\n${client.emojis.cache.get(electro)} - ${client.emojis.cache.get(characters.razor.id)} - Razor\n${client.emojis.cache.get(ameno)} - ${client.emojis.cache.get(characters.venti.id)} - Venti\n${client.emojis.cache.get(pyro)} - ${client.emojis.cache.get(characters.klee.id)} - Klee\n${client.emojis.cache.get(pyro)} -  ${client.emojis.cache.get(characters.bennett.id)} - Bennett\n${client.emojis.cache.get(geo)} -  ${client.emojis.cache.get(characters.noelle.id)} - Noelle\n${client.emojis.cache.get(electro)} - ${client.emojis.cache.get(characters.fischl.id)} - Fischl\n${client.emojis.cache.get(ameno)} - ${client.emojis.cache.get(characters.sucrose.id)} - Sucrose\n${client.emojis.cache.get(hydro)} -  ${client.emojis.cache.get(characters.mona.id)} - Mona`, inline : false },
        { name :  'Liyue Characters', value : `
        ${client.emojis.cache.get(ameno)} - ${client.emojis.cache.get(characters.xiao.id)} - Xiao
        ${client.emojis.cache.get(electro)} - ${client.emojis.cache.get(characters.beidou.id)} - Beidou
        ${client.emojis.cache.get(electro)} - ${client.emojis.cache.get(characters.ningguang.id)} - Ningguang
        ${client.emojis.cache.get(pyro)} - ${client.emojis.cache.get(characters.xiangling.id)} - Xiangling
        ${client.emojis.cache.get(hydro)} -  ${client.emojis.cache.get(characters.xingqiu.id)} - Xingqiu
        ${client.emojis.cache.get(cryo)} - ${client.emojis.cache.get(characters.chongyun.id)} - Chongyun
        ${client.emojis.cache.get(cryo)} - ${client.emojis.cache.get(characters.qiqi.id)} - Qiqi
        ${client.emojis.cache.get(electro)} - ${client.emojis.cache.get(characters.keqing.id)} - Keqing
        `, inline : true }
      )
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))
  
    console.log(message.author + ": " + message.content)
    message.channel.send(embed);
  } 


  if (command === 'weapon') {

    if (!args.length) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('No Given Argument')
        .setDescription('You didnt state an argument in position "0". You can find all weapon names by using **' + sprefix +  'weapons**')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)

      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    let weapons = JSON.parse(fs.readFileSync('weapons.json', 'utf-8'))

    const weap = args.join('').toLowerCase().replace('-', '').replace("'", "")

    if (!weapons.list.includes(weap.toLowerCase().replace(' ', ''))) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Weapon Does Not Exist')
        .setDescription('The given weapon does not exist in our database. Please use **' + sprefix +  'weapons** to see all available weapons. If you think thats a database issue, please dm me!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)

      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    if (weapons[weap].rating === 1) var stars = ':star:'
    if (weapons[weap].rating === 2) var stars = ':star::star:'
    if (weapons[weap].rating === 3) var stars = ':star::star::star:'
    if (weapons[weap].rating === 4) var stars = ':star::star::star::star:'
    if (weapons[weap].rating === 5) var stars = ':star::star::star::star::star:'

    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle(`${weapons[weap].class} - ${weapons[weap].name}`)
      .addFields(
        { name : 'Base Attack', value : weapons[weap].baseatk + ' ATK', inline : true },
        { name : 'Secondary Stat', value : weapons[weap].secstat, inline : true },
        { name : 'Passive Ability', value : weapons[weap].passive, inline : false },
        { name : 'Rating', value : stars, inline : false },
        { name : 'Rank 1', value : weapons[weap].r1, inline : false },
        { name : 'Rank 2', value : weapons[weap].r2, inline : false },
        { name : 'Rank 3', value : weapons[weap].r3, inline : false },
        { name : 'Rank 4', value : weapons[weap].r4, inline : false },
        { name : 'Rank 5', value : weapons[weap].r5, inline : false },
      )
      .setTimestamp()
      .setThumbnail(url=weapons[weap].url)
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))
    
    client.channels.cache.get(message.channel.id).send(embed)
    console.log(message.author + ": " + message.content)
  }


  if (command === 'weapons') {
    let weapons = JSON.parse(fs.readFileSync('weapons.json', 'utf-8'))

    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('All Weapons')
      .addFields(
        { name : 'Swords', value : weapons.Swords, inline : false },
        { name : 'Bows', value : weapons.Bows, inline : false },
        { name : 'Polearms', value : weapons.Polearms, inline : false },
        { name : 'Claymores', value : weapons.Claymores, inline : false },
        { name : 'Catalysts', value : weapons.Catalysts, inline : false}
      )
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))

    client.channels.cache.get(message.channel.id).send(embed)
    console.log(message.author + ": " + message.content)
  }


  if (command === 'food') {
    if (!args.length) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('No Given Argument')
        .setDescription('You didnt state an argument in position "0". You can find all food and snack names by using **' + sprefix +  'foods**')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)

      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    let food = JSON.parse(fs.readFileSync('food.json', 'utf-8'))

    const fd = args.join('').toLowerCase().replace('-', '').replace("'", "")

    if (!food.list2.includes(fd.toLowerCase().replace(' ', ''))) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Food Does Not Exist')
        .setDescription('The given food does not exist in our database. Please use **' + sprefix +  'foods** to see every available food. If you think thats a database issue, please dm me!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    if (food[fd].rating === 1) var stars = ':star:'
    if (food[fd].rating === 2) var stars = ':star::star:'
    if (food[fd].rating === 3) var stars = ':star::star::star:'
    if (food[fd].rating === 4) var stars = ':star::star::star::star:'
    if (food[fd].rating === 5) var stars = ':star::star::star::star::star:'

    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle(`${food[fd].name}`)
      .addFields(
        { name : 'Effect', value : food[fd].effect, inline : false },
        { name : 'Rating', value : stars, inline : false },
      )
      .setTimestamp()
      .setThumbnail(url=food[fd].url)
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))
    
    client.channels.cache.get(message.channel.id).send(embed)
    console.log(message.author + ": " + message.content)
  }


  if (command === 'foods') {
    let foods = JSON.parse(fs.readFileSync('food.json', 'utf-8'))

    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('Every Food')
      .addFields(
        { name : 'Food names', value : foods.list1, inline : false }
      )
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))

    client.channels.cache.get(message.channel.id).send(embed)
    console.log(message.author + ": " + message.content)
  }



  if (command === 'potion') {
    if (!args.length) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('No Given Argument')
        .setDescription('You didnt state an argument in position "0". You can find all potion names by using **' + sprefix +  'potions**')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)

      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    let potions = JSON.parse(fs.readFileSync('potions.json', 'utf-8'))

    const pots = args.join('').toLowerCase().replace('-', '').replace("'", "")

    if (!potions.list1.includes(pots.toLowerCase().replace(' ', ''))) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Potion Does Not Exist')
        .setDescription('The given potion does not exist in our database. Please use **' + sprefix +  'potions** to see all available potions. If you think thats a database issue, please dm me!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
    }

    if (potions[pots].rating === 1) var stars = ':star:'
    if (potions[pots].rating === 2) var stars = ':star::star:'
    if (potions[pots].rating === 3) var stars = ':star::star::star:'
    if (potions[pots].rating === 4) var stars = ':star::star::star::star:'
    if (potions[pots].rating === 5) var stars = ':star::star::star::star::star:'

    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle(`${potions[pots].name}`)
      .addFields(
        { name : 'Effect', value : potions[pots].effect, inline : false },
        { name : 'Rating', value : stars , inline : false },
      )
      .setTimestamp()
      .setThumbnail(url=potions[pots].url)
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))
    
    client.channels.cache.get(message.channel.id).send(embed)
    console.log(message.author + ": " + message.content)
  }


  if (command === 'potions') {
    let potions = JSON.parse(fs.readFileSync('potions.json', 'utf-8'))

    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('Every Potion')
      .addFields(
        { name : 'Potion names', value : potions.list2, inline : false }
      )
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))

    client.channels.cache.get(message.channel.id).send(embed)
    console.log(message.author + ": " + message.content)
  }
  if (command === 'map') {
    const MondstadtEmoji = client.emojis.cache.get("748236199784874294");
    const LiyueEmoji = client.emojis.cache.get("748236211692241057");
    const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('Teyvat')
      .setDescription('You have arrived in Teyvat — a fantasy world where the seven elements flow and converge.\n In the distant past, the Archons granted mortals unique elemental abilities. With the help of such powers, people formed a bountiful homeland out of the wilderness. However, 500 years ago, the collapse of an ancient civilization turned the universe upside down...\n Though the calamity the world suffered has ceased, peace has yet to be restored.')
      .setTimestamp()
      .addFields(
        { name : `${MondstadtEmoji} - Mondstadt`, value : 'A city of freedom that lies in the northeast of Teyvat. From amongst mountains and wide-open plains, carefree breezes carry the scent of dandelions — a gift from the Anemo God, Barbatos — across Cider Lake to Mondstadt, which sits on an island in the middle of the lake.', inline : false},
        { name : `${LiyueEmoji} - Liyue`, value : "A bountiful harbor that lies in the east of Teyvat. Mountains stand tall and proud alongside the stone forest, that together with the open plains and lively rivers make up Liyue's bountiful landscape, which shows its unique beauty through each of the four seasons. Just how many gifts from the Geo God lie in wait amongst the rocks of Liyue's mountains?", inline : false }
      )
      .setImage(url='https://www.genshin-impact.de/community/media/1-gesnhin-impact-estatua-de-los-7-anem%C3%B3culus-geoculus-1024x946-png/')
      .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))

    client.channels.cache.get(message.channel.id).send(embed)
    console.log(message.author + ": " + message.content)
    }

    if (command === 'element') {

      if (!args.length) {
        const embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('No Given Argument')
          .setDescription('You didnt state an argument in position "0". You can find all weapon names by using **' + sprefix +  'elements**')
          .setTimestamp()
          .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
          .setFooter('User ID: ' + message.author.id)
  
        console.log(message.author + ": " + message.content)
        return message.channel.send(embed)
      }
  
      let elements = JSON.parse(fs.readFileSync('elements.json', 'utf-8'))
  
      const elem = args.join('').toLowerCase().replace('-', '').replace("'", "")
  
      if (!elements.list1.includes(elem.toLowerCase().replace(' ', ''))) {
        const embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('Element Does Not Exist')
          .setDescription('The given element does not exist in our database. Please use **' + sprefix +  'elements** to see all available elements. If you think thats a database issue, please dm me!')
          .setTimestamp()
          .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
          .setFooter('User ID: ' + message.author.id)
  
        console.log(message.author + ": " + message.content)
        return message.channel.send(embed)
      }
  
      const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle(`${elements[elem].name}`)
        .addFields(
          { name : 'Home City', value : elements[elem].city, inline : true },
          { name : 'Real-World Inspiration', value : elements[elem].rl, inline : true }
        )
        .setTimestamp()
        .setThumbnail(url=elements[elem].url)
        .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))
      
      client.channels.cache.get(message.channel.id).send(embed)
      console.log(message.author + ": " + message.content)
    }
  
  
    if (command === 'elements') {
      let elements = JSON.parse(fs.readFileSync('elements.json', 'utf-8'))
  
      const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('All Elements')
        .addFields(
          { name : 'Elements', value : elements.list2, inline : false }
        )
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter(`Requested by: ${message.author.id}`, message.author.displayAvatarURL({ dynamic : true }))
  
      client.channels.cache.get(message.channel.id).send(embed)
      console.log(message.author + ": " + message.content)
    }


    if (command === 'link') {
      let usersJson = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
      if (!args.length && !JSON.stringify(usersJson).includes(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('You have no linked account yet!')
        .setDescription('You dont have an account linked to your discord, use **' + sprefix +  'link <ingame-name>** to link your account with discord!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
  
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
      } else if (!args.length && JSON.stringify(usersJson).includes(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('Linked Account Details')
        .setDescription('Your account is currently linked to "' + usersJson.users[message.author.id] + '".\n Click [here](https://genshin.mihoyo.com/en) to log in now!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
      }
      var usersObject = {
        users: {}
      } 
      usersObject.users[message.author.id] = args.join(' ')

      appendjson(usersObject, 'users.json', function() {
        const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('Linked Account!')
        .setDescription('Your account is now linked to "' + args.join(' ') + '".\n Click [here](https://genshin.mihoyo.com/en) to log in now!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
        message.channel.send(embed)
      })
      console.log(message.author + ": " + message.content)
    }



    if (command === 'unlink') {
      let usersJson = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
      if (!args.length && !JSON.stringify(usersJson).includes(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('You have no linked account yet!')
        .setDescription('You dont have an account linked to your discord, use **' + sprefix +  'link <ingame-name>** to link your account with discord!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
  
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
      } else if (!args.length && JSON.stringify(usersJson).includes(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('Successfully unlinked')
        .setDescription('Your MiHoyo account "' + usersJson.users[message.author.id] + '" is now not linked to your discord account anymore!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      delete usersJson.users[message.author.id]
      let usersString = JSON.stringify(usersJson)
      fs.writeFileSync('users.json', usersString)
      return message.channel.send(embed)
    }}

    if (command === 'stats') {
      let usersJson = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
      if (!args.length && !JSON.stringify(usersJson).includes(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('You have no linked account yet!')
        .setDescription('You dont have an account linked to your discord, use **' + sprefix +  'link <ingame-name>** to link your account with discord!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
      }

      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('No API Yet')
        .setDescription('Sadly, there is no API yet, so I cant see your stats. Sorry for the inconvenience!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)

      message.channel.send(embed)
      console.log(message.author + ": " + message.content)
    }

    if (command === 'prefix') {
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('No Permission')
        .setDescription('You have no permission to use that command, ask a user with following permission for help: **ADMINISTRATOR**')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)

      message.channel.send(embed)
      console.log(message.author + ": " + message.content + ' - error: no Permission!')
      }

      if (!guildPrem.servers.includes(message.guild.id) && !guildOp.servers.includes(message.guild.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('This server isnt premium yet!')
        .setDescription('Only premium servers are allowed to use this command!\n You can upgrade your server for $1 to premium [here](https://paypal.me/pools/c/8s6aZ7Qh8V)!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('Guild ID: ' + message.guild.id)
  
      console.log(message.author + ": " + message.content + ' - error: not Premium!')
      return message.channel.send(embed)

      } 
      if (!args.length && specialPrefixString.includes(message.guild.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('Prefix Settings')
        .setDescription('Following prefix is set for this guild: ' + sprefix)
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
      } else if (!args.length && !specialPrefixString.includes(message.guild.id)) {
        const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('Prefix Settings')
        .setDescription('Following prefix is set for this guild: ' + sprefix)
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('User ID: ' + message.author.id)
      
      console.log(message.author + ": " + message.content)
      return message.channel.send(embed)
      }

      var newPrefix = {
        special_prefixes: {}
      }
      newPrefix.special_prefixes[message.guild.id] = args.join(' ')

      appendjson(newPrefix, 'prefixes.json', function() {
        const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('New Prefix Set!')
        .setDescription('Your guild now uses: "' + args.join(' ') + '" as prefix!')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('Guild ID: ' + message.guild.id)
        message.channel.send(embed)
      })
      console.log(message.author + ": " + message.content)
    }

    if (command === 'bp') {
      const embed = new Discord.MessageEmbed()
        .setColor('#2ef2d2')
        .setTitle('Battle Pass')
        .setDescription('Find all information about the current "Exordium"-Battle Pass below')
        .addFields(
          {name : 'Free Pass Name', value : 'Sojourner´s Battle Pass', inline : true },
          {name : 'Paid Pass Name', value : 'Gnostic´s Battle Pass', inline : true },
          {name : 'Price in USD', value : '~$10.00', inline : false },
          {name : 'Requirements', value : 'Adventure Rank 20', inline : false}
        )
        .setTimestamp()
        .setImage(url='https://vignette.wikia.nocookie.net/gensin-impact/images/3/34/Battle_Pass.png/revision/latest/scale-to-width-down/1000?cb=20200721221728')
        .setFooter('User ID: ' + message.author.id)
        message.channel.send(embed)
        console.log(message.author + ": " + message.content)
    }

    if (command === 'mp') {
      const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('Monthly Pass')
      .setDescription('Find all information about the current "Exordium"-Battle Pass below')
      .addFields(
        {name : 'Paid Pass Name', value : 'Blessing of the Welkin Moon', inline : false },
        {name : 'Price in USD', value : '~$5.00 per month', inline : false },
        {name : 'Rewards', value : '300 Primogems instantly, 90 Primogems per day\n 3000 Primogems in total', inline : false},
        {name : 'Requirements', value : 'Unknown - No requirements given', inline : false}
      )
      .setTimestamp()
      .setImage(url='https://vignette.wikia.nocookie.net/gensin-impact/images/f/f7/Blessing_of_Welkin_Moon.png/revision/latest/scale-to-width-down/1000?cb=20200724103720')
      .setFooter('User ID: ' + message.author.id)
      message.channel.send(embed)
      console.log(message.author + ": " + message.content)
    }

    if (command === 'pg') {
      const embed = new Discord.MessageEmbed()
      .setColor('#2ef2d2')
      .setTitle('Primogems')
      .setDescription('Primogems are the premium currency in Genshin Impact. They can be used for Wishes (Gacha) and refilling Original Resin (energy).')
      .addFields(
        { name : 'Type', value : 'Special Currency', inline : true },
        { name : 'Rarity', value : ':star::star::star::star::star:', inline : true },
        { name : 'Packages', value : '60 Primogems : $0.99\n330 Primogems : $4.99\n1190 Primogems : $14.99\n2240 Primogems : $29.99\n3880 Primogems : $49.99\n8080 Primogems : $99.99', inline : false }
      )
      .setTimestamp()
      .setThumbnail(url='https://vignette.wikia.nocookie.net/gensin-impact/images/d/d4/Item_Primogem.png/revision/latest?cb=20200405150744')
      .setFooter('User ID: ' + message.author.id)
      message.channel.send(embed)
      console.log(message.author + ": " + message.content)
    }

    if (command === 'countdown') {
      var timeForRefresh = 6000000;
      var updateTimeString = 'The countdown will update every 1 hour, buy premium [here](https://paypal.me/pools/c/8s6aZ7Qh8V) for updates every 10 minutes!'

      if (guildPrem.servers.includes(message.guild.id)) timeForRefresh = 600000, updateTimeString = 'The countdown will update every 10 minutes!'
      if (guildOp.servers.includes(message.guild.id)) timeForRefresh = 60000, updateTimeString = 'The countdown will update every 1 minute!'
      var countDownDate = new Date("Sep 28, 2020 00:00:00").getTime();

      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription('`                                                        `' + '\n\nThis might take up to 1 hour, based on your servers rank, please be patient!\n\n The thumbnail of this embed will be removed after fetching the data.\n\n As soon as all data is fetched, this embed will keep you updated on how much time is left before the international release of **Genshin Impact**\n\n' + updateTimeString + '\n\n `                                                        `')
        .setTitle('Fetching Countdown Data')
        .addFields(
          { name : 'Release Date', value : 'Fetching Data', inline : true },
          { name : 'Countdown', value : 'Fetching Data', inline : true }
        )
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic : true }))
        .setFooter('Requested by: ' + message.author.id)
      
      message.channel.send(embed).then((msg) => {

        var x = setInterval(function() {

          var now = new Date().getTime();

          var distance = countDownDate - now;

          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

          var timeNow = days + "d " + hours + "h ";

          if (guildOp.servers.includes(message.guild.id) || guildPrem.servers.includes(message.guild.id)) timeNow = days + "d " + hours + "h " + minutes + "m ";

          var embedUpdate = new Discord.MessageEmbed()
            .setColor('#2ef2d2')
            .setDescription(updateTimeString)
            .setTitle('Genshin Impact Release Countdown')
            .addFields(
              { name : 'Release Date', value : 'Sep 28, 2020', inline : true },
              { name : 'Countdown', value : timeNow, inline : true }
            )
            .setTimestamp()
            .setImage(url='https://o.remove.bg/downloads/cbbfc83a-586f-4a0a-9312-7a622833f73f/Banner-Banner-removebg-preview.png')
            .setFooter('Requested by: ' + message.author.id)
          
          msg.edit(embedUpdate)

          if (distance < 0) {
            clearInterval(x);
            var embedEnd = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Genshin Impact Release Countdown')
            .addFields(
              { name : 'Release Date', value : 'Sep 28, 2020', inline : true },
              { name : 'Countdown', value : 'The countdown is over! You can now play Genshin Impact!', inline : true }
            )
            .setTimestamp()
            .setImage(url='https://o.remove.bg/downloads/cbbfc83a-586f-4a0a-9312-7a622833f73f/Banner-Banner-removebg-preview.png')
            .setFooter('Requested by: ' + message.author.id)
          
          msg.edit(embedEnd)
          }
        }, timeForRefresh);
    })}

    if (command === 'song') {
      let songsJson = JSON.parse(fs.readFileSync('songs.json', 'utf-8'))
      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel) {
        const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('You are not connected to a voice channel!')
            .setDescription('Please join a voice channel first, before you use the ' + sprefix + 'song command!')
            .setTimestamp()
            .setFooter('User ID: ' + message.author.id)
          
          return message.channel.send(embed)
      }

      var index = Math.floor(Math.random() * 15)

      if (args.length) index = args[0] - 1
      
      if (index >= 16 || index <= 0) {
        const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Song #' + (index + 1) + ' does not exist!')
            .setDescription('You need to put in a song number between 1 and 15!')
            .setTimestamp()
            .setFooter('User ID: ' + message.author.id)
          
          return message.channel.send(embed)
      }
      voiceChannel.join().then(connection => {
        const stream = ytdl(songsJson.songs[index], { filter: 'audioonly' });
        ytdl.getInfo(songsJson.songs[index], function(err, info) {
          const embed = new Discord.MessageEmbed()
            .setColor('#2ef2d2')
            .setTitle('Now playing #' + (index + 1))
            .addFields(
              { name : 'Song', value : info.videoDetails.title, inline : false },
              { name : 'Duration', value : (info.videoDetails.lengthSeconds / 60).toFixed(1) + 'minutes', inline : false},
              { name : 'Viewcount', value : info.videoDetails.viewCount + ' Viewers', inline : false },
            )
            .setImage(url=info.videoDetails.thumbnail.thumbnails[4].url)
            .setTimestamp()
            .setFooter('Requested by: ' + message.author.id)
          
          message.channel.send(embed)
        });
        const dispatcher = connection.play(stream);

        dispatcher.on('finish', () => voiceChannel.leave());
      });
    }

    if (command === 'stop') {
      message.member.voice.channel.leave()
    }
});

  client.on('guildCreate', (guild) => {

    let bannedGuilds = JSON.parse(fs.readFileSync('bannedguild.json', 'utf-8'))

    const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle(guild.name)
      .addFields(
        { name : 'Owner', value : guild.ownerID, inline : true },
        { name : 'Region', value : guild.region, inline : true },
        { name : 'User', value : guild.memberCount, inline : false }
      )
      .setTimestamp()
      .setFooter('Guild ID: ' + guild.id)
    client.channels.cache.get('748315727068659783').send()

    if (bannedGuilds.servers.includes(guild.id)) {
      guild.leave()
    }
  });

  client.on('message', (message) => {
      if (message.channel.type === "dm") {
      const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(message.author + " - DM")
        .addFields(
          { name : 'User ID', value : message.author.id, inline : false },
          { name : 'Content', value : message.content, inline : false }
        )
        .setTimestamp()
        return client.channels.cache.get('748397234630164580').send(embed)
      }
  });


client.login(token.TOKEN);