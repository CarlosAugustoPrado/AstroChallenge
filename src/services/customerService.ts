import { ApiUser, ApiCart, CustomerSummary } from "../types/customer";

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
		throw new Error("Falha ao obter os dados dos servidores. Tente novamente mais tarde.");
	}

	const usersData = (await usersRes.ok) ? await usersRes.json() : { users: [] };
	const cartsData = (await cartsRes.ok) ? await cartsRes.json() : { carts: [] };

	return transformCustomerData(usersData.users, cartsData.carts);
};
