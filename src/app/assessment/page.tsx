import { Screener } from "@/service/screener/models";
import axios from "axios";
import { Box, Container } from "@mui/material";
import Assessment from "@/components/Assessment";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  
  const getDiagnosticScreener = async () => {
    try {
      const response = await axios.get<Screener>(
        `${process.env.API_URL}/api/screener/diagnostic`,
      );  
      return response.data;
    }
    catch (error) { 
      console.error("Error fetching data", error);
      throw error;
    }
  };

  const screener = await getDiagnosticScreener();

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        {screener && <Assessment screener={screener} />}
      </Box>
    </Container>
  );
}
