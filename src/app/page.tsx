"use client";

import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
	const { customers, loading, error, searchTerm, setSearchTerm } = useCustomers();

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

	return (
		<main className="max-w-5xl mx-auto p-6 font-sans">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">Resumo de Clientes e Pedidos</h1>

			<div className="mb-6">
				<input
					type="text"
					placeholder="Buscar por nome do cliente..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{loading && (
				<div className="flex items-center justify-center p-10">
					<p className="text-gray-600 font-medium animate-pulse">Carregando dados dos clientes...</p>
				</div>
			)}

			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
					<p className="text-red-700">{error}</p>
				</div>
			)}

			{!loading && !error && (
				<div className="overflow-x-auto bg-white rounded-lg shadow">
					<table className="min-w-full text-left text-sm whitespace-nowrap">
						<thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600">
							<tr>
								<th className="px-6 py-4">Cliente</th>
								<th className="px-6 py-4">E-mail</th>
								<th className="px-6 py-4">Qtd. Total de Produtos</th>
								<th className="px-6 py-4">Valor Total das Compras</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{customers.length > 0 ? (
								customers.map((customer) => (
									<tr key={customer.id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
										<td className="px-6 py-4 text-gray-500">{customer.email}</td>
										<td className="px-6 py-4">{customer.totalProducts}</td>
										<td className="px-6 py-4">{formatCurrency(customer.totalValue)}</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className="px-6 py-4 text-center text-gray-500">
										Nenhum cliente encontrado para &quot;{searchTerm}&quot;.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</main>
	);
}
