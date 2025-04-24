import type { Context } from 'hono';
import { HonoPassportEnv } from './HonoPassportEnv';

export function clearUser<TUser, TSessionUser>(ctx: Context<HonoPassportEnv<TUser, TSessionUser>>) {
	ctx.var.session.data.__passport__ = undefined;
}
