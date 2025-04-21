import { mapDbScreenerToServiceScreener } from "@/service/screener/mapping";
import screenerService from "@/service/screener/service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

  const screener = await screenerService.getScreener();

  if(!screener) {
    return Response.json({ error: "Screener not found" }, {
      status: 404,
    });
  }

  return Response.json(mapDbScreenerToServiceScreener(screener), {
    status: 200,
  });
}
