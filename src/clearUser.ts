import type { Context } from 'hono';
import { HonoPassportEnv } from './HonoPassportEnv';

export function clearUser<TUser, TSessionUser>(ctx: Context<HonoPassportEnv<TUser, TSessionUser>>) {
	const session = ctx.var.session.data;
	if (session.__passport__) {
		session.__passport__.user = undefined;
	}
	session.__passport__ = undefined;
}
