"use server";

import axios from "axios";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { ScreenerAnswer } from "./api/screener/diagnostic/validation";
import { CalculateScreenerResultResponse } from "@/service/screener/models";

export async function submitDiagnosticScreenerAnswers(answers: ScreenerAnswer[]): Promise<CalculateScreenerResultResponse> {
  try {
    const response = await axios.post<CalculateScreenerResultResponse>(`${process.env.API_URL}/api/screener/diagnostic/submit`, { answers }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${await getVercelOidcToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting assessment", error);
    throw error;
  }
}