import api from "./api";

export interface DashboardData {
    totalWorkOrders: number;
    created: number;
    assigned: number;
    inProgress: number;
    done: number;
}

export const getDashboardData = async (): Promise<DashboardData> => {

    const response = await api.get<DashboardData>("/api/dashboard");

    return response.data;
};