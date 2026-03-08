const apiData = YOUR_JSON_DATA_HERE;

const issues = apiData.data;

const container = document.getElementById("issuesContainer");

issues.forEach(issue => {

let priorityColor = {
high: "border-red-500",
medium: "border-yellow-500",
low: "border-gray-400"
};

let labelsHTML = issue.labels.map(label =>
`<span class="text-xs bg-gray-200 px-2 py-1 rounded">${label}</span>`
).join(" ");

container.innerHTML += `
<div class="bg-white p-4 rounded-lg shadow border-t-4 ${priorityColor[issue.priority]}">

<h3 class="font-semibold mb-2">${issue.title}</h3>

<p class="text-sm text-gray-500 mb-3">
${issue.description.substring(0,80)}...
</p>

<div class="flex gap-2 mb-3">
${labelsHTML}
</div>

<p class="text-xs text-gray-400">
#${issue.id} by ${issue.author}
</p>

<p class="text-xs text-gray-400">
${new Date(issue.createdAt).toLocaleDateString()}
</p>

</div>
`;

});