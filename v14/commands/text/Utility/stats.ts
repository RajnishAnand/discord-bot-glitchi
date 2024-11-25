import prettyMs from 'pretty-ms';
import os from 'os';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'stats',
  description: 'statistics of bot',
  aliases: ['statistics', 'sts'],
  args: false,

  run({ msg }) {
    let stats = new Array();
    let uptime = new Array();
    let sysInfo = new Array();

    try {
      stats.push(`**Node.js** : v${process.versions.node}`);
      stats.push(`**Discord.js** : v${require('discord.js').version}`);
      stats.push(`**Servers** : ${msg.client.guilds.cache.size}`);
      stats.push(`**Channels** : ${msg.client.channels.cache.size}`);
      stats.push(
        `**Users** : ${msg.client.guilds.cache.reduce(
          (s, g) => s + g.memberCount,
          0,
        )}`,
      );

      uptime.push(`**Client** : ${prettyMs(msg.client.uptime ?? 0)}`);
      uptime.push(`**Host** : ${prettyMs(os.uptime())}`);

      const mmry = process.memoryUsage();
      sysInfo.push(
        `**Memory Usage** : \`\`\`js\n{\n    rss: '${formatMemory(
          mmry.rss,
        )}',\n    heapUsed: '${formatMemory(
          mmry.heapUsed,
        )}',\n    heapTotal: '${formatMemory(mmry.heapTotal)}'\n}\`\`\``,
      );
      const cpus = os.cpus();
      if (cpus.length)
        sysInfo.push(
          `**CPU Load** : ${[cpus[0], cpus[cpus.length - 1]]
            .map(
              (c) =>
                (
                  ((c.times.user + c.times.nice + c.times.sys) / c.times.idle) *
                  100
                ).toFixed(2) + '%',
            )
            .join(' | ')}`,
        );

      sysInfo.push(`**Platform** : ${os.platform()}`);
    } catch (err) {
      console.log(err);
      msg.channel.send('There was an error while getting statistics.');
    } finally {
      msg.channel
        .send({
          embeds: [
            {
              color: 0x00bfff,
              fields: [
                {
                  name: 'Statistics',
                  value: '• ' + stats.join('\n• '),
                },
                {
                  name: 'Uptime',
                  value: '• ' + uptime.join('\n• '),
                },
                {
                  name: 'Server',
                  value: '• ' + sysInfo.join('\n• '),
                },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: 'Requested by ' + msg.author.username,
                icon_url:
                  msg.author.avatarURL({ extension: 'png' }) ?? undefined,
              },
            },
          ],
        })
        .catch(() => {
          msg.reply(
            'Found error while executing this command please send this to devloper. Bug reported to devloper',
          );
        });
    }
  },
};

function formatMemory(size: number) {
  return Math.round((size / 1024 / 1024) * 100) / 100 + 'MB';
}
