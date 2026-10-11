// Print the database tables in the terminal: npm run db
import { DB_PATH, listMessages, listReservations } from './db.js'

console.log(`Database: ${DB_PATH}\n`)
console.log('Reservations')
console.table(listReservations())
console.log('\nMessages')
console.table(listMessages())
