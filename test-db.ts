import { db } from './db';
import { places } from './schema';

async function testDb() {
  try {
    const allPlaces = await db.select().from(places).limit(5);
    console.log('Places:', allPlaces);
  } catch (err) {
    console.error('Erreur connexion Drizzle/PostgreSQL:', err);
  }
}

testDb();
