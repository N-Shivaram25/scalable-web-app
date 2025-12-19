const { pgTable, serial, text, boolean, timestamp, integer } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  profileImage: text('profile_image'),
  coverPhoto: text('cover_photo'),
  gender: text('gender').default(''),
  mobileNumber: text('mobile_number').default(''),
  address: text('address').default(''),
  qualification: text('qualification').default(''),
  workStatus: text('work_status').default(''),
  theme: text('theme').default('light'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description').default(''),
  category: text('category').default('Web App'),
  status: text('status').default('Not Started'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  thumbnail: text('thumbnail').default(''),
  githubLink: text('github_link').default(''),
  liveLink: text('live_link').default(''),
  owner: text('owner').default('Unknown'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { users, projects, tasks };
