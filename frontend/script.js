// ----------- FUNCTIONS FOR DOM ELEMENTS ---------------

let createDiv = (className, text) => {
  let element = document.createElement("div");
  element.className = className;
  if (text) element.innerHTML = text;
  return element;
};

let createRadio = (id, name) => {
  let element = document.createElement("input");
  element.type = "radio";
  element.id = id;
  element.name = name;
  element.value = id;
  return element;
};

let createLabel = (forName, text) => {
  let element = document.createElement("label");
  element.setAttribute("for", forName);
  element.innerHTML = text;
  return element;
};

let createCheckbox = (id, name) => {
  let element = document.createElement("input");
  element.type = "checkbox";
  element.value = id;
  element.id = id;
  element.setAttribute("name", name);
  return element;
};

// --------- NEW MENTOR -------------

let submitMentor = async () => {
  let name = document.querySelector("#mentorName").value;
  let data = await fetch("http://localhost:3000/api/mentor", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// --------- NEW STUDENT -------------

let submitStudent = async () => {
  let name = document.querySelector("#studentName").value;
  let data = await fetch("http://localhost:3000/api/student", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// --------- GET ALL MENTORS -----

let getMentors = async () => {
  let responseData = await fetch("http://localhost:3000/api/mentor");
  let data = await responseData.json();

  let mentorsDiv = document.querySelector("#availableMentors");
  mentorsDiv.innerHTML = "";
  for (let i = 0; i < data.mentors.length; i++) {
    let col = createDiv("col-12");
    let radioButton = createRadio(data.mentors[i].id, "mentor");
    let label = createLabel(data.mentors[i].id, data.mentors[i].name);
    col.append(radioButton, label);
    mentorsDiv.appendChild(col);
  }
};

// -------- GET ALL STUDENTS --------

let getStudents = async () => {
  let responseData = await fetch("http://localhost:3000/api/student");
  let data = await responseData.json();

  let studentDiv = document.querySelector("#availableStudents");
  studentDiv.innerHTML = "";
  for (let i = 0; i < data.students.length; i++) {
    let col = createDiv("col-12");
    let checkbox = createCheckbox(data.students[i].id, "student");
    let label = createLabel(data.students[i].id, data.students[i].name);
    col.append(checkbox, label);
    studentDiv.appendChild(col);
  }
};

// ----------- ASSIGN STUDENTS A MENTOR ------------

let assignMentor = async () => {
  let allMentors = document.querySelectorAll(`[name="mentor"]`);
  let selectedMentor;
  for (let i = 0; i < allMentors.length; i++) {
    if (allMentors[i].checked) {
      selectedMentor = allMentors[i].id;
      break;
    }
  }
  let allStudents = document.querySelectorAll(`[name="student"]`);
  let selectedStudents = [];
  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].checked) {
      selectedStudents.push(allStudents[i].id);
    }
  }
  if (selectedStudents.length > 0 && selectedMentor) {
    let response = await fetch(
      `http://localhost:3000/api/mentor/${selectedMentor}`,
      {
        method: "POST",
        body: JSON.stringify({ students: selectedStudents }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// -------- GET STUDENTS UNDER A MENTOR -----------

let displayAssignedStudents = async () => {
  let allMentors = document.querySelectorAll(`[name="mentor"]`);
  let selectedMentor;
  for (let i = 0; i < allMentors.length; i++) {
    if (allMentors[i].checked) {
      selectedMentor = allMentors[i].id;
      break;
    }
  }
  if (selectedMentor) {
    let response = await fetch(
      `http://localhost:3000/api/mentor/${selectedMentor}`
    );
    let data = await response.json();
    let displayDiv = document.querySelector("#assignedStudents");
    displayDiv.innerHTML = "";
    if (data.students.length > 0) {
      for (let i = 0; i < data.students.length; i++) {
        let div = createDiv("col-12");
        div.innerHTML = data.students[i].studentName;
        displayDiv.appendChild(div);
      }
    } else {
      let div = createDiv("col-12");
      div.innerHTML = "No Student assigned";
      displayDiv.appendChild(div);
    }
  }
};
