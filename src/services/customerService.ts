import { ApiUser, ApiCart, CustomerSummary, ApiUserSchema, ApiCartSchema } from "../types/customer";
import { z } from "zod";

export const transformCustomerData = (users: ApiUser[], carts: ApiCart[]): CustomerSummary[] => {
	return users.map((user) => {
		const userCarts = carts.filter((cart) => cart.userId === user.id);
		const totalProducts = userCarts.reduce((acc, cart) => acc + cart.totalQuantity, 0);
		const totalValue = userCarts.reduce((acc, cart) => acc + cart.total, 0);

		return {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			totalProducts,
			totalValue,
		};
	});
};

export const fetchCustomerSummaries = async (): Promise<CustomerSummary[]> => {
	const [usersRes, cartsRes] = await Promise.all([
		fetch("https://dummyjson.com/users?limit=0"),
		fetch("https://dummyjson.com/carts?limit=0"),
	]);

	if (!usersRes.ok || !cartsRes.ok) {
		throw new Error("Falha ao obter os dados dos servidores.");
	}

	const usersData = await usersRes.json();
	const cartsData = await cartsRes.json();

	const validatedUsers = z.array(ApiUserSchema).parse(usersData.users);
	const validatedCarts = z.array(ApiCartSchema).parse(cartsData.carts);

	return transformCustomerData(validatedUsers, validatedCarts);
};
