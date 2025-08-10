import { apiClient } from './ApiClient';
import { DeductionEstimateResponse, AllowanceDto } from '../models/market';

export interface DeductionEstimateRequest {
  canton: string;
  year: number;
  grossIncome: number;
  pillar3aContributions: number;
}

class TaxService {
  estimateDeductions(request: DeductionEstimateRequest) {
    return apiClient.post<DeductionEstimateResponse>('/v1/deductions/estimate', request);
  }

  getAllowances(canton: string, year: number) {
    return apiClient.get<AllowanceDto>(`/v1/allowances/${canton}/${year}`);
  }
}

export const taxService = new TaxService();
export default TaxService;
