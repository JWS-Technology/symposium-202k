import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalQuestion from "@/models/finalQuestions.model"; // Ensure filename matches your project
import FinalAnswer from "@/models/finalAnswer.model";

export async function POST(req: NextRequest) {
  try {
    await connect();
    
    const body = await req.json();
    
    // 1. Destructure all the data sent from the frontend
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

    const bulkAnswers = [];

    // 2. Process each answer
    for (const ans of answers) {
      // Find the question to verify the correct index and marks
      const questionData = await FinalQuestion.findById(ans.questionId);

      if (questionData) {
        const isCorrect = ans.selectedOption === questionData.correctIndex;

        // 3. Push to array using the REAL data from the request body
        bulkAnswers.push({
          participantId: participantId, // From frontend
          name: name,                   // From frontend
          email: email,                 // From frontend
          teamId: teamId,               // From frontend
          eventId: questionData.eventId,// Verified from DB (Safer)
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          isCorrect,
          marksObtained: isCorrect ? questionData.marks : 0,
          violationsAtSubmission: violations || 0
        });
      }
    }

    // 4. Bulk write to database
    if (bulkAnswers.length > 0) {
      await FinalAnswer.insertMany(bulkAnswers);
    }

    return NextResponse.json({ message: "Mission Accomplished" }, { status: 200 });

  } catch (error: any) {
    console.error("Submission Error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json({ message: "Duplicate Submission Detected" }, { status: 409 });
    }
    return NextResponse.json({ message: "System Error" }, { status: 500 });
  }
}