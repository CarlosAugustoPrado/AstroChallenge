import { useState, useEffect, useMemo } from "react";
import { CustomerSummary } from "../types/customer";
import { fetchCustomerSummaries } from "../services/customerService";

export const useCustomers = () => {
	const [data, setData] = useState<CustomerSummary[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const consolidatedData = await fetchCustomerSummaries();
				setData(consolidatedData);
				setError(null);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Ocorreu um erro inesperado.");
				}
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const filteredCustomers = useMemo(() => {
		if (!searchTerm) return data;
		return data.filter((customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
	}, [data, searchTerm]);

	return {
		customers: filteredCustomers,
		loading,
		error,
		searchTerm,
		setSearchTerm,
	};
};
