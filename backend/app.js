const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid").v4;
const mongodb = require("mongodb");

const app = express();

app.use(bodyParser.json());
app.use(cors());

let dbName = "MentorTask";
const url = "mongodb://localhost:27017";

app.get("/api/mentor", async (req, res) => {
  let connection;
  try {
    connection = await mongodb.connect(url);
    let db = connection.db(dbName);
    let mentors = await db.collection("mentorsDB").find().toArray();
    await connection.close();
    res.status(200).json({
      mentors: mentors,
    });
  } catch (error) {
    await connection.close();
    console.log(error);
  }
  res.status(501).json({
    message: "Something went wrong"
  });
  
});

app.get("/api/student", async (req, res) => {
  let connection;
  try {
    connection = await mongodb.connect(url);
    let db = connection.db(dbName);
    let students = await db.collection("studentsDB").find().toArray();
    await connection.close();
    res.status(200).json({students: students});
  } catch (error) {
    await connection.close();
    console.log(error);
  }
  res.status(501).json({
    message: "Something went wrong"
  });
});

// ------ GET STUDENTS OF A MENTOR ----------

app.get("/api/mentor/:id", async (req, res) => {
  let mentorId = req.params.id;
  let connection;
  try {
    connection = await mongodb.connect(url);
    let db = connection.db(dbName);
    let selectedMentor = db.collection("mentorsDB").findOne({
      _id : mongodb.ObjectID(mentorId)
    });
    await connection.close();
    res.status(200).json({ students: selectedMentor.mentorStudents });
  } catch (error) {
    await connection.close();
    console.log(error);
  }
  res.status(501).json({
    message: "Something went wrong"
  });
});

// ------ ADD MENTOR -----

app.post("/api/mentor", async (req, res) => {
  let mentorName = req.body.name;
  let mentorModel = {
    name: mentorName,
    mentorStudents: [],
  };

  let connection;
  try {
    connection = await mongodb.connect(url);
    let db = connection.db(dbName);
    await db.collection("mentorsDB").insertOne(mentorModel);
    await connection.close();
    res.status(200).json({
      message: "mentor added successfully",
    });
  } catch (error) {
    await connection.close();
    console.log(error);
  }

  // mentors.push({ id: uuid(), name: mentorName, mentorStudents: [] });
  res.status(500).json({
    message: "Something went wrong"
  })
  
});

// ----- ADD STUDENT ----

app.post("/api/student", async (req, res) => {
  let studentName = req.body.name;
  let studentModel = {
    name: studentName,
    mentor: "",
  };

  let connection;
  try {
    connection = await mongodb.connect(url);
    let db = connection.db(dbName);
    await db.collection("studentsDB").insertOne(studentModel);
    await connection.close();
    res.status(200).json({
      message: "student addedd successfully",
    });
  } catch (error) {
    await connection.close();
    console.log(error);
  }

  // students.push({ id: uuid(), name: studentName, mentor: "" });
  res.status(500).json({
    message: "Something went wrong"
  })
 
});

// ------- ASSIGN A MENTOR TO STUDENTS ------

app.post("/api/mentor/:id", async (req, res) => {
  let mentorID = req.params.id;
  let studentsToAdd = req.body.students;
  let studentsArray = []
  let connection;
  try {
    connection = await mongodb.connect(url);
    let db = connection.db(dbName);
    let recievedMentor = await db.collection.("mentorsDB").findOne({
      _id: mongodb.ObjectID(mentorID)
    })
    let students = await db.collection("studentsDB").find().toArray();
    if (recievedMentor) {
      for (let i = 0; i < studentsToAdd.length; i++) {
        let currentStudent;
  
        for (let j = 0; j < students.length; j++) {
          if (students[j]._id == mongodb.ObjectID(studentsToAdd[i])) {
            studentsArray.push(students[j]);
            await db.collection("studentsDB").deleteOne({
              _id: students[j]._id
            })
            break;
          }
        }
        
      }
      await db.collection("mentorsDB").findOneAndReplace({
        _id: mongodb.ObjectID(mentorID)
      }, {
        students: studentsArray
      })
      await connection.close();
      res.status(200).json({
        message: "Mentor assigned to the student",
      });
    }
  } catch (error) {
    await connection.close();
    console.log(error);
  }
  
  res.status(500).json({
    message: "Something went wrong"
  })
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
