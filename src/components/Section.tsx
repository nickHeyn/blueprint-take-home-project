"use client";

import { ScreenerSection } from "@/service/screener/models";
import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import { ScreenerAnswer } from "@/app/api/screener/diagnostic/validation";
import Question from "./Question";

interface AssessmentProps {
  readonly section: ScreenerSection;
  readonly sectionNumber: number;
  readonly onFinishSection: (sectionAnswers: ScreenerAnswer[]) => void;
};

const Section = (props: AssessmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState<ScreenerAnswer[]>([]);

  const getCurrentQuestion = () => {
    const question = props.section.questions[currentQuestionIndex];

    return (
      <Question 
        title={question.title} 
        id={question.questionId} 
        questionNumber={currentQuestionIndex + 1}
        maxQuestionNumber={props.section.questions.length}
        possibleAnswers={props.section.answers} 
        isLastQuestion={currentQuestionIndex >= props.section.questions.length - 1} 
        onAnswer={onAnswerQuestion}
      />
    );
  };

  const onAnswerQuestion = (questionId: string, answerVal: number) => {
    setAnswers([
      ...answers,
      {
        questionId,
        value: answerVal,
      }
    ]);

    if(currentQuestionIndex >= props.section.questions.length - 1) {
      props.onFinishSection(answers);
    }
    setCurrentQuestionNumber(currentQuestionIndex + 1);
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Box>
        <h3>
          {props.section.title}
        </h3>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start", justifyContent: "flex-start", minHeight: "100vh" }}>
        {currentQuestionIndex < props.section.questions.length ? getCurrentQuestion() : <>No More Questions</>}
      </Box>
    </Container>
  );
};

export default Section;