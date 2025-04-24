import type { Context } from 'hono';
import type { HonoPassportEnv } from './HonoPassportEnv';
import type { HonoPassportOptions } from './HonoPassportOptions';
import { clearUser } from './clearUser';

export async function loadUser<TUser, TSessionUser>(
	ctx: Context<HonoPassportEnv<TUser, TSessionUser>>,
	options: HonoPassportOptions<TUser, TSessionUser>
) {
	const data = ctx.var.session.data.__passport__?.user;
	if (!data) {
		return;
	}
	let user: TUser | undefined;
	if (options.deserializeUser) {
		user = await options.deserializeUser(data);
	} else {
		user = data as unknown as TUser;
	}
	if (user) {
		ctx.set('user', user);
	} else {
		clearUser(ctx);
	}
}
