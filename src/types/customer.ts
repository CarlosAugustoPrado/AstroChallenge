export interface ApiUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}
export interface ApiCart {
	id: number;
	userId: number;
	totalQuantity: number;
	total: number;
}
export interface CustomerSummary {
	id: number;
	name: string;
	email: string;
	totalProducts: number;
	totalValue: number;
}
