import { useState, useMemo } from "react";
import { CustomerSummary } from "../types/customer";

type SortOrder = "asc" | "desc" | null;

export const useCustomers = (initialData: CustomerSummary[]) => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortOrder, setSortOrder] = useState<SortOrder>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 10;

	const processedData = useMemo(() => {
		let result = [...initialData];

		if (searchTerm) {
			result = result.filter((customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
		}

		if (sortOrder === "asc") {
			result.sort((a, b) => a.totalValue - b.totalValue);
		} else if (sortOrder === "desc") {
			result.sort((a, b) => b.totalValue - a.totalValue);
		}

		return result;
	}, [initialData, searchTerm, sortOrder]);

	const totalPages = Math.ceil(processedData.length / itemsPerPage);

	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return processedData.slice(startIndex, startIndex + itemsPerPage);
	}, [processedData, currentPage]);

	const toggleSort = () => {
		setSortOrder((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
	};
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1);
	};

	return {
		customers: paginatedData,
		searchTerm,
		setSearchTerm: handleSearchChange,
		sortOrder,
		toggleSort,
		currentPage,
		setCurrentPage,
		totalPages,
		totalItems: processedData.length,
	};
};
