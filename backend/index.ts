import 'reflect-metadata';
import { ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';
import { AppDataSource } from './db/dataSource';
import { Note } from './entities/Note';

import NotesService from './services/notes.service';

const broker = new ServiceBroker({
  logger: true,
});

async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    process.exit(1);
  }
}

async function startService() {
  await initializeDatabase();

  // Создаем сервис notes
  broker.createService(NotesService);

  // Создаем API Gateway
  broker.createService({
    name: 'api',
    mixins: [ApiGateway],
    settings: {
      port: 3000,
      routes: [
        {
          path: '/api',
          whitelist: ['notes.*'],
          aliases: {
            'GET notes': 'notes.list',
            'GET notes/:id': 'notes.get',
            'POST notes': 'notes.create',
            'PUT notes/:id': 'notes.update',
            'DELETE notes/:id': 'notes.delete',
          },
          bodyParsers: { 
            json: { strict: false, limit: '1MB' } 
          }
        }
      ]
    }
  });

  await broker.start();
  console.log('Бэкенд готов: http://localhost:3000/api/notes');
}

startService().catch(console.error);