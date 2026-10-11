// Print the database tables in the terminal: npm run db
import { DB_LOCATION, listMessages, listReservations, ready } from './db.js'

await ready
console.log(`Database: ${DB_LOCATION}\n`)
console.log('Reservations')
console.table(await listReservations())
console.log('\nMessages')
console.table(await listMessages())
