import os
import json
from typing import Dict, Any, List
from app.models.schemas import QuizSubmission, QuizResult

class EducationService:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), "..", "data", "education_modules.json")
        self.data = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        try:
            if os.path.exists(self.data_path):
                with open(self.data_path, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading education data: {e}")
        return {"modules": [], "quiz": [], "sample_scenarios": [], "reporting_steps": []}

    def get_education_content(self) -> Dict[str, Any]:
        return self.data

    def evaluate_quiz_answer(self, submission: QuizSubmission, lang: str = "en") -> QuizResult:
        quizzes = self.data.get("quiz", [])
        for q in quizzes:
            if q.get("id") == submission.question_id:
                correct_idx = q.get("correct_index", 0)
                is_correct = (submission.selected_index == correct_idx)
                expl = q.get(f"explanation_{lang}") or q.get("explanation_en", "")
                
                return QuizResult(
                    question_id=submission.question_id,
                    is_correct=is_correct,
                    correct_index=correct_idx,
                    explanation=expl
                )
        
        return QuizResult(
            question_id=submission.question_id,
            is_correct=False,
            correct_index=0,
            explanation="Question not found."
        )

education_service = EducationService()
