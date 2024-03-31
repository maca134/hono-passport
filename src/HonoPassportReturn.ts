import type { MiddlewareHandler } from 'hono';
import type { HonoPassportEnv } from './HonoPassportEnv';


export type HonoPassportReturn<TUser, TSessionUser> = {
	initialize: () => MiddlewareHandler<HonoPassportEnv<TUser, TSessionUser>>;
	login: (strategyName: string) => MiddlewareHandler<HonoPassportEnv<TUser, TSessionUser>>;
	logout: () => MiddlewareHandler<HonoPassportEnv<TUser, TSessionUser>>;
};
