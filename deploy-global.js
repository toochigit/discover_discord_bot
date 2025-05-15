require('dotenv').config();
const { registerGlobalCommands } = require('./registerCommands');

const CLIENT_ID = '1371788271218331740';

registerGlobalCommands(CLIENT_ID, process.env.DISCORD_TOKEN);
