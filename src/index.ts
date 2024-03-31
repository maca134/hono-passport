import type { Context, MiddlewareHandler } from 'hono';

export type HonoPassportEnv<TUser = any, TSessionUser = TUser> = {
	Variables: {
		user?: TUser;
		session: {
			data: {
				__passport__?: {
					user?: TSessionUser;
				};
			};
		};
	};
};

export type Awaitable<T> = T | Promise<T>;

export type HonoPassportStrategy<TUser = any> = {
	name: string;
	authenticate: (ctx: Context<HonoPassportEnv<TUser>>, complete: (user: TUser) => Promise<void>) => Promise<Response | undefined>;
};

export type HonoPassportOptions<TUser, TSessionUser> = {
	strategies: HonoPassportStrategy<TUser>[];
	serializeUser?: (user: TUser) => Awaitable<TSessionUser>;
	deserializeUser?: (user: TSessionUser) => Awaitable<TUser | undefined>;
};

export type HonoPassportReturn<TUser, TSessionUser> = {
	initialize: () => MiddlewareHandler<HonoPassportEnv<TUser, TSessionUser>>;
	login: (strategyName: string) => MiddlewareHandler<HonoPassportEnv<TUser, TSessionUser>>;
	logout: () => MiddlewareHandler<HonoPassportEnv<TUser, TSessionUser>>;
};

export class PassportError extends Error { }

async function loadUser<TUser, TSessionUser>(
	ctx: Context<HonoPassportEnv<TUser, TSessionUser>>,
	options: HonoPassportOptions<TUser, TSessionUser>,
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
		delete ctx.var.session.data.__passport__;
	}
}

async function saveUser<TUser, TSessionUser>(
	ctx: Context<HonoPassportEnv<TUser, TSessionUser>>,
	user: TUser,
	options: HonoPassportOptions<TUser, TSessionUser>,
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
	ctx.set('user', user);
}

export function passport<TUser, TSessionUser = TUser>(
	options: HonoPassportOptions<TUser, TSessionUser>,
): HonoPassportReturn<TUser, TSessionUser> {
	if (!options.strategies || options.strategies.length === 0) {
		throw new PassportError('No strategies found');
	}

	if (
		(options.serializeUser && !options.deserializeUser) ||
		(!options.serializeUser && options.deserializeUser)
	) {
		throw new PassportError(
			'serializeUser and deserializeUser must be both defined or neither defined',
		);
	}

	return {
		initialize: () => async (ctx, next) => {
			console.log('passport initialize');
			if (!ctx.var.session) {
				throw new PassportError('Session not initialized');
			}
			await loadUser(ctx, options);
			await next();
		},
		login: (strategyName) => {
			console.log('passport login');
			const strategy = options.strategies.find(
				(s) => s.name === strategyName,
			);
			if (!strategy) {
				throw new PassportError('Strategy not found');
			}
			return async (ctx, next) => {
				console.log('passport login req');
				const response = await strategy.authenticate(ctx as Context, (user) => saveUser(ctx, user, options));
				if (response) {
					return response;
				}
				await next();
			};
		},
		logout: () => (ctx, next) => {
			console.log('passport logout');
			const session = ctx.var.session.data;
			if (session.__passport__) {
				session.__passport__ = undefined;
			}
			return next();
		},
	};
}
