var grades = [15, 88];

function addGrades (grades) {

//grades.push(55); 
// this one works because 
// grades was updated or 'mutated' not redefined

grades = [12, 33 , 99]
// this one doesnt Work because its assigning t
//to a whole new variable grades , that is not
// the one referenced outside
 debugger;
}

addGrades(grades);
console.log(grades)


