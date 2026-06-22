import CustomersClientView from "@/components/CustomersClientView";
import { fetchCustomerSummaries } from "@/services/customerService";

export const metadata = {
  title: "Astro Challenge - Clientes",
  description: "Visão consolidada de usuários e seus respectivos volumes de compra.",
};

export default async function CustomersPage() {
	let initialData = [];
	let error = null;

	try {
		initialData = await fetchCustomerSummaries();
	} catch (err: unknown) {
		error = err instanceof Error ? err.message : "Ocorreu um erro inesperado ao carregar os dados.";
	}

	return (
		<>
			{error && (
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
					<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
						<p className="text-red-700 font-medium">{error}</p>
					</div>
				</div>
			)}
			<CustomersClientView initialData={initialData} />
		</>
	);
}
