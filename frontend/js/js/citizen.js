// Enhanced Citizen Dashboard JavaScript

// Global variables
let issues = JSON.parse(localStorage.getItem("issues")) || [
    {
        id: 1,
        title: "Overflowing Garbage Bin at Central Park",
        location: "Central Park, East Entrance",
        description: "Garbage bin has been overflowing for several days, creating hygiene issues and attracting pests.",
        status: "Resolved",
        category: "Environment",
        priority: "Medium",
        date: "Dec 18, 2024",
        votes: 15,
        photo: null,
        userVoted: false
    },
    {
        id: 2,
        title: "Cracked Sidewalk Creating Trip Hazard",
        location: "Oak Avenue, Block 200-300",
        description: "Large cracks in the sidewalk making it unsafe for pedestrians, especially elderly and disabled individuals.",
        status: "Pending",
        category: "Infrastructure",
        priority: "High",
        date: "Dec 17, 2024",
        votes: 23,
        photo: null,
        userVoted: true
    },
    {
        id: 3,
        title: "Broken Street Light on Main Street",
        location: "Main Street & 5th Avenue",
        description: "Street light has been out for over a week, creating safety concerns for pedestrians at night.",
        status: "In Progress",
        category: "Safety",
        priority: "High",
        date: "Dec 15, 2024",
        votes: 18,
        photo: null,
        userVoted: false
    }
];

let currentView = 'grid';
let displayedIssues = 6;
let maxDisplayed = 6;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderIssues();
    updateStats();
    updateIssuesSummary();
});

// Form toggle functionality
function toggleForm() {
    const formContent = document.getElementById('reportForm');
    const toggleBtn = document.querySelector('.toggle-form i');
    
    if (formContent.style.display === 'none' || formContent.classList.contains('collapsed')) {
        formContent.style.display = 'block';
        formContent.classList.remove('collapsed');
        toggleBtn.className = 'fas fa-chevron-up';
    } else {
        formContent.style.display = 'none';
        formContent.classList.add('collapsed');
        toggleBtn.className = 'fas fa-chevron-down';
    }
}

// Photo preview functionality
function previewPhoto(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                document.getElementById('location').value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
                showToast('Location detected successfully!', 'success');
            },
            function(error) {
                showToast('Unable to get location. Please enter manually.', 'error');
            }
        );
    } else {
        showToast('Geolocation is not supported by this browser.', 'error');
    }
}

// Add new issue
function addIssue() {
    const title = document.getElementById('title').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const priority = document.getElementById('priority').value;
    const photoFile = document.getElementById('photo').files[0];
    
    // Validation
    if (!title || !location || !description || !category) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }
    
    // Create new issue object
    const newIssue = {
        id: Date.now(),
        title,
        location,
        description,
        category,
        priority,
        status: "Pending",
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        votes: 0,
        photo: null,
        userVoted: false
    };
    
    // Handle photo if uploaded
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newIssue.photo = e.target.result;
            saveAndRenderIssue(newIssue);
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveAndRenderIssue(newIssue);
    }
}

function saveAndRenderIssue(issue) {
    issues.unshift(issue);
    localStorage.setItem("issues", JSON.stringify(issues));
    renderIssues();
    updateStats();
    updateIssuesSummary();
    clearForm();
    showToast('Issue reported successfully!', 'success');
}

// Clear form
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('location').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('priority').value = 'Medium';
    document.getElementById('photo').value = '';
    document.getElementById('photoPreview').innerHTML = '';
}

// Set view (grid or list)
function setView(view) {
    currentView = view;
    const issueList = document.getElementById('issueList');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    // Update button states
    viewBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    // Update issue list class
    issueList.className = `issues ${view}-view`;
    renderIssues();
}

// Vote on issue
function voteIssue(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
        if (issue.userVoted) {
            issue.votes--;
            issue.userVoted = false;
            showToast('Vote removed', 'info');
        } else {
            issue.votes++;
            issue.userVoted = true;
            showToast('Vote added!', 'success');
        }
        localStorage.setItem("issues", JSON.stringify(issues));
        renderIssues();
    }
}

// Show issue details in modal
function showIssueDetails(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;
    
    const modal = document.getElementById('issueModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = issue.title;
    
    modalBody.innerHTML = `
        <div class="issue-details">
            <div class="detail-row">
                <strong><i class="fas fa-map-marker-alt"></i> Location:</strong>
                <span>${issue.location}</span>
            </div>
            <div class="detail-row">
                <strong><i class="fas fa-tags"></i> Category:</strong>
                <span class="category-badge">${issue.category}</span>
            </div>
            <div class="detail-row">
                <strong><i class="fas fa-exclamation"></i> Priority:</strong>
                <span class="priority-badge priority-${issue.priority}">${issue.priority}</span>
            </div>
            <div class="detail-row">
                <strong><i class="fas fa-info-circle"></i> Status:</strong>
                <span class="status-badge status-${issue.status.replace(' ', '-')}">${issue.status}</span>
            </div>
            <div class="detail-row">
                <strong><i class="fas fa-calendar"></i> Reported:</strong>
                <span>${issue.date}</span>
            </div>
            <div class="detail-row">
                <strong><i class="fas fa-thumbs-up"></i> Votes:</strong>
                <span>${issue.votes}</span>
            </div>
            ${issue.photo ? `
                <div class="detail-row">
                    <strong><i class="fas fa-camera"></i> Photo:</strong>
                    <img src="${issue.photo}" alt="Issue photo" style="max-width: 100%; border-radius: 8px; margin-top: 8px;">
                </div>
            ` : ''}
            <div class="detail-row">
                <strong><i class="fas fa-align-left"></i> Description:</strong>
                <p style="margin-top: 8px; line-height: 1.6;">${issue.description}</p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('issueModal');
    modal.classList.remove('active');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update statistics
function updateStats() {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
    const pendingIssues = issues.filter(i => i.status === 'Pending').length;
    
    document.getElementById('totalIssues').textContent = totalIssues;
    document.getElementById('resolvedIssues').textContent = resolvedIssues;
    document.getElementById('pendingIssues').textContent = pendingIssues;
}

// Update issues summary
function updateIssuesSummary() {
    const filteredIssues = getFilteredIssues();
    const summary = document.getElementById('issuesSummary');
    
    if (filteredIssues.length === 0) {
        summary.textContent = 'No issues found matching your criteria';
    } else {
        summary.textContent = `Showing ${Math.min(displayedIssues, filteredIssues.length)} of ${filteredIssues.length} issues`;
    }
}

// Get filtered issues based on current filters
function getFilteredIssues() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;
    
    let filtered = issues.filter(issue => {
        const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
        const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
        const matchesSearch = issue.title.toLowerCase().includes(searchQuery) || 
                            issue.description.toLowerCase().includes(searchQuery) ||
                            issue.location.toLowerCase().includes(searchQuery);
        
        return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
    });
    
    // Sort issues
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'date-old':
                return new Date(a.date) - new Date(b.date);
            case 'priority':
                const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'votes':
                return b.votes - a.votes;
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
    
    return filtered;
}

// Render issues
function renderIssues() {
    const issueList = document.getElementById('issueList');
    const issueCount = document.getElementById('issueCount');
    const loadMoreSection = document.getElementById('loadMoreSection');
    
    const filteredIssues = getFilteredIssues();
    const issuesToShow = filteredIssues.slice(0, displayedIssues);
    
    issueCount.textContent = filteredIssues.length;
    
    if (issuesToShow.length === 0) {
        issueList.innerHTML = `
            <div class="no-issues">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3 style="color: #666; margin-bottom: 8px;">No Issues Found</h3>
                <p style="color: #999;">Try adjusting your search criteria or filters.</p>
            </div>
        `;
        loadMoreSection.style.display = 'none';
        updateIssuesSummary();
        return;
    }
    
    issueList.innerHTML = issuesToShow.map(issue => `
        <div class="card" onclick="showIssueDetails(${issue.id})">
            <span class="status ${issue.status.replace(' ', '.')}">${issue.status}</span>
            <h3>${issue.title}</h3>
            <div class="card-content">
                <div class="card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${issue.location}
                </div>
                <div class="card-category">
                    ${getCategoryIcon(issue.category)} ${issue.category}
                </div>
                <div class="card-priority priority-${issue.priority}">
                    ${getPriorityIcon(issue.priority)} ${issue.priority}
                </div>
                <div class="card-description">${issue.description}</div>
                ${issue.photo ? `<img src="${issue.photo}" alt="Issue photo" style="max-width: 100%; border-radius: 8px; margin: 12px 0;">` : ''}
            </div>
            <div class="card-footer">
                <div class="card-meta">
                    <span><i class="fas fa-calendar"></i> ${issue.date}</span>
                </div>
                <div class="card-actions">
                    <button class="vote-btn ${issue.userVoted ? 'voted' : ''}" onclick="event.stopPropagation(); voteIssue(${issue.id})">
                        <i class="fas fa-thumbs-up"></i>
                        ${issue.votes}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Show/hide load more button
    if (filteredIssues.length > displayedIssues) {
        loadMoreSection.style.display = 'block';
    } else {
        loadMoreSection.style.display = 'none';
    }
    
    updateIssuesSummary();
}

// Load more issues
function loadMoreIssues() {
    displayedIssues += maxDisplayed;
    renderIssues();
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'Infrastructure': '🏗️',
        'Transportation': '🚗',
        'Environment': '🌱',
        'Safety': '🛡️',
        'Utilities': '⚡',
        'Public Services': '🏛️',
        'Other': '📋'
    };
    return icons[category] || '📋';
}

// Get priority icon
function getPriorityIcon(priority) {
    const icons = {
        'Critical': '🔴',
        'High': '🟠',
        'Medium': '🟡',
        'Low': '🟢'
    };
    return icons[priority] || '🟡';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('issueModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Reset displayed issues when filters change
document.getElementById('statusFilter').addEventListener('change', () => {
    displayedIssues = maxDisplayed;
    renderIssues();
});

document.getElementById('categoryFilter').addEventListener('change', () => {
    displayedIssues = maxDisplayed;
    renderIssues();
});

document.getElementById('priorityFilter').addEventListener('change', () => {
    displayedIssues = maxDisplayed;
    renderIssues();
});

document.getElementById('search').addEventListener('input', () => {
    displayedIssues = maxDisplayed;
    renderIssues();
});

document.getElementById('sortBy').addEventListener('change', () => {
    displayedIssues = maxDisplayed;
    renderIssues();
});