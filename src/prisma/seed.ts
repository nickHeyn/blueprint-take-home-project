import { DomainType, PrismaClient } from "../../generated/client";
const prisma = new PrismaClient();
async function main() {

  const questions = [{
    title: "Little interest or pleasure in doing things?",
    domain: DomainType.DEPRESSION,
  },
  {
    title: "Feeling down, depressed, or hopeless?",
    domain: DomainType.ANXIETY,
  },
  {
    title: "Sleeping less than usual, but still have a lot of energy?",
    domain: DomainType.MANIA,
  },
  {
    title: "Starting lots more projects than usual or doing more risky things than usual?",
    domain: DomainType.MANIA,
  },
  {
    title: "Feeling nervous, anxious, frightened, worried, or on edge?",
    domain: DomainType.ANXIETY,
  },
  {
    title: "Feeling panic or being frightened?",
    domain: DomainType.ANXIETY,
  },
  {
    title: "Avoiding situations that make you feel anxious?",
    domain: DomainType.ANXIETY,
  },
  {
    title: "Drinking at least 4 drinks of any kind of alcohol in a single day?",
    domain: DomainType.SUBSTANCE_USE,
  }
  ];

  const answers = [{
    title: "Not at all",
    value: 0,
  },
  {
    title: "Rare, less than a day or two",
    value: 1,
  },
  {
    title: "Several days",
    value: 2,
  },
  {
    title: "More than half the days",
    value: 3,
  },
  {
    title: "Nearly every day",
    value: 4,
  }
]

  const createQuestion = async (title: string, domainId: string, sectionIds: string[]) => {
    return await prisma.question.create({
      data: {
        title,
        domain: {
          connect: {
            id: domainId
          }
        },
        sections: {
          connect: sectionIds.map((id) => {
            return { id }
          })
        }
      }
    })
  }

  const createAnswer = async (title: string, value: number, sectionIds: string[]) => {
    return await prisma.answer.create({
      data: {
        title,
        value,
        sections: {
          connect: sectionIds.map((id) => {
            return { id }
          })
        }
      }
    })
  }

  const screener = await prisma.screener.create({
    data: {
      name: 'BDPS',
      disorder: "Cross-Cutting",
      full_name: "Blueprint Diagnostic Screener"
    }
  });

  const section = await prisma.section.create({
    data: {
      title: "During the past TWO (2) WEEKS, how much (or how often) have you been bothered by any of the following problems?",
      display_name: "BDS",
      screeners: {
        connect: {
          id: screener.id
        },
      },
      type: "STANDARD"
    }
  });

  const domainMap = new Map<string, string>();
 for (const domain of Object.values(DomainType)) {
    const domainRecord = await prisma.domain.create({
      data: {
        type: domain,
      }
    });
    console.log(`Domain ${domain} created with id ${domainRecord.id}`);
    domainMap.set(domain, domainRecord.id);
 }

  questions.forEach(async (question) => {
    const domainId = domainMap.get(question.domain)!;
    createQuestion(question.title, domainId, [section.id]);
  });

  answers.forEach(async (answer) => {
    createAnswer(answer.title, answer.value, [section.id]);
  });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })