import { Client } from 'discord.js';
import { commands } from "./commands-descriptions.json";
import { discordToken } from './config.json';

const client = new Client();

client.once('ready', () => {
    console.log('dSpinnerBot is Running');
});

// prefix used to use the bot
const prefix = '-spinner';
const items: Set<string> = new Set();

// listen for a message event
client.on('message', (message) => {
    // if the message is missing the prefix or has been sent by a bot, ignore it
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // get the command and corresponding arguments
    const args = message.content.slice(prefix.length+1).split(/ +/g);
    const request = args.shift().toLowerCase();

    let result: string;

    switch(request) {
        case 'coin-flip':
            result = Math.floor(Math.random() * 2) === 0 ? 'Heads' : 'Tails';
        break;
        // add one or more items to the list, by default Set() is ignoring duplicates
        case 'add':
            // if no items, show error and usage instructions
            if (args.length === 0) {
                const command = commands.find(c => c.name === 'add');
                result = `No items detected!\n\n'-spinner add' usage:\n\t\t${command.usage}`;
            } else {
                const newItems = args[0]?.split(/,/g);
                const currentItems = items.size;
                newItems.forEach(item => items.add(item));
                const updatedItems = items.size;
                result = `Added ${updatedItems - currentItems} new items to the list\n\nCurrent List:\n${Array.from(items).toString().replace(/,/g, '\n')}`;
            }
        break;
        // remove one or multiple items from the list
        case 'remove':
            // if no items, show error and usage instructions
            if (args.length === 0) {
                const command = commands.find(c => c.name === 'remove');
                result = `No items detected!\n\n'-spinner remove' usage:\n\t\t${command.usage}`;
            } else if (items.size === 0) {
                result = 'The list is empty!';
            } else {
                const itemsToRemove = args[0].split(/,/g);
                let removedItems = 0;
                for (const item of itemsToRemove) {
                    if (!items.has(item)) continue;
                    items.delete(item);
                    removedItems++;
                }
                result = `Removed ${removedItems} items\n\nCurrent List:\n${Array.from(items).toString().replace(/,/g, '\n')}`;
            }
        break;
        // show the list to the user
        case 'list':
            // if no items, show error and usage instructions
            if (items.size === 0) {
                result = 'There are no items in the list!'
            } else {
                result = `Current List:\n${Array.from(items).toString().replace(/,/g, '\n')}`;
            }
        break;
        case 'clear-list':
            items.clear();
            result = 'The list has been cleared';
        break;
        // return random member of the list
        case 'spin':
            if (items.size === 0) {
                result = 'There are no items in the list!'
            } else {
                const index = Math.floor(Math.random() * items.size);
                result = Array.from(items)[index];
            }
        break;
        // show user all available commands
        case 'help':
            result = 'All available commands:\n\n';
            result += commands.map(command => `'${command.name}':\n\t\t${command.usage}\n\t\t${command.description}\n\n`).join("");
        break;
        default:
            result = `Unrecognized command, use '-spinner help' to see all available commands`;
        break;
    }

    // send back the result
    message.channel.send(result);
});

// login to the Discord server
client.login(discordToken);