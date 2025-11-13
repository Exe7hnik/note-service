import { ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';

const broker = new ServiceBroker({
  logger: true,
});

broker.createService({
  name: 'api',
  mixins: [ApiGateway],
  settings: {
    port: 3027,
    routes: [
      {
        path: '/api',
        aliases: {
          "GET /health": () => ({ status: "OK", uptime: process.uptime() }),
        }
      }
    ]
  }
});

broker.start().then(() => {
  console.log('Бэкенд запущен на http://localhost:3027/api/health');
});