import { Service } from 'moleculer';
import { AppDataSource } from '../db/dataSource';
import { Note } from '../entities/Note';

export default class NotesService extends Service {
  constructor(broker: any) {
    super(broker);
    
    this.parseServiceSchema({
      name: 'notes',
      actions: {
        list: {
          handler: this.list.bind(this)
        },
        get: {
          params: {
            id: 'string'
          },
          handler: this.get.bind(this)
        },
        create: {
          params: {
            title: 'string',
            content: 'string'
          },
          handler: this.create.bind(this)
        },
        update: {
          params: {
            id: 'string',
            title: 'string',
            content: 'string'
          },
          handler: this.update.bind(this)
        },
        delete: {
          params: {
            id: 'string'
          },
          handler: this.delete.bind(this)
        },
      },
    });
  }

  async list(ctx: any) {
    this.logger.info('Получение списка заметок');
    return await AppDataSource.getRepository(Note).find();
  }

  async get(ctx: any) {
    const { id } = ctx.params;
    this.logger.info(`Получение заметки с ID: ${id}`);
    const note = await AppDataSource.getRepository(Note).findOneBy({ id: parseInt(id, 10) });
    if (!note) throw new Error('Note not found');
    return note;
  }

  async create(ctx: any) {
    const { title, content } = ctx.params;
    this.logger.info(`Создание заметки: ${title}`);
    const note = AppDataSource.getRepository(Note).create({ title, content });
    return await AppDataSource.getRepository(Note).save(note);
  }

  async update(ctx: any) {
    const { id, title, content } = ctx.params;
    this.logger.info(`Обновление заметки с ID: ${id}`);
    const repo = AppDataSource.getRepository(Note);
    const note = await repo.findOneBy({ id: parseInt(id, 10) });
    if (!note) throw new Error('Note not found');
    repo.merge(note, { title, content });
    return await repo.save(note);
  }

  async delete(ctx: any) {
    const { id } = ctx.params;
    this.logger.info(`Удаление заметки с ID: ${id}`);
    const result = await AppDataSource.getRepository(Note).delete(id);
    if (result.affected === 0) throw new Error('Note not found');
    return { success: true };
  }
}