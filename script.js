// ===== Login Functionality =====
const loginForm = document.getElementById('login-form');

if(loginForm){
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if(username === 'admin' && password === 'admin123'){
            // Store login in session storage
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = 'main.html';
        } else {
            alert('Invalid credentials! Use admin / admin123');
        }
    });
}


// issue model
const modal = document.getElementById("issueModal");
const closeModal = document.getElementById("closeModal");

function openIssuePopup(issue){

  document.getElementById("modalTitle").innerText = issue.title;
  document.getElementById("modalDescription").innerText = issue.description;
  document.getElementById("modalAuthor").innerText = "Opened by " + issue.author;
  document.getElementById("modalDate").innerText = issue.createdAt;
  document.getElementById("modalAssignee").innerText = issue.assignee;

  const priority = document.getElementById("modalPriority");
  priority.innerText = issue.priority.toUpperCase();

  const status = document.getElementById("modalStatus");
  status.innerText = issue.status;

  if(issue.status === "open"){
      status.className="px-2 py-1 text-white text-xs rounded-full bg-green-500";
  }else{
      status.className="px-2 py-1 text-white text-xs rounded-full bg-purple-500";
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

closeModal.onclick = () =>{
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};




// Load issues from data.json
document.addEventListener("DOMContentLoaded", () => {
    const issuesContainer = document.getElementById("issuesContainer");
    const issueCountHeader = document.getElementById("issueCount");
    const openCountHeader = document.getElementById("openCount");
    const closedCountHeader = document.getElementById("closedCount");
    const searchInput = document.getElementById("searchInput");

    if(searchInput){
        searchInput.addEventListener("input",(e) => {
            searchIssues(e.target.value);
        });
    }


    let issuesData = [];
    fetch("data.json")
        .then(res => res.json())
        .then(json => {
            issuesData = json.data; // use data array from JSON
            updateHeaderCounts(); 
            renderIssues("all");
        })
        .catch(err => console.error("Error loading data.json:", err));


        function updateHeaderCounts(){
        const openCount = issuesData.filter(i => i.status === "open").length;
        const closedCount = issuesData.filter(i => i.status === "closed").length;

        openCountHeader.textContent = openCount;
        closedCountHeader.textContent = closedCount;
        issueCountHeader.textContent = issuesData.length;
        }


        function fetchSingleIssue(id){
         fetch("data.json")
        .then(res => res.json())
        .then(json => {

            const issue = json.data.find(i => i.id === id);

            if(issue){
                openIssuePopup(issue);
            }else{
                alert("Issue not found");
            }

        })
        .catch(err => console.error("Error fetching issue:", err));
        }



        function searchIssues(query){

        const results = issuesData.filter(issue =>
        issue.title.toLowerCase().includes(query.toLowerCase()) ||
        issue.description.toLowerCase().includes(query.toLowerCase())
        );

        const response = {
        status: "success",
        message: "Issues searched successfully",
        total: results.length,
        data: results
        };

        renderSearchResults(response);
        }


        function renderSearchResults(response){

        issuesContainer.innerHTML = "";

        if(response.total === 0){
        issuesContainer.innerHTML =
        `<p class="text-center text-gray-500">No issues found</p>`;
        return;
        }

        response.data.forEach(issue => {

        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow p-4 border-t-4";

        card.classList.add(issue.status === "open"
            ? "border-green-500"
            : "border-purple-500");

        card.innerHTML = `
            <h3 class="font-semibold text-sm mb-2">${issue.title}</h3>
            <p class="text-gray-500 text-xs">${issue.description}</p>
        `;

        card.addEventListener("click", () => {
            fetchSingleIssue(issue.id);
        });

        issuesContainer.appendChild(card);

        });

        }



    // Render issues based on filter
    window.renderIssues = function(filter = "all") {
        issuesContainer.innerHTML = "";

        // const issuesContainer = document.getElementById("issuesContainer");
        // issuesContainer.innerHTML = "";

        // if(issuesData.length){
        //     issuesContainer.innerHTML = `<p class="text-center text-gray-500">No issues found.</p>`;
        //     return;
        // }
        let filtered = issuesData;

        if (filter === "open") filtered = issuesData.filter(i => i.status === "open");
        if (filter === "closed") filtered = issuesData.filter(i => i.status === "closed");


        issueCountHeader.textContent = `${filtered.length} Issues`;
          if(filtered.length === 0){
            issuesContainer.innerHTML = `<p class="text-center text-gray-500">No issues found.</p>`;
            return;
        }



        filtered.forEach(issue => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-lg shadow p-4 border-t-4";

            // border color based on status
            card.classList.add(issue.status === "open" ? "border-green-500" : "border-purple-500");

            // priority color
            let priorityColor = "bg-gray-100 text-gray-500";
            if(issue.priority === "high") priorityColor = "bg-red-100 text-red-600";
            if(issue.priority === "medium") priorityColor = "bg-yellow-100 text-yellow-600";
            if(issue.priority === "low") priorityColor = "bg-gray-100 text-gray-500";

            card.innerHTML = `<div class="flex justify-between mb-2">
                    <img src="${issue.status === 'open' ? 'assets/Open-Status.png' : 'assets/Closed-Status.png'}" alt="">
                    <span class="text-xs px-2 py-1 rounded-full ${priorityColor}">${issue.priority.toUpperCase()}</span>
                </div>
                <h3 class="font-semibold text-sm mb-2">${issue.title}</h3>
                <p class="text-gray-500 text-xs mb-3">${issue.description}</p>
                <div class="flex gap-2 mb-3">
                    ${issue.labels.map(l => `<span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">${l.toUpperCase()}</span>`).join('')}
                </div>
                <div class="border-t mb-2"></div>
                <p class="text-xs text-gray-400">#${issue.id} by ${issue.author}</p>
                <p class="text-xs text-gray-400">${new Date(issue.createdAt).toLocaleDateString()}</p>
                <button class="toggle-btn mt-2 px-2 py-1 rounded border text-sm">${issue.status === "open" ? "Close" : "Open"}</button>`;

                card.addEventListener("click", () => {
                    fetchSingleIssue(issue.id);
                });

            // toggle button
            card.querySelector(".toggle-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                issue.status = issue.status === "open" ? "closed" : "open";
                updateHeaderCounts();
                renderIssues(filter); // re-render
            });

            issuesContainer.appendChild(card);
        });
    };
});
