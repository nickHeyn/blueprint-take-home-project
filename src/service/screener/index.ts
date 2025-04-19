import { ScreenerAnswer } from "@/app/api/screener/[id]/assessment-result/validation";
import { CalculateScreenerResultResponse } from "./models";
import { PrismaClient } from "@/lib/client";

export class ScreenerService {
  readonly db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getQuestionById(id: string) {
    return await this.db.question.findUnique({
      where: {
        id,
      },
    });
  }

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

  async calculateScreenerResult(answers: ScreenerAnswer[]): Promise<CalculateScreenerResultResponse> {
    const domainToScoreMap = new Map<string, number>();
    for (const answer of answers) {
      const question = await this.getQuestionById(answer.questionId);
      if(!question) {
        throw new Error(`Question with id ${answer.questionId} not found`);
      }

      domainToScoreMap.set(question.domain_id, (domainToScoreMap.get(question.domain_id) ?? 0) + answer.value);
    }

    const assessmentResults = new Set<string>();
    for (const [domainId, score] of domainToScoreMap.entries()) {
      const domain = await this.getDomainById(domainId);
      if (!domain) {
        throw new Error(`Domain with id ${domainId} not found`);
      }

      if(!domain.level_2_assessment) {
        throw new Error(`Domain with id ${domainId} does not have level 2 assessment`);
      }

      const threshold = domain.level_2_assessment.threshold;
      if((domain.level_2_assessment.threhold_inclusive && score >= threshold) || score > threshold) {
        assessmentResults.add(domain.level_2_assessment.name);
        console.log("Added");
      }
    }

    return {
      results: [...assessmentResults],
    };
  }
}