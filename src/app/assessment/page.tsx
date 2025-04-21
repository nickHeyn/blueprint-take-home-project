import { Screener } from "@/service/screener/models";
import axios from "axios";
import { Box, Container } from "@mui/material";
import Assessment from "@/components/Assessment";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const getData = async () => {
    // Fetch data from external API
    try {
      const response = await axios.get<Screener>(
        `${process.env.API_URL}/api/screener`,
      );  
      return response.data;
    }
    catch (error) { 
      console.error("Error fetching data", error);
      throw error;
    }
  };

  const data = await getData();

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        {data && <Assessment screener={data} />}
      </Box>
    </Container>
  );
}
