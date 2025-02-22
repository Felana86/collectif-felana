import { ApiService } from "../../infrastructure/providers/http/apiService";
import { Pool } from "../entities/Pool";
import { Survey } from "../entities/Survey";

const api: ApiService = new ApiService();
const dataType = "pools";

export interface PoolSurveyRepository {
    getPoolsSurveys: () => Promise<(Pool | Survey)[]>,
    getPoolsSurveysMines: () => Promise<(Pool | Survey)[]>,
    getPoolsSurveysNew: () => Promise<(Pool | Survey)[]>,
}

export class PoolSurveyService implements PoolSurveyRepository {
    getPoolsSurveys = async (): Promise<(Pool | Survey)[]> => api.get(dataType)
    getPoolsSurveysMines = async (): Promise<(Pool | Survey)[]> => api.get(`${dataType}/mines`)
    getPoolsSurveysNew = async (): Promise<(Pool | Survey)[]> => api.get(`${dataType}/new`)
}