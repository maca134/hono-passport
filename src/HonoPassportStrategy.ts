import type { Context } from 'hono';
import type { HonoPassportEnv } from './HonoPassportEnv';

export type HonoPassportStrategy<TUser = unknown> = {
	name: string;
	authenticate: (
		ctx: Context<HonoPassportEnv<TUser>>,
		complete: (user: TUser) => Promise<void>
	) => Promise<Response | void>;
};
