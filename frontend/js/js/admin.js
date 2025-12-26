let allIssues = [];

// ================= AI HELPER FUNCTIONS =================

// Distance between two lat/lng points (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


// function detectHotspots(issues) {
//   const hotspots = [];
//   const thresholdDistance = 1; // increase distance
//   const minIssues = 2;          // reduce required nearby issues

//   issues.forEach((issue, i) => {
//     let count = 0;

//     issues.forEach((other, j) => {
//       if (i !== j) {
//         const d = getDistance(
//           issue.location.latitude,
//           issue.location.longitude,
//           other.location.latitude,
//           other.location.longitude
//         );

//         if (d <= thresholdDistance) {
//           count++;
//         }
//       }
//     });

//     if (count >= minIssues) {
//       hotspots.push(issue.location);
//     }
//   });

//   return hotspots;
// }


function detectHotspots(issues) {
  const hotspots = [];
  const thresholdDistance = 0.5; // km
  const minIssues = 3;

  issues.forEach(issue => {
    const nearby = issues.filter(other => {
      const d = getDistance(
        issue.location.latitude,
        issue.location.longitude,
        other.location.latitude,
        other.location.longitude
      );
      return d <= thresholdDistance;
    });

    if (nearby.length >= minIssues) {
      // Calculate average center (cluster center)
      const avgLat =
        nearby.reduce((sum, i) => sum + i.location.latitude, 0) /
        nearby.length;

      const avgLng =
        nearby.reduce((sum, i) => sum + i.location.longitude, 0) /
        nearby.length;

      // Avoid duplicate hotspots
      const alreadyExists = hotspots.some(h =>
        getDistance(h.latitude, h.longitude, avgLat, avgLng) < 0.3
      );

      if (!alreadyExists) {
        hotspots.push({
          latitude: avgLat,
          longitude: avgLng,
          count: nearby.length,
        });
      }
    }
  });

  return hotspots;
}






// const token = localStorage.getItem("token");

// if (!token) {
//     window.location.href = "public.html";
// }


// TEMP mock admin data
const admin = {
    name: "Admin User",
    email: "admin@example.com"
};


const profileIcon = document.getElementById("profileIcon");
const dropdown = document.getElementById("profileDropdown");
document.getElementById("adminName").textContent = admin.name;
document.getElementById("adminEmail").textContent = admin.email;
profileIcon.textContent = admin.name.charAt(0).toUpperCase();

profileIcon.onclick = () => {
    dropdown.classList.toggle("hidden");
};

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-container")) {
        dropdown.classList.add("hidden");
    }
});


const tableBody = document.querySelector("#issuesTable tbody");

// async function loadIssues() {
//     const res = await fetch("http://localhost:8080/issues", {
//         headers: {
//             "Authorization": "Bearer " + token
//         }
//     });
//     const issues = await res.json();
//     renderIssues(issues);
// }

// Temp usage - matches actual database schema
function loadIssues() {
    const tempIssues = [
        {
            _id: "675b1a2c8f4e5d6789012345",
            title: "Garbage Overflow Emergency",
            description: "Large garbage overflow near Central Park causing health hazards and bad smell",
            category: "Garbage",
            imageUrl: "https://example.com/images/garbage1.jpg",
            location: { latitude: 12.97, longitude: 77.59 },
            status: "Pending",
            reportedBy: { 
                _id: "675a1b2c3d4e5f6789012345",
                name: "Rajesh Kumar",
                email: "rajesh.kumar@email.com"
            },
            createdAt: "2024-12-20T10:30:00Z",
            updatedAt: "2024-12-20T10:30:00Z"
        },
        {
            _id: "675b1a2c8f4e5d6789012346",
            title: "Street Light Not Working",
            description: "Main street light has been out for 3 days, creating safety concerns for pedestrians",
            category: "Electricity",
            imageUrl: "https://example.com/images/streetlight1.jpg",
            location: { latitude: 12.98, longitude: 77.60 },
            status: "In Progress",
            reportedBy: { 
                _id: "675a1b2c3d4e5f6789012346",
                name: "Priya Sharma",
                email: "priya.sharma@email.com"
            },
            createdAt: "2024-12-19T14:15:00Z",
            updatedAt: "2024-12-21T09:20:00Z"
        },
        {
            _id: "675b1a2c8f4e5d6789012347",
            title: "Water Pipe Burst",
            description: "Major water leakage on MG Road causing traffic disruption and water wastage",
            category: "Water",
            imageUrl: "https://example.com/images/water1.jpg",
            location: { latitude: 12.99, longitude: 77.61 },
            status: "Resolved",
            reportedBy: { 
                _id: "675a1b2c3d4e5f6789012347",
                name: "Amit Patel",
                email: "amit.patel@email.com"
            },
            createdAt: "2024-12-18T09:45:00Z",
            updatedAt: "2024-12-22T16:30:00Z"
        },
        {
            _id: "675b1a2c8f4e5d6789012348",
            title: "Road Pothole Danger",
            description: "Large pothole on Brigade Road causing vehicle damage and accidents",
            category: "Road",
            imageUrl: "https://example.com/images/road1.jpg",
            location: { latitude: 12.96, longitude: 77.58 },
            status: "Pending",
            reportedBy: { 
                _id: "675a1b2c3d4e5f6789012348",
                name: "Sneha Reddy",
                email: "sneha.reddy@email.com"
            },
            createdAt: "2024-12-21T16:20:00Z",
            updatedAt: "2024-12-21T16:20:00Z"
        },
        {
            _id: "675b1a2c8f4e5d6789012349",
            title: "Power Outage in Residential Area",
            description: "Frequent power cuts in Koramangala affecting daily life and businesses",
            category: "Electricity",
            imageUrl: "https://example.com/images/power1.jpg",
            location: { latitude: 12.95, longitude: 77.57 },
            status: "In Progress",
            reportedBy: { 
                _id: "675a1b2c3d4e5f6789012349",
                name: "Vikram Singh",
                email: "vikram.singh@email.com"
            },
            createdAt: "2024-12-22T11:10:00Z",
            updatedAt: "2024-12-23T08:45:00Z"
        },
        //         {
        //     _id: "675b1a2c8f4e5d6789012349",
        //     title: "Power Outage in Residential Area",
        //     description: "Frequent power cuts in  kanchanwadui affecting aily life and businesses",
        //     category: "Electricity",
        //     imageUrl: "https://example.com/images/power1.jpg",
        //     location: { latitude: 19.83, longitude: 75.28 },
        //     status: "In Progress",
        //     reportedBy: { 
        //         _id: "675a1b2c3d4e5f6789012349",
        //         name: "Vikram Singh",
        //         email: "vikram.singh@email.com"
        //     },
        //     createdAt: "2024-12-22T11:10:00Z",
        //     updatedAt: "2024-12-23T08:45:00Z"
        // },
        {
  _id: "test1",
  title: "Garbage Overflow",
  category: "Garbage",
  description: "Test hotspot issue",
  imageUrl: "",
  location: { latitude: 12.9716, longitude: 77.5946 },
  status: "Pending",
  reportedBy: { name: "Test User" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
},
{
  _id: "test2",
  title: "Street Light Failure",
  category: "Electricity",
  description: "Test hotspot issue",
  imageUrl: "",
  location: { latitude: 12.9719, longitude: 77.5950 },
  status: "Pending",
  reportedBy: { name: "Test User" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
},
{
  _id: "test3",
  title: "Water Leakage",
  category: "Water",
  description: "Test hotspot issue",
  imageUrl: "",
  location: { latitude: 12.9722, longitude: 77.5948 },
  status: "Pending",
  reportedBy: { name: "Test User" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
},



    ];

    // normalize _id → id (IMPORTANT)
    const normalized = tempIssues.map(issue => ({
        ...issue,
        id: issue._id
    }));

    allIssues = normalized; // store full list
    renderIssues(allIssues);
    updateIssueCount();
}



function getCategoryBadge(category) {
    const categoryColors = {
        "Road": '<span class="category-badge category-road">Road</span>',
        "Garbage": '<span class="category-badge category-garbage">Garbage</span>',
        "Water": '<span class="category-badge category-water">Water</span>',
        "Electricity": '<span class="category-badge category-electricity">Electricity</span>'
    };
    return categoryColors[category] || '<span class="category-badge category-other">Other</span>';
}

function getPriorityBadge(priority) {
    if (priority === "High") {
        return '<span class="priority-badge priority-high">High</span>';
    }
    if (priority === "Medium") {
        return '<span class="priority-badge priority-medium">Medium</span>';
    }
    if (priority === "Low") {
        return '<span class="priority-badge priority-low">Low</span>';
    }
    return '<span class="priority-badge priority-medium">Medium</span>';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function getTimeSince(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
}

function updateIssueCount() {
    const count = allIssues.length;
    document.getElementById("issueCount").textContent = count;
}


function getStatusBadge(status) {
    if (status === "Pending") {
        return '<span class="status-badge status-pending">Pending</span>';
    }
    if (status === "In Progress") {
        return '<span class="status-badge status-in-progress">In Progress</span>';
    }
    if (status === "Resolved") {
        return '<span class="status-badge status-resolved">Resolved</span>';
    }
}


function renderIssues(issues) {
    tableBody.innerHTML = "";

    const emptyState = document.getElementById("emptyState");

    if (!issues || issues.length === 0) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    issues.forEach(issue => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="issue-id">${issue.id}</td>

            <td class="issue-main">
                <div class="issue-header">
                    <h4 class="issue-title">${issue.title}</h4>
                    <img src="${issue.imageUrl}" alt="Issue" class="issue-thumbnail" onclick="showImageModal('${issue.imageUrl}', '${issue.title}')" onerror="this.style.display='none'">
                </div>
                <div class="issue-description">${issue.description}</div>
                <div class="issue-meta">
                    ${getCategoryBadge(issue.category)}
                    <span class="reported-time">${getTimeSince(issue.createdAt)}</span>
                </div>
            </td>

            <td class="reporter-info">
                <div class="reporter-name">${issue.reportedBy?.name ?? "Unknown"}</div>
                <div class="reporter-email">${issue.reportedBy?.email ?? ""}</div>
            </td>

            <td class="location-info">
                <div class="coordinates">${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)}</div>
                <button class="view-map-btn" onclick="openMap(${issue.location.latitude}, ${issue.location.longitude})">View Map</button>
            </td>

            <td>
                <span class="status-view" onclick="enableEdit('${issue.id}')">
                    ${getStatusBadge(issue.status)}
                </span>

                <select class="status-edit hidden" data-id="${issue.id}">
                    <option value="Pending" ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
            </td>

            <td>
                <button class="update-btn hidden" onclick="updateStatus('${issue.id}')">
                    Update
                </button>
                <button class="cancel-btn hidden" onclick="cancelEdit('${issue.id}')">
                    Cancel
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function enableEdit(issueId) {
    const row = document.querySelector(`select[data-id="${issueId}"]`).closest("tr");

    row.querySelector(".status-view").classList.add("hidden");
    row.querySelector(".status-edit").classList.remove("hidden");
    row.querySelector(".update-btn").classList.remove("hidden");
    row.querySelector(".cancel-btn").classList.remove("hidden");
}

function cancelEdit(issueId) {
    const row = document.querySelector(`select[data-id="${issueId}"]`).closest("tr");

    row.querySelector(".status-view").classList.remove("hidden");
    row.querySelector(".status-edit").classList.add("hidden");
    row.querySelector(".update-btn").classList.add("hidden");
    row.querySelector(".cancel-btn").classList.add("hidden");
}

// NOTE: Backend integration pending.
// UI updates immediately; API call may fail until auth is connected.
async function updateStatus(issueId) {
    const select = document.querySelector(`select[data-id='${issueId}']`);
    const newStatus = select.value;
    const row = select.closest("tr");
    const updateBtn = row.querySelector(".update-btn");
    const cancelBtn = row.querySelector(".cancel-btn");

    // Confirmation for resolved status
    if (newStatus === "Resolved") {
        if (!confirm("Mark this issue as resolved? This action will close the issue.")) {
            return;
        }
    }

    // Show loading state
    updateBtn.textContent = "Updating...";
    updateBtn.disabled = true;
    cancelBtn.disabled = true;

    // 1. Update UI immediately
    const statusView = row.querySelector(".status-view");

    try {
        // 2. Call backend
        const token = localStorage.getItem("token") || "mock-token";
        await fetch(`http://localhost:8080/issues/${issueId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ status: newStatus })
        });

        // Success - update UI
        statusView.innerHTML = getStatusBadge(newStatus);
        statusView.classList.remove("hidden");
        select.classList.add("hidden");
        
        // Show success feedback
        updateBtn.textContent = "Updated!";
        updateBtn.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
            updateBtn.classList.add("hidden");
            cancelBtn.classList.add("hidden");
            updateBtn.textContent = "Update";
            updateBtn.style.backgroundColor = "";
            updateBtn.disabled = false;
            cancelBtn.disabled = false;
        }, 1500);

        // Update the data in allIssues array
        const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
        if (issueIndex !== -1) {
            allIssues[issueIndex].status = newStatus;
        }

    } catch (err) {
        console.error("Backend update failed", err);
        
        // Show error feedback
        updateBtn.textContent = "Failed";
        updateBtn.style.backgroundColor = "#ef4444";
        
        setTimeout(() => {
            updateBtn.textContent = "Update";
            updateBtn.style.backgroundColor = "";
            updateBtn.disabled = false;
            cancelBtn.disabled = false;
        }, 2000);
    }
}


document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "public.html";
};

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;

    const filtered = allIssues.filter(issue => {
        const matchesSearch = 
            issue.title.toLowerCase().includes(searchText) ||
            issue.description.toLowerCase().includes(searchText) ||
            issue.reportedBy?.name.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "ALL" ||
            issue.status === selectedStatus;

        const matchesCategory =
            selectedCategory === "ALL" ||
            issue.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderIssues(filtered);
}

// Utility functions
function showImageModal(imageUrl, title) {
    // Simple image modal - you can enhance this
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${imageUrl}" alt="${title}" style="max-width: 90%; max-height: 90%;">
            <p>${title}</p>
        </div>
    `;
    document.body.appendChild(modal);
}

function openMap(lat, lng) {
    // Open Google Maps in new tab
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(url, '_blank');
}

// Export functionality - updated for new schema
function exportToCSV() {
    const headers = ['ID', 'Title', 'Description', 'Category', 'Reported By', 'Email', 'Location', 'Status', 'Created At', 'Updated At'];
    const csvContent = [
        headers.join(','),
        ...allIssues.map(issue => [
            issue.id,
            `"${issue.title}"`,
            `"${issue.description}"`,
            issue.category,
            `"${issue.reportedBy?.name || 'Unknown'}"`,
            `"${issue.reportedBy?.email || ''}"`,
            `"${issue.location.latitude}, ${issue.location.longitude}"`,
            issue.status,
            `"${formatDate(issue.createdAt)}"`,
            `"${formatDate(issue.updatedAt)}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civic-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

loadIssues();

// Auto-refresh every 30 seconds (optional)
// setInterval(loadIssues, 30000);





// ================= MAP BASED VISUALIZATION =================

// Initialize map
const map = L.map("map").setView([12.97, 77.59], 12);

// Map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 500);

// Marker icons
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
});

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

// Store markers
let markers = [];

let hotspotLayer = L.layerGroup().addTo(map);


// // Load issues on map
// function loadIssuesOnMap(issues) {
//   // Clear old markers
//   markers.forEach(marker => map.removeLayer(marker));
//   markers = [];

//   issues.forEach(issue => {
//     const { latitude, longitude } = issue.location;

//     let icon = redIcon;
//     if (issue.status === "In Progress") icon = yellowIcon;
//     if (issue.status === "Resolved") icon = greenIcon;

//     const marker = L.marker([latitude, longitude], { icon })
//       .addTo(map)
//       .bindPopup(`
//         <b>${issue.title}</b><br>
//         Category: ${issue.category}<br>
//         Status: ${issue.status}
//       `);

//     markers.push(marker);
//   });
// }


function loadIssuesOnMap(issues) {

    console.log("Issues on map:", issues);
console.log("Hotspots found:", detectHotspots(issues));


  // clear old markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // group to calculate bounds
  const bounds = [];

  issues.forEach(issue => {
    const { latitude, longitude } = issue.location;

    let icon = redIcon;
    if (issue.status === "In Progress") icon = yellowIcon;
    if (issue.status === "Resolved") icon = greenIcon;

    const marker = L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup(`
        <b>${issue.title}</b><br>
        Category: ${issue.category}<br>
        Status: ${issue.status}
      `);

    markers.push(marker);
    bounds.push([latitude, longitude]);
  });

  // 🔥 AUTO ZOOM
  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  // 🔥 HOTSPOT VISUALIZATION (AI OUTPUT)
// // 🔥 HOTSPOT VISUALIZATION (AI OUTPUT)
// const hotspots = detectHotspots(issues);

// hotspots.forEach(hotspot => {
//   // Count how many issues fall within threshold distance of this hotspot
//   const count = issues.filter(issue => {
//     return getDistance(
//       hotspot.latitude,
//       hotspot.longitude,
//       issue.location.latitude,
//       issue.location.longitude
//     ) <= 0.5; // threshold distance in km, same as detectHotspots
//   }).length;

//   L.circle(
//     [hotspot.latitude, hotspot.longitude],
//     {
//       radius: 300, // meters
//       color: "red",
//       fillColor: "#ef4444",
//       fillOpacity: 0.25,
//     }
//   )
//   .addTo(map)
//   .bindTooltip(`${count} issues here`, { permanent: false, direction: 'top' });
// });


const hotspots = detectHotspots(issues);

hotspots.forEach(hotspot => {
  L.circle(
    [hotspot.latitude, hotspot.longitude],
    {
      radius: 400 + hotspot.count * 50, // dynamic size
      color: "red",
      fillColor: "#ef4444",
      fillOpacity: 0.25,
    }
  )
    .addTo(map)
    .bindPopup(`
      <b>🚨 Hotspot Area</b><br>
      ${hotspot.count} nearby issues
    `);
});





}



// 🔥 Hook map with table data
const originalRenderIssues = renderIssues;
renderIssues = function (issues) {
  originalRenderIssues(issues);
  loadIssuesOnMap(issues);
};

loadIssuesOnMap(allIssues);



// document.addEventListener("DOMContentLoaded", () => {

//   const map = L.map("map").setView([12.97, 77.59], 12);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "© OpenStreetMap contributors",
//   }).addTo(map);

// });


