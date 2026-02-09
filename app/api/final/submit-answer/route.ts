import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalQuestion from "@/models/finalQuestions.model";
import FinalAnswer from "@/models/finalAnswer.model";

export async function POST(req: NextRequest) {
  try {
    await connect();
    
    const body = await req.json();
    
    const { 
      answers, 
      violations, 
      participantId, 
      name, 
      email, 
      teamId 
    } = body; 

    // Basic Validation
    if (!answers || !participantId || !email) {
      return NextResponse.json(
        { message: "Invalid submission data: Missing required fields" }, 
        { status: 400 }
      );
    }

    // 1. Process answers into an array (Local Calculation)
    const processedAnswers = [];
    let totalScore = 0;
    let eventId = null;

    for (const ans of answers) {
      const questionData = await FinalQuestion.findById(ans.questionId);

      if (questionData) {
        // Capture eventId from the first valid question found
        if (!eventId) eventId = questionData.eventId;

        const isCorrect = ans.selectedOption === questionData.correctIndex;
        const marks = isCorrect ? questionData.marks : 0;

        totalScore += marks;

        // Push to the array that will be saved in the document
        processedAnswers.push({
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          isCorrect,
          marksObtained: marks,
        });
      }
    }

    // 2. Save ONE single document containing the array
    // This matches your updated "FinalAnswer" model
    await FinalAnswer.create({
      participantId,
      name,
      email,
      teamId,
      eventId, 
      answers: processedAnswers, // <--- The array of answers
      totalScore,                // <--- Calculated total
      violations: violations || 0
    });

    return NextResponse.json({ message: "Mission Accomplished" }, { status: 200 });

  } catch (error: any) {
    console.error("Submission Error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json({ message: "Duplicate Submission Detected" }, { status: 409 });
    }
    return NextResponse.json({ message: "System Error: " + error.message }, { status: 500 });
  }
}