import 'server-only';
import { redis } from './redis';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export type AppUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
};

export type SafeUser = Omit<AppUser, 'passwordHash'>;

const KEY = {
  index: 'sparq:users:index',
  byEmail: (email: string) => `sparq:users:email:${email.toLowerCase()}`,
  byId: (id: string) => `sparq:users:${id}`,
};

export async function getUserByEmail(email: string): Promise<AppUser | null> {
  const id = await redis.get<string>(KEY.byEmail(email.toLowerCase()));
  if (!id) return null;
  return redis.hgetall<AppUser>(KEY.byId(id));
}

export async function getUserById(id: string): Promise<AppUser | null> {
  return redis.hgetall<AppUser>(KEY.byId(id));
}

export async function listUsers(): Promise<SafeUser[]> {
  const ids = await redis.smembers(KEY.index);
  if (!ids.length) return [];
  const users = await Promise.all(ids.map((id) => redis.hgetall<AppUser>(KEY.byId(id))));
  return users
    .filter((u): u is AppUser => u !== null)
    .map(({ passwordHash: _ph, ...rest }) => rest)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createUser(params: {
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'user';
}): Promise<SafeUser> {
  const existing = await getUserByEmail(params.email);
  if (existing) throw new Error('USER_EXISTS');

  const id = nanoid();
  const passwordHash = await bcrypt.hash(params.password, 12);
  const user: AppUser = {
    id,
    email: params.email.toLowerCase(),
    name: params.name,
    passwordHash,
    role: params.role ?? 'user',
    createdAt: new Date().toISOString(),
  };

  await redis.hset(KEY.byId(id), user);
  await redis.set(KEY.byEmail(user.email), id);
  await redis.sadd(KEY.index, id);

  const { passwordHash: _ph, ...safe } = user;
  return safe;
}

export async function deleteUser(id: string): Promise<void> {
  const user = await getUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  await redis.del(KEY.byId(id));
  await redis.del(KEY.byEmail(user.email));
  await redis.srem(KEY.index, id);
}
