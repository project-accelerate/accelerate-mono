import 'reflect-metadata'
import Container from 'typedi'
import log from 'winston'
import { DatabaseConnection } from '../app/common/DatabaseConnection'

export async function configureDb() {
  const db = Container.get(DatabaseConnection)

  while (true) {
    try {
      log.debug('Waiting for database to come online...')
      await db.knex.raw('select 1')
      break
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  log.debug('Database is online. Performing migrations...')
  await db.knex.migrate.latest()
}
