import { transformCustomerData } from "./customerService";
import { ApiUser, ApiCart } from "../types/customer";

describe("customerService", () => {
    it("deve transformar usuários e carrinhos corretamente, consolidando quantidades e valores", () => {
        const mockUsers: ApiUser[] = [
            { id: 1, firstName: "John", lastName: "Doe", email: "john@test.com" },
            { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@test.com" }
        ];

        const mockCarts: ApiCart[] = [
            { id: 101, userId: 1, totalQuantity: 5, total: 100 },
            { id: 102, userId: 1, totalQuantity: 2, total: 50 },
            { id: 103, userId: 2, totalQuantity: 10, total: 300 }
        ];

        const result = transformCustomerData(mockUsers, mockCarts);

        expect(result).toHaveLength(2);
        
        expect(result[0]).toEqual({
            id: 1,
            name: "John Doe",
            email: "john@test.com",
            totalProducts: 7, // 5 + 2
            totalValue: 150   // 100 + 50
        });

        expect(result[1]).toEqual({
            id: 2,
            name: "Jane Smith",
            email: "jane@test.com",
            totalProducts: 10,
            totalValue: 300
        });
    });

    it("deve lidar corretamente com usuários que não possuem carrinhos", () => {
        const mockUsers: ApiUser[] = [
            { id: 1, firstName: "John", lastName: "Doe", email: "john@test.com" }
        ];
        const mockCarts: ApiCart[] = [];

        const result = transformCustomerData(mockUsers, mockCarts);

        expect(result[0].totalProducts).toBe(0);
        expect(result[0].totalValue).toBe(0);
    });
});
