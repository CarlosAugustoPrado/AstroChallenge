import { z } from "zod";

export const ApiUserSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
});

export const ApiCartSchema = z.object({
	id: z.number(),
	userId: z.number(),
	totalQuantity: z.number(),
	total: z.number(),
});

export type ApiUser = z.infer<typeof ApiUserSchema>;
export type ApiCart = z.infer<typeof ApiCartSchema>;

export interface CustomerSummary {
	id: number;
	name: string;
	email: string;
	totalProducts: number;
	totalValue: number;
}
