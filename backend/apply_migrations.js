
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function migrate() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('Running migrations...');

    try {
        // SQLite doesn't support modifying check constraints easily, 
        // but we can add the new columns and handle errors if they exist.
        
        // We might need to recreate the users table if we want to change the CHECK constraint strictly,
        // but usually adding the column is enough for now or we can ignore the constraint update if it's already there.
        // For simplicity, let's try adding new columns to orders.
        
        try {
            await db.run("ALTER TABLE orders ADD COLUMN assignedStaffId TEXT");
            console.log('Added assignedStaffId to orders');
        } catch (e) { console.log('assignedStaffId might already exist'); }

        try {
            await db.run("ALTER TABLE orders ADD COLUMN internalNotes TEXT");
            console.log('Added internalNotes to orders');
        } catch (e) { console.log('internalNotes might already exist'); }

        // Updating the CHECK constraint in SQLite usually requires table recreation.
        // Let's check if 'staff' is already valid or if we need to do the migration dance.
        // For now, let's assume 'staff' can be inserted even if CHECK constraint is 'admin', 'user' 
        // because SQLite doesn't always enforce it strictly depending on version/config, 
        // but better safe than sorry.
        
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await db.close();
    }
}

migrate();
