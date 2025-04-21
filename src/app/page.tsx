import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Link href="/assessment">
          <Button variant="contained">Begin Assessment</Button>
        </Link>
      </Box>
    </Container>
  );
}
