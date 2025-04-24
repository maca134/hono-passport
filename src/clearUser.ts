import type { Context } from 'hono';


export function clearUser(ctx: Context) {
	const session = ctx.var.session.data;
	if (session.__passport__) {
		session.__passport__.user = undefined;
	}
}
