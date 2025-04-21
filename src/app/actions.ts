"use server";

import axios from "axios";
import { ScreenerAnswer } from "./api/screener/assessment-result/validation";
import { CalculateScreenerResultResponse } from "@/service/screener/models";

export async function submitAssessment(answers: ScreenerAnswer[]): Promise<CalculateScreenerResultResponse> {
  try {
    const response = await axios.post<CalculateScreenerResultResponse>(`${process.env.API_URL}/api/screener/assessment-result`, { answers });
    return response.data;
  } catch (error) {
    console.error("Error submitting assessment", error);
    throw error;
  }
}