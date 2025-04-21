import { Answer, Question, SectionType } from "@/lib/client";
import { Screener as ServiceScreener } from "./models";
import { ScreenerFull, SectionFull } from "@/lib/types";

const mapSectionType = (type: SectionType): "standard" => {
  switch (type) {
  case "STANDARD":
    return "standard";
  default:
    const exhaustiveCheck: never = type;
    throw new Error(`Unhandled section type: ${exhaustiveCheck}`);
  }
};

export const mapDbScreenerToServiceScreener = (dbScreener: ScreenerFull): ServiceScreener => {
  return {
    id: dbScreener.id,
    name: dbScreener.name,
    disorder: dbScreener.disorder,
    content: {
      sections: dbScreener.sections.map((section: SectionFull) => ({
        type: mapSectionType(section.type),
        title: section.title,
        questions: section.questions.map((question: Question) => ({
          questionId: question.id,
          title: question.title
        })),
        answers: section.answers.map((answer: Answer) => ({
          title: answer.title,
          value: answer.value
        }))
      })),
      displayName: dbScreener.display_name,
    }
  };
};