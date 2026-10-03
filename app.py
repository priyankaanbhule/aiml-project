from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("studentExamPerformance.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    features = [[
        data["previous_exam_score"],
        data["previous_gpa"],
        data["exam_preparation_days"],
        data["questions_attempted"],
        data["questions_correct"],
        data["time_management_score"],
        data["exam_anxiety_level"]
    ]]

    prediction = model.predict(features)[0]

    return jsonify({
        "performance_level": prediction
    })


if __name__ == "__main__":
    app.run(debug=True)