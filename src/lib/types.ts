import { Prisma } from "./client";

export type SectionFull = Prisma.SectionGetPayload<{
  include: { 
    questions: true;
    answers: true;
  };
}>;

export type ScreenerFull = Prisma.ScreenerGetPayload<{
  include: {
    sections: {
      include: {
        questions: true;
        answers: true;
      };
    };
  };
}>;