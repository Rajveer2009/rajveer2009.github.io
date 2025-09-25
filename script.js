function random_title() {
  let titles = ["Rajveer", "Singh", "Saggu"];
  let random_number = Math.round(Math.random() * 2);
  return titles[random_number];
}

function current_age() {
  const currentDate = new Date();
  const targetDate = new Date("2009-09-23");
  return (yearsDifference =
    currentDate.getFullYear() - targetDate.getFullYear());
}

async function get_latest_repo() {
  try {
    const response = await fetch(
      "https://api.github.com/users/rajveer2009/repos?sort=pushed&direction=desc&per_page=1",
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const repo = data[0];
      return {
        title: repo.name,
        desc: repo.description || "No description available",
        url: repo.html_url,
      };
    }

    return {
      title: "shape-classifier",
      desc: " This is a simple web application for classifying hand-drawn shapes (Circle, Square, Rectangle, Triangle) using a TensorFlow.js model. ",
      url: "https://github.com/rajveer2009/shape-classifier",
    };
  } catch (error) {
    return {
      title: "Error loading repository",
      desc: "Failed to fetch repository data",
      url: "#",
    };
  }
}

document.title = random_title();

document.getElementById("age").innerHTML = current_age();

get_latest_repo().then((repo) => {
  document.getElementById("project-card").href = repo.url;
  document.getElementById("project-title").innerHTML = repo.title;
  document.getElementById("project-description").innerHTML = repo.desc;
});
