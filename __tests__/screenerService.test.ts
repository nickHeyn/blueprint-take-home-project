import "@testing-library/jest-dom";
import { ScreenerService } from "@/service/screener";
import { PrismaClient } from "@prisma/client";
import { DomainType } from "@/lib/client";
jest.mock("@prisma/client");

describe("Screener Service", () => {
  const mockQuestionData = [
    { id: "anxietyDomainQuestion1", title: "Question 1", domain_id: "anxietyDomain", created_at: new Date(), updated_at: new Date() },
    { id: "depressionDomainQuestion1", title: "Question 2", domain_id: "depressionDomain", created_at: new Date(), updated_at: new Date() },
    { id: "substanceAbuseDomainQuestion1", title: "Question 3", domain_id: "substanceAbuseDomain", created_at: new Date(), updated_at: new Date() },
    { id: "anxietyDomainQuestion2", title: "Question 4", domain_id: "anxietyDomain", created_at: new Date(), updated_at: new Date() },
  ];

  const mockDomainData = [
    { id: "anxietyDomain", type: DomainType.ANXIETY, level_2_assessment: { id: "a1", name: "PHQ-9", domain_id: "A", threshold: 2, threshold_inclusive: true, created_at: new Date(), updated_at: new Date() }, created_at: new Date(), updated_at: new Date() },
    { id: "depressionDomain", type: DomainType.DEPRESSION, level_2_assessment: { id: "a2", name: "PHQ-9", domain_id: "B", threshold: 2, threshold_inclusive: true, created_at: new Date(), updated_at: new Date() }, created_at: new Date(), updated_at: new Date() },
    { id: "substanceAbuseDomain", type: DomainType.SUBSTANCE_USE, level_2_assessment: { id: "a3", name: "ASSIST", domain_id: "C", threshold: 3, threshold_inclusive: false, created_at: new Date(), updated_at: new Date() }, created_at: new Date(), updated_at: new Date() }
  ];

  beforeAll(() => {
    jest.spyOn(ScreenerService.prototype, "getQuestionById").mockImplementation((id) => new Promise((resolve, reject) => {
      const question = mockQuestionData.find((question) => question.id === id);
      resolve(question ?? null);
    }));

    jest.spyOn(ScreenerService.prototype, "getDomainById").mockImplementation((id) => new Promise((resolve, reject) => {
      const domain = mockDomainData.find((domain) => domain.id === id);
      resolve(domain ?? null);
    }));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Returns the PHQ-9 assessment when the threshold score is reached from 1 domain", async () => {
    const mockPrismaClient = PrismaClient.mock.instances[0];
    const screenerService = new ScreenerService(mockPrismaClient);
    const answers = [
      { questionId: "anxietyDomainQuestion1", value: 2 },
    ];

    const result = await screenerService.calculateScreenerResult(answers);

    expect(result.results.length).toBe(1);
    expect(result.results[0]).toBe("PHQ-9");
  });

  it("Returns the PHQ-9 and ASSIST assessment when the threshold score is reached for anxiety and substance abuse domains", async () => {
    const mockPrismaClient = PrismaClient.mock.instances[0];
    const screenerService = new ScreenerService(mockPrismaClient);
    const answers = [
      { questionId: "anxietyDomainQuestion1", value: 2 },
      { questionId: "substanceAbuseDomainQuestion1", value: 4 },
    ];

    const result = await screenerService.calculateScreenerResult(answers);

    expect(result.results.length).toBe(2);
    expect(result.results).toContain("PHQ-9");
    expect(result.results).toContain("ASSIST");
  });

  it("Returns the PHQ-9 assessment when the threshold score is reached from multiple questions in the same domain", async () => {
    const mockPrismaClient = PrismaClient.mock.instances[0];
    const screenerService = new ScreenerService(mockPrismaClient);
    const answers = [
      { questionId: "anxietyDomainQuestion1", value: 1 },
      { questionId: "anxietyDomainQuestion2", value: 1 },
    ];

    const result = await screenerService.calculateScreenerResult(answers);

    expect(result.results.length).toBe(1);
    expect(result.results[0]).toBe("PHQ-9");
  });

  it("Returns only 1 PHQ-9 assessment value when the threshold score is reached from multiple questions in the different domains that map to PHQ-9", async () => {
    const mockPrismaClient = PrismaClient.mock.instances[0];
    const screenerService = new ScreenerService(mockPrismaClient);
    const answers = [
      { questionId: "anxietyDomainQuestion1", value: 3 },
      { questionId: "depressionDomainQuestion1", value: 2 },
    ];

    const result = await screenerService.calculateScreenerResult(answers);

    expect(result.results.length).toBe(1);
    expect(result.results[0]).toBe("PHQ-9");
  });

  it("Does not return PHQ-9 assessment value when the threshold score is not reached from multiple questions in the different domains that map to PHQ-9", async () => {
    const mockPrismaClient = PrismaClient.mock.instances[0];
    const screenerService = new ScreenerService(mockPrismaClient);
    const answers = [
      { questionId: "anxietyDomainQuestion1", value: 1 },
      { questionId: "depressionDomainQuestion1", value: 1 },
    ];

    const result = await screenerService.calculateScreenerResult(answers);

    expect(result.results.length).toBe(0);
  });

  it("Does not return ASSIST assessment value when the non-inclusive threshold score is not reached", async () => {
    const mockPrismaClient = PrismaClient.mock.instances[0];
    const screenerService = new ScreenerService(mockPrismaClient);
    const answers = [
      { questionId: "substanceAbuseDomainQuestion1", value: 3 },
    ];

    const result = await screenerService.calculateScreenerResult(answers);

    expect(result.results.length).toBe(0);
  });
});