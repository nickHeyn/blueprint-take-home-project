"use client";

import { ScreenerAnswer } from "@/service/screener/models";
import Button from "@mui/material/Button";
import { Box, Container } from "@mui/material";
import React from "react";

interface QuestionProps {
  readonly title: string;
  readonly id: string;
  readonly questionNumber: number;
  readonly maxQuestionNumber: number;
  readonly possibleAnswers: ScreenerAnswer[];
  readonly onAnswer: (questionId: string, answerVal: number) => void;
  readonly isLastQuestion: boolean;
};

const Question = (props: QuestionProps) => {
  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Box>
        {`${props.questionNumber} of ${props.maxQuestionNumber}`}
      </Box>
      <Box>
        {props.title}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start", justifyContent: "flex-start", minHeight: "100vh" }}>
        {props.possibleAnswers.map((answer, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => props.onAnswer(props.id, answer.value)}
          >
            {answer.title}
          </Button>
        ))}
      </Box>
    </Container>
  );
};

export default Question;
