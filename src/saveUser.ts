import type { Context } from 'hono';
import type { HonoPassportEnv } from './HonoPassportEnv';
import type { HonoPassportOptions } from './HonoPassportOptions';

export async function saveUser<TUser, TSessionUser>(
	ctx: Context<HonoPassportEnv<TUser, TSessionUser>>,
	user: TUser,
	options: HonoPassportOptions<TUser, TSessionUser>
) {
	let data: TSessionUser;
	if (options.serializeUser) {
		data = await options.serializeUser(user);
	} else {
		data = user as unknown as TSessionUser;
	}
	if (data) {
		ctx.var.session.data.__passport__ = { user: data };
	}
	await ctx.var.session.regenerate();
	ctx.set('user', user);
}
