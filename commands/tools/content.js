module.exports = {
  name: 'content',
  description: 'content of message',
  usage: '[optional:#channel or channelID] [messageID] ',
  args: true,
  execute({ msg, args, client }) {
    let channel, messageID;
    if (args.length >= 2) {
      let chID = args[0]
        .replace(/^<#/, '')
        .replace(/>$/, '');
      if (chID * 1 != chID) return msg
        .reply(`unable to resolve \`${args[0]}\` as channel.`);
      messageID = args[1];
      channel = client.channels.cache.get(chID);
    }
    else {
      if(args[0]*1!=args[0]) return msg
        .reply(`unable to resolve \`${args[0]}\` as messageID`);
      messageID = args[0];
      channel = msg.channel;
    }
    if(messageID*1!=messageID) return msg
        .reply(`unable to resolve \`${messageID}\` as messageID`);
    
    //console.log(channel)
    let messages = channel.messages;
    if(messages){
      messages.fetch(messageID)
        .then(m=>
          msg.channel.send(m.content,{code:true}))
        .catch(err=>msg.reply(err.message));
    }
    else{
      msg.reply(`message with id \`${messageID}\` not Found!`);
    };
    
  },
}