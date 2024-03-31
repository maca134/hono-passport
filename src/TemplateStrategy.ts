import { Context } from "hono";
import { HonoPassportStrategy } from "./HonoPassportStrategy";


export type TemplateStrategyOptions = {
	
};

export function templateStrategy<TUser>(
	options: TemplateStrategyOptions,
	validate: (
		ctx: Context,
	) => Promise<TUser | undefined>,
): HonoPassportStrategy<TUser> {
	return {
		name: 'template',
		authenticate: async (ctx, complete) => {
			const user = await validate(ctx);
			if (user) {
				await complete(user);
			}
		},
	};
}

