import { app } from '@/config/app';
import chalk from 'chalk';
import 'dotenv/config';
import http from 'http';

// Load environment variables

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(chalk.green(`Server is running on port ${chalk.cyan(PORT)}`));
});
