import prisma from "@/lib/prisma";
import { ScreenerService } from ".";

const screenerService = new ScreenerService(prisma);

export default screenerService;