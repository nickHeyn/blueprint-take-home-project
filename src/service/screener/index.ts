import { ScreenerAnswer } from "@/app/api/screener/diagnostic/validation";
import { CalculateScreenerResultResponse } from "./models";
import { PrismaClient } from "@/lib/client";
import { ScreenerFull } from "@/lib/types";

export class ScreenerService {
  readonly db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  /**
   * Fetches a screener question by its id
   * @param id 
   * @returns A screener question from the db or null if not found
   */
  async getQuestionById(id: string) {
    return await this.db.question.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * 
   * @param id Fetches a screener domain by its id
   * @returns A screener domain from the db or null if not found
   */
  async getDomainById(id: string) {
    return await this.db.domain.findUnique({
      where: {
        id,
      },
      include: {
        level_2_assessment: true,
      }
    });
  }

  // TODO: Add a function to get a screener by id and define the ID for the diagnostic screener

  /**
   * Returns the diagnostic screener from the db
   * @returns 
   */
  async getDiagnosticScreener(): Promise<ScreenerFull | null> {
    return await this.db.screener.findFirst({
      include: {
        sections: {
          include: {
            questions: true,
            answers: true,
          },
        },
      },
    });
  }

  /**
   * Calculates the results of the diagnostic screener based on the answers provided.
   * @param answers The answers provided by the user.
   * @returns The level 2 assessments assigned to the user based on their answers.
   */
  async calculateDiagnosticScreenerResult(answers: ScreenerAnswer[]): Promise<CalculateScreenerResultResponse> {
    const domainToScoreMap = new Map<string, number>();
    for (const answer of answers) {
      const question = await this.getQuestionById(answer.questionId);
      if(!question) {
        const errorMessage = `Question with id ${answer.questionId} not found`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      domainToScoreMap.set(question.domain_id, (domainToScoreMap.get(question.domain_id) ?? 0) + answer.value);
    }

    const assessmentResults = new Set<string>();
    for (const [domainId, score] of domainToScoreMap.entries()) {
      const domain = await this.getDomainById(domainId);
      if (!domain) {
        const errorMessage = `Domain with id ${domainId} not found`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if(!domain.level_2_assessment) {
        const errorMessage = `Domain with id ${domainId} does not have level 2 assessment`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const threshold = domain.level_2_assessment.threshold;
      if((domain.level_2_assessment.threshold_inclusive && score >= threshold) || score > threshold) {
        assessmentResults.add(domain.level_2_assessment.name);
      }
    }

    return {
      results: [...assessmentResults],
    };
  }
}