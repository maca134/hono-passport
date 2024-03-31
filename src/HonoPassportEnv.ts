import type { HonoSessionEnv } from '@maca134/hono-session';


export type HonoPassportEnv<TUser = any, TSessionUser = TUser> = {
	Variables: {
		user?: TUser;
	};
} & HonoSessionEnv<{ __passport__?: { user?: TSessionUser; }; }>;
