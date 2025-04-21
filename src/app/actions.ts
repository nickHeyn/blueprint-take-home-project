"use server";

import axios from "axios";
import { ScreenerAnswer } from "./api/screener/assessment-result/validation";

export async function submitAssessment(answers: ScreenerAnswer[]) {
  try {
    const response = await axios.post(`${process.env.API_URL}/api/screener/assessment-result`, { answers });
    return response.data;
  } catch (error) {
    console.error("Error submitting assessment", error);
    throw error;
  }
}