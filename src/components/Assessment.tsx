"use client";

import { Screener } from "@/service/screener/models";
import Button from "@mui/material/Button";
import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import { ScreenerAnswer } from "@/app/api/screener/assessment-result/validation";
import Section from "./Section";
import axios from "axios";
import { submitAssessment } from "@/app/actions";

interface AssessmentProps {
  readonly screener: Screener;
};

const Assessment = (props: AssessmentProps) => {
  const [currentSectionNumber, setCurrentSectionNumber] = useState(0);
  const [allAnswers, setAllAnswers] = useState<ScreenerAnswer[]>([]);

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
    const level2Assessment = submitAssessment(allAnswers);
    console.log("Level 2 Assessment: " + JSON.stringify(level2Assessment));
  };


  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Box>
        <h1>
          {props.screener.content.displayName}
        </h1>
      </Box>
      <Box>
        {currentSectionNumber < props.screener.content.sections.length ? (
          <Section section={getCurrentSection()} onFinishSection={onFinishSection} sectionNumber={currentSectionNumber + 1} />
        ) : (
          <Button variant="contained" onClick={onFinishAssessment}>
            Submit Assessment
          </Button>
        )}
        
      </Box>
    </Container>
  );
};

export default Assessment;
