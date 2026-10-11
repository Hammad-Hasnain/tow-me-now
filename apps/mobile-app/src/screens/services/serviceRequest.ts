import apiClient from '../api/apiClient';

export interface ServiceRequestPayload {
    userId: string;
    vehicle: string;
    model: string;
    problem: string;
    vehicleNo: string;
    pickupLoc: {
        latitude: number;
        longitude: number;
        address: string;
    };
    dropoffLoc: {
        latitude: number;
        longitude: number;
        address: string;
    };
}

export const serviceRequestService = {
    createRequest: async (payload: ServiceRequestPayload) => {
        try {
            const response = await apiClient.post('/service-request', payload);
            console.log("Full Axios Response:", response);
            return response.data ? response.data : response;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to create service request';
            throw errorMsg;
        }
    },

    getAvailableDrivers: async (requestId: string) => {
        try {
            const response = await apiClient.get(`/service-request/${requestId}/available-drivers`);
            return response.data ? response.data : response;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch available drivers';
            throw errorMsg;
        }
    },
};