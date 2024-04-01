import type { Context } from 'hono';
import type { HonoPassportOptions } from './HonoPassportOptions';
import type { HonoPassportReturn } from './HonoPassportReturn';
import { PassportError } from './PassportError';
import { loadUser } from './loadUser';
import { saveUser } from './saveUser';

export function passport<TUser, TSessionUser = TUser>(
	options: HonoPassportOptions<TUser, TSessionUser>
): HonoPassportReturn<TUser, TSessionUser> {
	if (!options.strategies || options.strategies.length === 0) {
		throw new PassportError('No strategies found');
	}

	if (
		(options.serializeUser && !options.deserializeUser) ||
		(!options.serializeUser && options.deserializeUser)
	) {
		throw new PassportError(
			'serializeUser and deserializeUser must be both defined or neither defined'
		);
	}

	return {
		initialize: () => async (ctx, next) => {
			if (!ctx.var.session) {
				throw new PassportError('Session not initialized');
			}
			await loadUser(ctx, options);
			await next();
		},
		login: (strategyName) => {
			const strategy = options.strategies.find((s) => s.name === strategyName);
			if (!strategy) {
				throw new PassportError('Strategy not found');
			}
			return async (ctx, next) => {
				const response = await strategy.authenticate(ctx as Context, (user) =>
					saveUser(ctx, user, options)
				);
				if (response) {
					return response;
				}
				await next();
			};
		},
		logout: () => (ctx, next) => {
			const session = ctx.var.session.data;
			if (session.__passport__) {
				session.__passport__ = undefined;
			}
			return next();
		},
	};
}
