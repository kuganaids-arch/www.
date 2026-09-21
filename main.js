const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const config = require('./config.json');
const colors = require('./UI/colors/colors');
const loadLogHandlers = require('./logHandlers');
const { Partials } = require('discord.js');

const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => GatewayIntentBits[a]),
    partials: [Partials.Channel]
});

client.commands = new Collection();
require('events').defaultMaxListeners = 100;

const loadEvents = require('./handlers/events');
loadEvents(client);

require('./handlers/security')(client);
require('./handlers/applications')(client);
require('./handlers/server');
require('./handlers/economyScheduler')(client);
require('./handlers/embedScheduler')(client);
require('./handlers/embedBuilderModals')(client);
require('./handlers/giveawayHandler')(client);
require('./handlers/serverStatsHandler')(client);
require('./handlers/boostHandler')(client);

const ModMailHandler = require('./handlers/modMailHandler');
const LevelingHandler = require('./handlers/levelingHandler');
const BirthdayHandlers = require('./handlers/birthdayHandlers');
const ReactionRoleHandler = require('./handlers/reactionRoleHandler');
const ModalHandler = require('./handlers/reactionRolemodalHandler');
const afkButtonHandler = require('./handlers/afkHandler');

new ReactionRoleHandler(client);
new ModalHandler(client);
new BirthdayHandlers(client);
client.on('interactionCreate', afkButtonHandler.execute);

client.once('ready', async () => {
    console.log(`[ CORE ] Bot Name: ${client.user.tag}`);
    console.log(`[ CORE ] Client ID: ${client.user.id}`);

    client.user.setPresence({
        status: 'online',
        activities: [{ name: 'your commands', type: 0 }]
    });
    console.log('[ CORE ] Bot status: online');

    loadLogHandlers(client);
    new ModMailHandler(client);
    new LevelingHandler(client);

    try {
        // handlers/commands.js replaces the global application command list,
        // removing stale commands and registering the current local commands.
        await require('./handlers/commands')(client, config, colors);
    } catch (error) {
        console.log(`${colors.red}[ ERROR ]${colors.reset} ${colors.red}${error}${colors.reset}`);
    }
});

client.login(process.env.TOKEN || config.token);

module.exports = client;
