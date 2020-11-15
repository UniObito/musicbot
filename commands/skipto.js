const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "скипнуть к другому произведению исскуства",
  execute(message, args) {
    if (!args.length || isNaN(args[0]))
      return message
        .reply(`Исп: ${message.client.prefix}${module.exports.name} <Цифра песни>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Здесь нету песни мда.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(`В очереди всего ${queue.songs.length} композиций!`).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ скипнул ${args[0] - 1} песен`).catch(console.error);
  }
};
