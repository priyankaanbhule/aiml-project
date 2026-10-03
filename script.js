const sliders = [
    ["previous_exam_score", "scoreValue"],
    ["previous_gpa", "gpaValue"],
    ["exam_preparation_days", "daysValue"],
    ["time_management_score", "timeValue"],
    ["exam_anxiety_level", "anxietyValue"]
];


// LIVE SLIDER VALUES

sliders.forEach(function(item) {

    const slider = document.getElementById(item[0]);
    const value = document.getElementById(item[1]);

    slider.addEventListener("input", function() {
        value.innerText = slider.value;
    });

});


// BOOTSTRAP TOOLTIPS

document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(function(element) {

        new bootstrap.Tooltip(element);

    });


// PREDICT

document
    .getElementById("predictionForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const alertBox =
            document.getElementById("alertBox");

        const resultText =
            document.getElementById("resultText");

        const resultDescription =
            document.getElementById("resultDescription");

        const performanceBar =
            document.getElementById("performanceBar");

        const meterValue =
            document.getElementById("meterValue");

        const button =
            document.getElementById("predictButton");


        alertBox.classList.add("d-none");


        const previousExamScore =
            Number(
                document.getElementById(
                    "previous_exam_score"
                ).value
            );

        const previousGpa =
            Number(
                document.getElementById(
                    "previous_gpa"
                ).value
            );

        const preparationDays =
            Number(
                document.getElementById(
                    "exam_preparation_days"
                ).value
            );

        const questionsAttempted =
            Number(
                document.getElementById(
                    "questions_attempted"
                ).value
            );

        const questionsCorrect =
            Number(
                document.getElementById(
                    "questions_correct"
                ).value
            );

        const timeManagement =
            Number(
                document.getElementById(
                    "time_management_score"
                ).value
            );

        const anxiety =
            Number(
                document.getElementById(
                    "exam_anxiety_level"
                ).value
            );


        // VALIDATION

        if (questionsCorrect > questionsAttempted) {

            alertBox.innerText =
                "Questions correct cannot be greater than questions attempted.";

            alertBox.classList.remove("d-none");

            return;
        }


        // LOADING

        button.disabled = true;

        button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Analyzing...';


        const data = {

            previous_exam_score:
                previousExamScore,

            previous_gpa:
                previousGpa,

            exam_preparation_days:
                preparationDays,

            questions_attempted:
                questionsAttempted,

            questions_correct:
                questionsCorrect,

            time_management_score:
                timeManagement,

            exam_anxiety_level:
                anxiety
        };


        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            if (!response.ok) {
                throw new Error("Prediction failed");
            }


            const result =
                await response.json();


            const prediction =
                result.performance_level;


            resultText.innerText =
                prediction;


            // RESULT DESCRIPTION

            if (prediction.toLowerCase() === "high") {

                resultDescription.innerText =
                    "The model predicts a high performance level.";

                performanceBar.style.width = "90%";

                meterValue.innerText = "High";

            }

            else if (
                prediction.toLowerCase() === "medium"
            ) {

                resultDescription.innerText =
                    "The model predicts a medium performance level.";

                performanceBar.style.width = "60%";

                meterValue.innerText = "Medium";

            }

            else {

                resultDescription.innerText =
                    "The model predicts a low performance level.";

                performanceBar.style.width = "30%";

                meterValue.innerText = "Low";

            }


            // ANIMATION

            resultText.animate(
                [
                    {
                        transform: "scale(.7)",
                        opacity: 0
                    },
                    {
                        transform: "scale(1)",
                        opacity: 1
                    }
                ],
                {
                    duration: 500
                }
            );

        }

        catch (error) {

            resultText.innerText =
                "Error";

            resultDescription.innerText =
                "Unable to connect to the Flask server.";

            performanceBar.style.width = "0%";

            meterValue.innerText = "0%";

        }


        button.disabled = false;

        button.innerHTML =
            '<i class="bi bi-magic"></i> Predict Performance';

    });


// RESET

function resetForm() {

    document
        .getElementById("predictionForm")
        .reset();


    document.getElementById("scoreValue").innerText = "78";

    document.getElementById("gpaValue").innerText = "3.2";

    document.getElementById("daysValue").innerText = "20";

    document.getElementById("timeValue").innerText = "75";

    document.getElementById("anxietyValue").innerText = "5";


    document.getElementById("resultText").innerText = "—";

    document.getElementById("resultDescription").innerText =
        "Enter your details and click Predict Performance.";

    document.getElementById("performanceBar").style.width =
        "0%";

    document.getElementById("meterValue").innerText =
        "0%";

    document.getElementById("alertBox")
        .classList.add("d-none");

}