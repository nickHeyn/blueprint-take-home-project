import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Box>
          <h1>Welcome to the Blueprint Diagnostic Screener</h1>
        </Box>
        <Link href="/assessment">
          <Button variant="contained">Click here to begin</Button>
        </Link>
      </Box>
    </Container>
  );
}
