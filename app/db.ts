// import { drizzle } from 'drizzle-orm/postgres-js';
// import {
//   pgTable,
//   serial,
//   varchar,
//   integer,
//   text,
// } from 'drizzle-orm/pg-core';
// import { eq, and } from 'drizzle-orm';
// import postgres from 'postgres';
// import { genSaltSync, hashSync } from 'bcrypt-ts';

// const client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
// export const db = drizzle(client);

// async function ensureSchema() {
//   const userExists = await client`
//     SELECT EXISTS (
//       SELECT FROM information_schema.tables
//       WHERE table_schema='public' AND table_name='User'
//     );
//   `;
//   if (!userExists[0].exists) {
//     await client`
//       CREATE TABLE "User" (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(64) UNIQUE NOT NULL,
//         password VARCHAR(64) NOT NULL,
//         first_name VARCHAR(64),
//         last_name VARCHAR(64)
//       );
//     `;
//   }
//   await client`
//     ALTER TABLE "User"
//     ADD COLUMN IF NOT EXISTS first_name VARCHAR(64),
//     ADD COLUMN IF NOT EXISTS last_name VARCHAR(64);
//   `;

//   const pwExists = await client`
//     SELECT EXISTS (
//       SELECT FROM information_schema.tables
//       WHERE table_schema='public' AND table_name='passwords'
//     );
//   `;
//   if (!pwExists[0].exists) {
//     await client`
//       CREATE TABLE passwords (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
//         site_name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL,
//         password TEXT NOT NULL,       -- <— note the comma!
//         secret_token VARCHAR(255) DEFAULT ''
//       );
//     `;
//   }
//   await client`
//     ALTER TABLE passwords
//     ADD COLUMN IF NOT EXISTS secret_token VARCHAR(255) DEFAULT '';
//   `;
// }

// ensureSchema().catch(console.error);

// export const users = pgTable('User', {
//   id: serial('id').primaryKey(),
//   email: varchar('email', { length: 64 }),
//   password: varchar('password', { length: 64 }),
//   firstName: varchar('first_name', { length: 64 }),
//   lastName: varchar('last_name', { length: 64 }),
// });

// export const passwords = pgTable('passwords', {
//   id: serial('id').primaryKey(),
//   userId: integer('user_id').notNull(),
//   siteName: varchar('site_name', { length: 255 }).notNull(),
//   email: varchar('email', { length: 255 }).notNull(),
//   passwordValue: text('password').notNull(),
//   secretToken: varchar('secret_token', { length: 255 }).default(''),
// });

// export async function listPasswords(userId: number) {
//   return await db
//     .select()
//     .from(passwords)
//     .where(eq(passwords.userId, userId));
// }

// export async function createPassword(
//   userId: number,
//   siteName: string,
//   email: string,
//   passwordValue: string,
//   secretToken: string
// ) {
//   return await db.insert(passwords).values({ userId, siteName, email, passwordValue, secretToken });
// }

// export async function updatePassword(
//   userId: number,
//   id: number,
//   data: Partial<{ siteName: string; email: string; passwordValue: string; secretToken: string }>
// ) {
//   return await db
//     .update(passwords)
//     .set(data)
//     .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
// }

// export async function deletePassword(userId: number, id: number) {
//   return await db
//     .delete(passwords)
//     .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
// }
import { drizzle } from 'drizzle-orm/postgres-js';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { eq, and } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

// export async function getUser(email: string) {
//   const users = await ensureTableExists();
//   return await db.select().from(users).where(eq(users.email, email));
// }

export async function getUser(email: string) {
  const users = await ensureTableExists();
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const users = await ensureTableExists();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({
    email,
    password: hash,
    firstName,
    lastName,
  });
}

async function ensureTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'User'
    );`;

  if (!result[0].exists) {
    await client`
    CREATE TABLE "User" (
      id SERIAL PRIMARY KEY,
      email VARCHAR(64),
      password VARCHAR(64),
      first_name VARCHAR(64),
      last_name VARCHAR(64)
    );`;
  }

  await client`
    ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(64),
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(64);
  `;

  const pwExists = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema='public' AND table_name='passwords'
    );`;

  if (!pwExists[0].exists) {
    await client`
      CREATE TABLE passwords (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        site_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        totp VARCHAR(255)
      );`;
  }

  const table = pgTable('User', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 64 }),
    password: varchar('password', { length: 64 }),
    firstName: varchar('first_name', { length: 64 }),
    lastName: varchar('last_name', { length: 64 }),
  });

  return table;
}

export const passwords = pgTable('passwords', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  siteName: varchar('site_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordValue: varchar('password').notNull(),
  totp: varchar('totp', { length: 255 }),
});

export async function listPasswords(userId: number) {
  return await db.select().from(passwords).where(eq(passwords.userId, userId));
}

// Create a new password entry tied to the current user
export async function createPassword(
  userId: number,
  siteName: string,
  email: string,
  passwordValue: string,
  totp?: string,
) {
  return await db.insert(passwords).values({ userId, siteName, email, passwordValue, totp });
}

// Update an existing entry, only if it belongs to the user
export async function updatePassword(
  userId: number,
  id: number,
  data: Partial<{ siteName: string; email: string; passwordValue: string }>,
) {
  return await db
    .update(passwords)
    .set(data)
    .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
}

// Delete an entry, only if it belongs to the user
export async function deletePassword(userId: number, id: number) {
  return await db.delete(passwords).where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
}
