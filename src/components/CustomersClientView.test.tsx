import { render, screen, fireEvent } from "@testing-library/react";
import CustomersClientView from "./CustomersClientView";
import { CustomerSummary } from "../types/customer";

const mockData: CustomerSummary[] = [
    { id: 1, name: "Alice Brown", email: "alice@test.com", totalProducts: 3, totalValue: 150 },
    { id: 2, name: "Bob Smith", email: "bob@test.com", totalProducts: 5, totalValue: 500 },
    { id: 3, name: "Charlie Davis", email: "charlie@test.com", totalProducts: 1, totalValue: 50 },
];

describe("CustomersClientView", () => {
    it("deve renderizar a tabela com os dados iniciais corretamente", () => {
        render(<CustomersClientView initialData={mockData} />);
        
        expect(screen.getByText("Alice Brown")).toBeInTheDocument();
        expect(screen.getByText("Bob Smith")).toBeInTheDocument();
        expect(screen.getByText("Charlie Davis")).toBeInTheDocument();
    });

    it("deve filtrar os clientes ao usar o campo de busca", () => {
        render(<CustomersClientView initialData={mockData} />);
        
        const searchInput = screen.getByPlaceholderText("Buscar cliente...");
        fireEvent.change(searchInput, { target: { value: "Alice" } });

        expect(screen.getByText("Alice Brown")).toBeInTheDocument();
        expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
        expect(screen.queryByText("Charlie Davis")).not.toBeInTheDocument();
    });

    it("deve ordenar os clientes pelo valor total de compras", () => {
        render(<CustomersClientView initialData={mockData} />);
        
        const sortButton = screen.getByTestId("sort-button");
        
        // Clique para ordenação ascendente (menor pro maior)
        fireEvent.click(sortButton);
        
        let rows = screen.getAllByRole("row");
        // O index 0 é o cabeçalho (thead)
        expect(rows[1]).toHaveTextContent("Charlie Davis"); // 50
        expect(rows[2]).toHaveTextContent("Alice Brown"); // 150
        expect(rows[3]).toHaveTextContent("Bob Smith"); // 500

        // Clique novamente para ordenação descendente (maior pro menor)
        fireEvent.click(sortButton);
        rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Bob Smith"); // 500
        expect(rows[2]).toHaveTextContent("Alice Brown"); // 150
        expect(rows[3]).toHaveTextContent("Charlie Davis"); // 50
    });
});
