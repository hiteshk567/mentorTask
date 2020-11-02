const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid").v4;

const app = express();

app.use(bodyParser.json());
app.use(cors());

let mentors = [];
let students = [];

app.get("/api/mentor", (req, res) => {
  res.status(200).json({
    mentors: mentors,
  });
});

app.get("/api/student", (req, res) => {
  res.status(200).json({
    students: students,
  });
});

// ------ GET STUDENTS OF A MENTOR ----------

app.get("/api/mentor/:id", (req, res) => {
  let mentorId = req.params.id;
  let selectedMentor = mentors.find((mentor) => mentor.id == mentorId);
  console.log(selectedMentor.mentorStudents);
  res.status(200).json({ students: selectedMentor.mentorStudents });
});

// ------ ADD MENTOR -----

app.post("/api/mentor", (req, res) => {
  let mentorName = req.body.name;
  mentors.push({ id: uuid(), name: mentorName, mentorStudents: [] });

  res.status(200).json({
    message: "mentor added successfully",
  });
});

// ----- ADD STUDENT ----

app.post("/api/student", (req, res) => {
  let studentName = req.body.name;
  students.push({ id: uuid(), name: studentName, mentor: "" });

  res.status(200).json({
    message: "student addedd successfully",
  });
});

// ------- ASSIGN A MENTOR TO STUDENTS ------

app.post("/api/mentor/:id", (req, res) => {
  let mentorID = req.params.id;
  let studentsToAdd = req.body.students;
  console.log(studentsToAdd);
  let recievedMentor = mentors.find((mentor) => mentor.id === mentorID);
  if (recievedMentor) {
    for (let i = 0; i < studentsToAdd.length; i++) {
      let currentStudent;

      for (let j = 0; j < students.length; j++) {
        if (students[j].id == studentsToAdd[i]) {
          currentStudent = students[j];
          students.splice(j, 1);
          break;
        }
      }
      recievedMentor.mentorStudents.push({
        studentId: currentStudent.id,
        studentName: currentStudent.name,
      });
    }

    res.status(200).json({
      message: "Mentor assigned to the student",
    });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
