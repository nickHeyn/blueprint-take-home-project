"use client";

import { Screener } from "@/service/screener/models";
import Button from "@mui/material/Button";
import { Alert, Box, Container } from "@mui/material";
import React, { useState } from "react";
import { ScreenerAnswer } from "@/app/api/screener/diagnostic/validation";
import Section from "./Section";
import { submitDiagnosticScreenerAnswers } from "@/app/actions";
import Link from "next/link";
import Loader from "./Loader";

interface AssessmentProps {
  readonly screener: Screener;
};

const Assessment = (props: AssessmentProps) => {
  const [currentSectionNumber, setCurrentSectionNumber] = useState(0);
  const [allAnswers, setAllAnswers] = useState<ScreenerAnswer[]>([]);
  const [assignedLevel2Assessments, setAssignedLevel2Assessments] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentSection = () => {
    return props.screener.content.sections[currentSectionNumber];
  };

  const onFinishSection = (sectionAnswers: ScreenerAnswer[]) => {
    setAllAnswers([
      ...allAnswers,
      ...sectionAnswers,
    ]);
    setCurrentSectionNumber(currentSectionNumber + 1);
  };

  const onFinishAssessment = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const response = await submitDiagnosticScreenerAnswers(allAnswers);
      setAssignedLevel2Assessments(response.results);
    }
    catch (error) {
      console.error("Error submitting assessment", error);
      setError("An error occurred while submitting the assessment. Please try again later.");
    }
    finally {
      setIsLoading(false);
    }
  };


  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "flex-start", minHeight: "100vh" }}>
      <h1>
        {props.screener.content.displayName}
      </h1>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {isLoading && (
        <Loader />
      )}

      {assignedLevel2Assessments === null && !isLoading && (
        <>
          {currentSectionNumber < props.screener.content.sections.length ? (
            <Section section={getCurrentSection()} onFinishSection={onFinishSection} sectionNumber={currentSectionNumber + 1} />
          ) : (
            <>
              <h3>Assessment Completed. Please submit responses below.</h3>
              <Button variant="contained" onClick={onFinishAssessment}>
                Submit Assessment
              </Button>
            </>
          )}
        </>
      )}

      {assignedLevel2Assessments && !isLoading !== null && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
          <h2>Assigned Level 2 Assessments</h2>
          <>
            {assignedLevel2Assessments.length === 0 && (
              <p>
                No Level 2 Assessments assigned.
              </p>
            )}
          </>
          <ul style={{ paddingLeft: 15 }}>
            {assignedLevel2Assessments?.map((assessment) => (
              <li key={assessment}>
                {assessment}
              </li>
            ))}
          </ul>
          <Link href="/">
            <Button variant="contained">
                Start Over
            </Button>
          </Link>
        </Box>
      )}
    </Container>
  );
};

export default Assessment;
