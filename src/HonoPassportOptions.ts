import type { Awaitable } from './Awaitable';
import type { HonoPassportStrategy } from './HonoPassportStrategy';

export type HonoPassportOptions<TUser, TSessionUser> = {
	strategies: HonoPassportStrategy<TUser>[];
	serializeUser?: (user: TUser) => Awaitable<TSessionUser>;
	deserializeUser?: (user: TSessionUser) => Awaitable<TUser | undefined>;
};
