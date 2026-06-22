"use client";

import { useCustomers } from "@/hooks/useCustomers";
import { CustomerSummary } from "@/types/customer";

interface Props {
	initialData: CustomerSummary[];
}

export default function CustomersClientView({ initialData }: Props) {
	const {
		customers,
		searchTerm,
		setSearchTerm,
		sortOrder,
		toggleSort,
		currentPage,
		setCurrentPage,
		totalPages,
		totalItems,
	} = useCustomers(initialData);

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

	const generatePagination = () => {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }).map((_, i) => i + 1);
		}

		if (currentPage <= 4) {
			return [1, 2, 3, 4, 5, "...", totalPages];
		}

		if (currentPage >= totalPages - 3) {
			return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
		}

		return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
	};

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
				<div className="sm:flex sm:items-center sm:justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clientes e Pedidos</h1>
						<p className="mt-2 text-sm text-gray-500">
							Visão consolidada de usuários e seus respectivos volumes de compra.
						</p>
					</div>
					<div className="mt-4 sm:mt-0 relative rounded-md shadow-sm">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fillRule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<input
							type="text"
							placeholder="Buscar cliente..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="focus:ring-indigo-500 text-gray-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2 border outline-none transition-all"
						/>
					</div>
				</div>

				<div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Cliente
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
										E-mail
									</th>
									<th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Qtd. Produtos
									</th>
									<th
										className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
										onClick={toggleSort}
										data-testid="sort-button"
                                    >
										<div className="flex items-center justify-end gap-1">
											Valor Total
											<span className="text-gray-400 group-hover:text-indigo-500">
												{sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : "↕"}
											</span>
										</div>
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white">
								{customers.length > 0 ? (
									customers.map((customer) => (
										<tr key={customer.id} className="hover:bg-indigo-50/50 transition-colors">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-medium">
												<span className="bg-gray-100 text-gray-700 py-1 px-3 rounded-full">
													{customer.totalProducts}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
												{formatCurrency(customer.totalValue)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={4} className="px-6 py-12 text-center text-gray-500">
											Nenhum resultado encontrado para &quot;{searchTerm}&quot;.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{totalPages > 1 && (
						<div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div className="flex-1 flex justify-center sm:justify-start">
								<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
									<button
										onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
										disabled={currentPage === 1}
										className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
										Anterior
									</button>

									{generatePagination().map((pageNumber, idx) =>
										pageNumber === "..." ? (
											<span
												key={`ellipsis-${idx}`}
												className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer">
												...
											</span>
										) : (
											<button
												key={pageNumber}
												onClick={() => setCurrentPage(pageNumber as number)}
												className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors cursor-pointer ${
													currentPage === pageNumber
														? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
														: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
												}`}>
												{pageNumber}
											</button>
										),
									)}

									<button
										onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
										disabled={currentPage === totalPages}
										className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
										Próxima
									</button>
								</nav>
							</div>

							<div className="flex justify-center sm:justify-end text-center sm:text-right">
								<p className="text-sm text-gray-700">
									Mostrando <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> a{" "}
									<span className="font-medium">{Math.min(currentPage * 10, totalItems)}</span> de{" "}
									<span className="font-medium">{totalItems}</span> resultados
								</p>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
