"use strict";

/* SAMPLE SPORTS */
var sports = [
    {name:"Football",category:"Team",icon:"⚽"},
    {name:"Cricket",category:"Team",icon:"🏏"},
    {name:"Basketball",category:"Team",icon:"🏀"},
    {name:"Volleyball",category:"Team",icon:"🏐"},
    {name:"Hockey",category:"Team",icon:"🏑"},
    {name:"Kabaddi",category:"Team",icon:"🤼"},
    {name:"Handball",category:"Team",icon:"🤾"},
    {name:"Futsal",category:"Team",icon:"⚽"},
    {name:"Rugby",category:"Team",icon:"🏉"},
    {name:"Baseball",category:"Team",icon:"⚾"},
    {name:"Badminton",category:"Racquet",icon:"🏸"},
    {name:"Tennis",category:"Racquet",icon:"🎾"},
    {name:"Table Tennis",category:"Racquet",icon:"🏓"},
    {name:"Squash",category:"Racquet",icon:"🎾"},
    {name:"Chess",category:"Indoor",icon:"♟️"},
    {name:"Carrom",category:"Indoor",icon:"🎯"},
    {name:"Athletics",category:"Individual",icon:"🏃"},
    {name:"Swimming",category:"Individual",icon:"🏊"},
    {name:"Wrestling",category:"Individual",icon:"🤼"},
    {name:"Boxing",category:"Individual",icon:"🥊"},
    {name:"Archery",category:"Individual",icon:"🏹"},
    {name:"Shooting",category:"Individual",icon:"🎯"},
    {name:"Weightlifting",category:"Individual",icon:"🏋️"},
    {name:"Cycling",category:"Individual",icon:"🚴"}
];

/* SAMPLE PLAYGROUNDS AND STADIUMS */
var venues = [
    {name:"LPU Main Football Ground",type:"Playground",sports:["Football","Rugby"],location:"Outdoor Sports Complex",capacity:"11-a-side"},
    {name:"LPU Cricket Ground",type:"Playground",sports:["Cricket"],location:"University Sports Area",capacity:"Full team"},
    {name:"LPU Athletics Track",type:"Playground",sports:["Athletics","Cycling"],location:"Outdoor Sports Complex",capacity:"Track lanes"},
    {name:"LPU Hockey Ground",type:"Playground",sports:["Hockey"],location:"University Sports Area",capacity:"Full team"},
    {name:"LPU Main Stadium",type:"Stadium",sports:["Football","Athletics"],location:"Main Sports Complex",capacity:"Large events"},
    {name:"LPU Indoor Stadium",type:"Stadium",sports:["Basketball","Volleyball","Handball"],location:"Indoor Sports Complex",capacity:"Indoor arena"},
    {name:"LPU Basketball Court",type:"Indoor Court",sports:["Basketball"],location:"Indoor Sports Complex",capacity:"10 players"},
    {name:"LPU Badminton Courts",type:"Indoor Court",sports:["Badminton"],location:"Indoor Sports Complex",capacity:"4 players"},
    {name:"LPU Table Tennis Hall",type:"Indoor Court",sports:["Table Tennis"],location:"Student Activity Centre",capacity:"4 players"},
    {name:"LPU Aquatic Centre",type:"Stadium",sports:["Swimming"],location:"Sports Complex",capacity:"Pool lanes"}
];

var storageKeys = {
    users:"lpuFeaturesUsers",
    teams:"lpuFeaturesTeams",
    matches:"lpuFeaturesMatches",
    bookings:"lpuFeaturesBookings",
    players:"lpuFeaturesPlayers",
    notifications:"lpuFeaturesNotifications"
};

function loadData(key, defaultValue) {
    try {
        var text = localStorage.getItem(key);
        if (text === null) return defaultValue;
        var result = JSON.parse(text);
        if (Array.isArray(result)) return result;
        return defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

var users = loadData(storageKeys.users, [
    {id:1,name:"LPU Admin",email:"admin@lpu.in",password:"admin123",role:"Admin"},
    {id:2,name:"LPU Organizer",email:"organizer@lpu.in",password:"org123",role:"Organizer"},
    {id:3,name:"LPU Student",email:"student@lpu.in",password:"student123",role:"Student"}
]);

var teams = loadData(storageKeys.teams, [
    {id:1,name:"LPU Falcons",sport:"Football",division:"Men",coach:"Aman Sharma"},
    {id:2,name:"LPU Tigers",sport:"Football",division:"Men",coach:"Riya Kapoor"},
    {id:3,name:"LPU Panthers",sport:"Basketball",division:"Mixed",coach:"Kabir Singh"},
    {id:4,name:"LPU Smashers",sport:"Badminton",division:"Mixed",coach:"Simran Kaur"}
]);

var matches = loadData(storageKeys.matches, [
    {id:1,sport:"Football",home:1,away:2,date:"2026-12-05",slot:"Afternoon (2–5 PM)",venue:"LPU Main Football Ground",status:"Upcoming",homeScore:0,awayScore:0,referee:"A. Singh",notes:"League fixture"},
    {id:2,sport:"Basketball",home:3,away:3,date:"2026-11-14",slot:"Evening (5–8 PM)",venue:"LPU Indoor Stadium",status:"Ongoing",homeScore:24,awayScore:20,referee:"R. Kumar",notes:"Friendly match"}
]);

var bookings = loadData(storageKeys.bookings, []);
var players = loadData(storageKeys.players, [
    {id:1,name:"Arjun Kumar",email:"arjun@lpu.in",sport:"Football",team:"LPU Falcons",appearances:4,goals:3,points:0},
    {id:2,name:"Simran Kaur",email:"simran@lpu.in",sport:"Football",team:"LPU Falcons",appearances:5,goals:1,points:0},
    {id:3,name:"Dev Patel",email:"dev@lpu.in",sport:"Basketball",team:"LPU Panthers",appearances:3,goals:0,points:18}
]);
var notifications = loadData(storageKeys.notifications, []);
var currentUser = null;
var toastTimer;
var selectedCalendarDate = new Date().toISOString().slice(0,10);
var calendarYear = new Date().getFullYear();
var calendarMonthNumber = new Date().getMonth();

/* SAVE DATA */
function saveData() {
    try {
        localStorage.setItem(storageKeys.users, JSON.stringify(users));
        localStorage.setItem(storageKeys.teams, JSON.stringify(teams));
        localStorage.setItem(storageKeys.matches, JSON.stringify(matches));
        localStorage.setItem(storageKeys.bookings, JSON.stringify(bookings));
        localStorage.setItem(storageKeys.players, JSON.stringify(players));
        localStorage.setItem(storageKeys.notifications, JSON.stringify(notifications));
    } catch (error) {
        showToast("Data could not be saved in this browser.");
    }
}

function makeId() {
    return new Date().getTime() + Math.floor(Math.random() * 1000);
}

function safeText(value) {
    var text = String(value == null ? "" : value);
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");
    text = text.replace(/'/g, "&#39;");
    return text;
}

function showToast(message) {
    var box = document.getElementById("toast");
    box.textContent = message;
    box.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        box.classList.add("hidden");
    }, 3000);
}

function addNotification(message) {
    notifications.unshift({
        id:makeId(),
        message:message,
        date:new Date().toLocaleString()
    });
    if (notifications.length > 50) notifications.pop();
    saveData();
}

function isManager() {
    return currentUser && (currentUser.role === "Admin" || currentUser.role === "Organizer");
}

/* LOGIN AND REGISTRATION */
function showAuth(formName) {
    var loginMode = formName === "login";
    document.getElementById("loginForm").classList.toggle("hidden", !loginMode);
    document.getElementById("registerForm").classList.toggle("hidden", loginMode);
    document.getElementById("loginTab").classList.toggle("active", loginMode);
    document.getElementById("registerTab").classList.toggle("active", !loginMode);
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var email = document.getElementById("loginEmail").value.trim().toLowerCase();
    var password = document.getElementById("loginPassword").value;
    var found = null;

    for (var i=0; i<users.length; i++) {
        if (users[i].email.toLowerCase() === email && users[i].password === password) {
            found = users[i];
            break;
        }
    }

    if (found === null) {
        showToast("Email or password is incorrect.");
    } else {
        signIn(found);
    }
});

document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var name = document.getElementById("registerName").value.trim();
    var email = document.getElementById("registerEmail").value.trim().toLowerCase();
    var password = document.getElementById("registerPassword").value;
    var role = document.getElementById("registerRole").value;

    if (name.length < 2) return showToast("Enter a valid name.");
    if (password.length < 6) return showToast("Password must be at least 6 characters.");

    for (var i=0; i<users.length; i++) {
        if (users[i].email.toLowerCase() === email) {
            return showToast("That email is already registered.");
        }
    }

    var newUser = {id:makeId(),name:name,email:email,password:password,role:role};
    users.push(newUser);
    saveData();
    signIn(newUser);
    showToast("Account created.");
});

function signIn(user) {
    currentUser = user;
    document.getElementById("authScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userRole").textContent = user.role;
    document.getElementById("avatar").textContent = user.name.charAt(0).toUpperCase();
    document.getElementById("profileNav").classList.toggle("hidden", user.role !== "Admin");

    var managerButtons = document.querySelectorAll(".manager");
    for (var i=0; i<managerButtons.length; i++) {
        managerButtons[i].classList.toggle("hidden", !isManager());
    }

    goTo("dashboard");
}

function logout() {
    currentUser = null;
    document.getElementById("app").classList.add("hidden");
    document.getElementById("authScreen").classList.remove("hidden");
    document.getElementById("loginForm").reset();
    showAuth("login");
}

/* ACCESSIBILITY CONTROLS */
function toggleContrast() {
    document.body.classList.toggle("high-contrast");
    showToast("Contrast setting changed.");
}

function toggleTextSize() {
    document.body.classList.toggle("large-text");
    showToast("Text size changed.");
}

/* NAVIGATION */
function goTo(pageName) {
    if (pageName === "profile" && (!currentUser || currentUser.role !== "Admin")) {
        return showToast("Only the Admin can open this section.");
    }

    var pages = document.querySelectorAll(".page");
    for (var i=0; i<pages.length; i++) pages[i].classList.add("hidden");
    document.getElementById("page-" + pageName).classList.remove("hidden");

    var buttons = document.querySelectorAll(".nav-button[data-page]");
    for (var j=0; j<buttons.length; j++) {
        buttons[j].classList.toggle("active", buttons[j].getAttribute("data-page") === pageName);
    }

    if (pageName === "profile") loadAdminProfile();
    renderEverything();
}

function getTeamName(id) {
    for (var i=0; i<teams.length; i++) {
        if (Number(teams[i].id) === Number(id)) return teams[i].name;
    }
    return "Unknown team";
}

function statusBadge(status) {
    return '<span class="badge badge-' + safeText(status.toLowerCase().replace(/ /g,"-")) + '">' +
        safeText(status) + '</span>';
}

/* PAGE RENDERING */
function renderEverything() {
    renderDashboard();
    renderTeams();
    renderCalendar();
    renderGames();
    renderFacilities();
    renderMatches();
    renderStandings();
    renderPlayers();
    renderBookings();
    renderNotifications();
    renderReports();
    updateFilters();
}

function renderDashboard() {
    var live = 0;
    var pending = 0;
    var upcomingList = [];
    var liveList = [];

    for (var i=0; i<matches.length; i++) {
        if (matches[i].status === "Ongoing") {
            live++;
            liveList.push(matches[i]);
        }
        if (matches[i].status === "Upcoming") upcomingList.push(matches[i]);
    }

    for (var j=0; j<bookings.length; j++) {
        if (bookings[j].status === "Pending") pending++;
    }

    document.getElementById("statSports").textContent = sports.length;
    document.getElementById("statTeams").textContent = teams.length;
    document.getElementById("statLive").textContent = live;
    document.getElementById("statPending").textContent = pending;

    document.getElementById("dashboardLive").innerHTML = liveList.length
        ? liveList.slice(0,3).map(makeMatchCard).join("")
        : '<div class="empty">No live matches right now.</div>';

    document.getElementById("dashboardUpcoming").innerHTML = upcomingList.length
        ? upcomingList.slice(0,4).map(makeMatchCard).join("")
        : '<div class="empty">No upcoming matches.</div>';

    var recent = notifications.slice(0,3);
    if (recent.length === 0) {
        document.getElementById("dashboardNotifications").innerHTML = '<div class="empty">No notifications yet.</div>';
    } else {
        var html = "";
        for (var n=0; n<recent.length; n++) {
            html += '<div class="row"><span>' + safeText(recent[n].message) +
                '</span><small class="muted">' + safeText(recent[n].date) + '</small></div>';
        }
        document.getElementById("dashboardNotifications").innerHTML = html;
    }
}

function renderGames() {
    var query = document.getElementById("gameSearch").value.toLowerCase();
    var category = document.getElementById("gameCategory").value;
    var html = "";

    for (var i=0; i<sports.length; i++) {
        if (sports[i].name.toLowerCase().indexOf(query) !== -1 &&
            (category === "" || category === sports[i].category)) {
            html += '<article class="card"><h3>' + sports[i].icon + ' ' + safeText(sports[i].name) +
                '</h3><p><b>Category:</b> ' + safeText(sports[i].category) +
                '</p><button class="button secondary small" onclick="goTo(\'facilities\')">Find a venue</button></article>';
        }
    }
    document.getElementById("gameList").innerHTML = html || '<div class="empty">No games found.</div>';
}

function renderFacilities() {
    var query = document.getElementById("facilitySearch").value.toLowerCase();
    var filter = document.getElementById("facilityTypeFilter").value;
    var html = "";

    for (var i=0; i<venues.length; i++) {
        var item = venues[i];
        var matchesSearch = item.name.toLowerCase().indexOf(query) !== -1 ||
            item.sports.join(" ").toLowerCase().indexOf(query) !== -1;

        if (matchesSearch && (filter === "" || item.type === filter)) {
            html += '<article class="card"><h3>🏟 ' + safeText(item.name) +
                '</h3><p><b>Type:</b> ' + safeText(item.type) + '</p><p><b>Sports:</b> ' +
                safeText(item.sports.join(", ")) + '</p><p><b>Capacity:</b> ' +
                safeText(item.capacity) + '</p><p><b>Location:</b> ' +
                safeText(item.location) + '</p><button class="button primary" onclick="openBookingForm(' +
                i + ')">Request booking</button></article>';
        }
    }
    document.getElementById("facilityList").innerHTML = html || '<div class="empty">No venues found.</div>';
}

/* Calendar filters and calendar */
function updateFilters() {
    var venueSelect = document.getElementById("calendarVenue");
    var oldVenue = venueSelect.value;
    var venueHTML = '<option value="">All venues</option>';

    for (var i=0; i<venues.length; i++) {
        venueHTML += '<option>' + safeText(venues[i].name) + '</option>';
    }
    venueSelect.innerHTML = venueHTML;
    venueSelect.value = oldVenue;

    var sportSelect = document.getElementById("standingSport");
    var oldSport = sportSelect.value;
    var sportHTML = '<option value="">All sports</option>';
    for (var j=0; j<sports.length; j++) sportHTML += '<option>' + safeText(sports[j].name) + '</option>';
    sportSelect.innerHTML = sportHTML;
    sportSelect.value = oldSport;

    var playerSport = document.getElementById("playerSportFilter");
    var oldPlayerSport = playerSport.value;
    playerSport.innerHTML = '<option value="">All sports</option>';
    for (var k=0; k<sports.length; k++) playerSport.innerHTML += '<option>' + safeText(sports[k].name) + '</option>';
    playerSport.value = oldPlayerSport;

    var teamSport = document.getElementById("teamSport");
    if (teamSport) {
        var oldTeamSport = teamSport.value;
        teamSport.innerHTML = '<option value="">Choose a sport</option>';
        for (var s=0; s<sports.length; s++) teamSport.innerHTML += '<option>' + safeText(sports[s].name) + '</option>';
        teamSport.value = oldTeamSport;
    }

    updateMonthSelect();
}

function updateMonthSelect() {
    var select = document.getElementById("calendarMonth");
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var html = "";
    for (var i=0; i<12; i++) html += '<option value="' + i + '">' + months[i] + ' ' + calendarYear + '</option>';
    select.innerHTML = html;
    select.value = calendarMonthNumber;
}

function changeCalendarMonth(amount) {
    calendarMonthNumber += amount;
    if (calendarMonthNumber > 11) { calendarMonthNumber = 0; calendarYear++; }
    if (calendarMonthNumber < 0) { calendarMonthNumber = 11; calendarYear--; }
    updateMonthSelect();
    renderCalendar();
}

function selectCalendarDate(dateText) {
    selectedCalendarDate = dateText;
    renderCalendar();
}

function renderCalendar() {
    var select = document.getElementById("calendarMonth");
    if (!select) return;

    if (select.value !== "") calendarMonthNumber = Number(select.value);

    var firstDay = new Date(calendarYear, calendarMonthNumber, 1).getDay();
    var daysInMonth = new Date(calendarYear, calendarMonthNumber + 1, 0).getDate();
    var venueFilter = document.getElementById("calendarVenue").value;
    var html = '<div class="calendar-day-name">Sun</div><div class="calendar-day-name">Mon</div><div class="calendar-day-name">Tue</div><div class="calendar-day-name">Wed</div><div class="calendar-day-name">Thu</div><div class="calendar-day-name">Fri</div><div class="calendar-day-name">Sat</div>';

    for (var blank=0; blank<firstDay; blank++) html += '<button class="calendar-cell" disabled></button>';

    for (var day=1; day<=daysInMonth; day++) {
        var dateText = calendarYear + "-" + String(calendarMonthNumber + 1).padStart(2,"0") + "-" + String(day).padStart(2,"0");
        var hasBooking = false;

        for (var b=0; b<bookings.length; b++) {
            if (bookings[b].date === dateText &&
                bookings[b].status !== "Rejected" &&
                (venueFilter === "" || bookings[b].venue === venueFilter)) hasBooking = true;
        }

        var classes = "calendar-cell";
        if (dateText === selectedCalendarDate) classes += " selected";
        if (dateText === new Date().toISOString().slice(0,10)) classes += " today";
        if (hasBooking) classes += " booked-day";

        html += '<button class="' + classes + '" onclick="selectCalendarDate(\'' + dateText + '\')"><span>' + day + '</span></button>';
    }

    document.getElementById("calendarGrid").innerHTML = html;
    renderDateAvailability();
}

function renderDateAvailability() {
    var title = document.getElementById("selectedDateTitle");
    var container = document.getElementById("dateAvailability");
    var venueFilter = document.getElementById("calendarVenue").value;
    title.textContent = "Availability for " + selectedCalendarDate;

    var relevant = [];
    for (var i=0; i<bookings.length; i++) {
        var item = bookings[i];
        if (item.date === selectedCalendarDate &&
            item.status !== "Rejected" &&
            item.status !== "Cancelled" &&
            (venueFilter === "" || item.venue === venueFilter)) relevant.push(item);
    }

    if (relevant.length === 0) {
        container.innerHTML = '<div class="empty">No approved or pending bookings on this date. Check a venue to request a slot.</div>';
        return;
    }

    var html = "";
    for (var j=0; j<relevant.length; j++) {
        html += '<div class="row"><span>' + safeText(relevant[j].venue) + ' · ' +
            safeText(relevant[j].slot) + '</span>' + statusBadge(relevant[j].status) + '</div>';
    }
    container.innerHTML = html;
}

function renderMatches() {
    var query = document.getElementById("matchSearch").value.toLowerCase();
    var filter = document.getElementById("matchFilter").value;
    var allHTML = "", liveHTML = "", upcomingHTML = "";

    for (var i=0; i<matches.length; i++) {
        var match = matches[i];
        var text = (match.sport + " " + getTeamName(match.home) + " " +
            getTeamName(match.away) + " " + match.venue).toLowerCase();

        if (text.indexOf(query) === -1 || (filter !== "" && match.status !== filter)) continue;

        allHTML += makeMatchCard(match);
        if (match.status === "Ongoing") liveHTML += makeMatchCard(match);
        if (match.status === "Upcoming") upcomingHTML += makeMatchCard(match);
    }

    document.getElementById("matchList").innerHTML = allHTML || '<div class="empty">No matches found.</div>';
    document.getElementById("liveMatches").innerHTML = liveHTML || '<div class="empty">No live matches.</div>';
    document.getElementById("upcomingMatches").innerHTML = upcomingHTML || '<div class="empty">No upcoming matches.</div>';
}

function makeMatchCard(match) {
    var score = match.status === "Upcoming" ? "vs" : match.homeScore + " - " + match.awayScore;
    var html = '<article class="card"><div style="display:flex;justify-content:space-between;gap:8px"><h3>' +
        safeText(match.sport) + ': ' + safeText(getTeamName(match.home)) + ' ' + score + ' ' +
        safeText(getTeamName(match.away)) + '</h3>' + statusBadge(match.status) + '</div>' +
        '<p><b>Date:</b> ' + safeText(match.date) + ' · <b>Slot:</b> ' + safeText(match.slot) +
        '</p><p><b>Venue:</b> ' + safeText(match.venue) + '</p>' +
        '<p><b>Referee:</b> ' + safeText(match.referee || "Not assigned") +
        '</p><p><b>Notes:</b> ' + safeText(match.notes || "No extra notes") + '</p>' +
        '<button class="button secondary small" onclick="showMatchDetails(' + match.id + ')">Match details</button>';

    if (isManager()) {
        if (match.status === "Upcoming") {
            html += '<button class="button success small" onclick="setMatchStatus(' + match.id + ',\'Ongoing\')">Start live</button>';
        }
        if (match.status === "Ongoing") {
            html += '<button class="button primary small" onclick="updateScore(' + match.id + ')">Update score</button>';
            html += '<button class="button success small" onclick="setMatchStatus(' + match.id + ',\'Completed\')">Finish</button>';
        }
    }

    return html + '</article>';
}

function showMatchDetails(id) {
    var match = findMatch(id);
    if (!match) return;

    alert(
        "Sport: " + match.sport +
        "\nTeams: " + getTeamName(match.home) + " vs " + getTeamName(match.away) +
        "\nDate: " + match.date +
        "\nPreferred slot: " + match.slot +
        "\nVenue: " + match.venue +
        "\nReferee: " + (match.referee || "Not assigned") +
        "\nNotes: " + (match.notes || "No notes")
    );
}

function findMatch(id) {
    for (var i=0; i<matches.length; i++) if (matches[i].id === id) return matches[i];
    return null;
}

function setMatchStatus(id, status) {
    var match = findMatch(id);
    if (!match) return;
    match.status = status;
    saveData();
    addNotification(match.sport + " match status changed to " + status + ".");
    renderEverything();
    showToast("Match status updated.");
}

function updateScore(id) {
    var match = findMatch(id);
    if (!match) return;

    var homeScore = prompt("Enter home team score:", match.homeScore);
    if (homeScore === null || homeScore === "") return;
    var awayScore = prompt("Enter away team score:", match.awayScore);
    if (awayScore === null || awayScore === "") return;

    match.homeScore = Number(homeScore);
    match.awayScore = Number(awayScore);
    saveData();
    addNotification("Live score updated for " + match.sport + ".");
    renderEverything();
    showToast("Score updated.");
}

/* Player cards and simple stats */
function renderPlayers() {
    var query = document.getElementById("playerSearch").value.toLowerCase();
    var sport = document.getElementById("playerSportFilter").value;
    var html = "";

    for (var i=0; i<players.length; i++) {
        var player = players[i];
        var matchesText = (player.name + " " + player.email + " " + player.team).toLowerCase().indexOf(query) !== -1;

        if (matchesText && (sport === "" || player.sport === sport)) {
            html += '<article class="card"><h3>👤 ' + safeText(player.name) +
                '</h3><p><b>Sport:</b> ' + safeText(player.sport) + '</p><p><b>Team:</b> ' +
                safeText(player.team) + '</p><p><b>Appearances:</b> ' + player.appearances +
                ' · <b>Goals:</b> ' + player.goals + ' · <b>Points:</b> ' + player.points +
                '</p><p><b>Email:</b> ' + safeText(player.email) + '</p>' +
                (isManager() ? '<button class="button secondary small" onclick="editPlayerStats(' + player.id + ')">Edit stats</button>' : '') +
                '</article>';
        }
    }
    document.getElementById("playerList").innerHTML = html || '<div class="empty">No player profiles found.</div>';
}

function renderTeams() {
    var html = "";
    for (var i=0; i<teams.length; i++) {
        var team = teams[i];
        html += '<article class="card"><h3>🛡 ' + safeText(team.name) +
            '</h3><p><b>Sport:</b> ' + safeText(team.sport) + '</p><p><b>Division:</b> ' +
            safeText(team.division || "Open") + '</p><p><b>Coach/contact:</b> ' +
            safeText(team.coach || "Not provided") + '</p></article>';
    }
    document.getElementById("teamList").innerHTML = html || '<div class="empty">No teams registered yet.</div>';
}

document.getElementById("teamForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var name = document.getElementById("teamName").value.trim();
    var sport = document.getElementById("teamSport").value;
    var division = document.getElementById("teamDivision").value;
    var coach = document.getElementById("teamCoach").value.trim();

    if (teams.some(function(team) { return team.name.toLowerCase() === name.toLowerCase(); })) {
        return showToast("A team with that name is already registered.");
    }

    teams.push({id:makeId(),name:name,sport:sport,division:division,coach:coach});
    saveData();
    addNotification("New " + sport + " team registered: " + name + ".");
    this.reset();
    renderEverything();
    showToast("Team registered successfully.");
});

function editPlayerStats(id) {
    var player = null;
    for (var i=0; i<players.length; i++) if (players[i].id === id) player = players[i];
    if (!player) return;

    var appearances = prompt("Appearances:", player.appearances);
    if (appearances === null) return;
    var goals = prompt("Goals or event wins:", player.goals);
    if (goals === null) return;
    var points = prompt("Points:", player.points);
    if (points === null) return;

    player.appearances = Number(appearances);
    player.goals = Number(goals);
    player.points = Number(points);
    saveData();
    renderEverything();
    showToast("Player stats updated.");
}

/* Booking form */
function openBookingForm(venueIndex) {
    var venue = venues[venueIndex];
    var sportOptions = "";

    for (var i=0; i<venue.sports.length; i++) {
        sportOptions += '<option>' + safeText(venue.sports[i]) + '</option>';
    }

    document.getElementById("modalTitle").textContent = "Request a venue booking";
    document.getElementById("modalDescription").textContent = venue.name + " · " + venue.location;

    var html = '<div class="field"><label>Student name</label><input id="bookingStudent" required value="' + safeText(currentUser.name) + '"></div>';
    html += '<div class="field"><label>Student email</label><input id="bookingEmail" type="email" required value="' + safeText(currentUser.email) + '"></div>';
    html += '<div class="field"><label>Sport</label><select id="bookingSport">' + sportOptions + '</select></div>';
    html += '<div class="field"><label>Venue</label><input disabled value="' + safeText(venue.name) + '"></div>';
    html += '<div class="field"><label>Preferred date</label><input id="bookingDate" type="date" required min="' + new Date().toISOString().slice(0,10) + '"></div>';
    html += '<div class="field"><label>Preferred time slot</label><select id="bookingSlot" required><option value="">Choose a slot</option><option>Morning (6–9 AM)</option><option>Late morning (9 AM–12 PM)</option><option>Afternoon (2–5 PM)</option><option>Evening (5–8 PM)</option></select></div>';
    html += '<button class="button primary">Submit booking request</button>';

    document.getElementById("modalForm").innerHTML = html;

    document.getElementById("modalForm").onsubmit = function(event) {
        event.preventDefault();

        var date = document.getElementById("bookingDate").value;
        var slot = document.getElementById("bookingSlot").value;

        if (isSlotBooked(venue.name, date, slot, -1)) {
            showToast("This venue and slot already have an approved booking.");
            return;
        }

        var newBooking = {
            id:makeId(),
            student:document.getElementById("bookingStudent").value.trim(),
            email:document.getElementById("bookingEmail").value.trim(),
            sport:document.getElementById("bookingSport").value,
            venue:venue.name,
            date:date,
            slot:slot,
            status:"Pending",
            changeType:"",
            requestedDate:"",
            requestedSlot:""
        };

        bookings.push(newBooking);
        saveData();
        addNotification("New venue booking request from " + newBooking.student + ".");
        closeModal();
        renderEverything();
        showToast("Booking submitted for approval.");
    };

    document.getElementById("modalBackdrop").classList.remove("hidden");
}

function isSlotBooked(venueName, date, slot, ignoreId) {
    for (var i=0; i<bookings.length; i++) {
        var booking = bookings[i];
        if (booking.id !== ignoreId &&
            booking.venue === venueName &&
            booking.date === date &&
            booking.slot === slot &&
            booking.status === "Approved") {
            return true;
        }
    }
    return false;
}

function renderBookings() {
    var query = document.getElementById("bookingSearch").value.toLowerCase();
    var filter = document.getElementById("bookingFilter").value;
    var html = "";

    for (var i=0; i<bookings.length; i++) {
        var b = bookings[i];
        var text = (b.student + " " + b.sport + " " + b.venue).toLowerCase();

        if (text.indexOf(query) === -1 || (filter !== "" && b.status !== filter)) continue;
        if (currentUser.role === "Student" && b.email !== currentUser.email) continue;

        var actions = "";
        if (isManager() && b.status === "Pending") {
            actions = '<button class="button success small" onclick="approveBooking(' + b.id + ')">Approve</button>' +
                '<button class="button danger small" onclick="rejectBooking(' + b.id + ')">Reject</button>';
        } else if (isManager() && b.status === "Change Requested") {
            actions = '<button class="button success small" onclick="approveChange(' + b.id + ')">Approve change</button>' +
                '<button class="button danger small" onclick="rejectChange(' + b.id + ')">Reject change</button>';
        } else if (isManager() && b.status === "Cancellation Requested") {
            actions = '<button class="button success small" onclick="approveCancel(' + b.id + ')">Approve cancel</button>' +
                '<button class="button danger small" onclick="rejectChange(' + b.id + ')">Keep booking</button>';
        } else if (currentUser.role === "Student" && b.email === currentUser.email && b.status === "Approved") {
            actions = '<button class="button secondary small" onclick="requestChange(' + b.id + ')">Reschedule</button>' +
                '<button class="button danger small" onclick="requestCancel(' + b.id + ')">Cancel</button>';
        }

        var requestText = "";
        if (b.status === "Change Requested") requestText = '<br><small>New: ' + safeText(b.requestedDate) + ' · ' + safeText(b.requestedSlot) + '</small>';

        html += '<tr><td>' + safeText(b.student) + '<br>' + safeText(b.email) +
            '</td><td>' + safeText(b.sport) + '</td><td>' + safeText(b.venue) +
            '</td><td>' + safeText(b.date) + requestText + '</td><td>' + safeText(b.slot) +
            '</td><td>' + statusBadge(b.status) + '</td><td>' + actions + '</td></tr>';
    }

    document.getElementById("bookingList").innerHTML = html || '<tr><td colspan="7">No bookings found.</td></tr>';
}

function findBooking(id) {
    for (var i=0; i<bookings.length; i++) if (bookings[i].id === id) return bookings[i];
    return null;
}

function approveBooking(id) {
    var b = findBooking(id);
    if (!b) return;
    if (isSlotBooked(b.venue,b.date,b.slot,b.id)) return showToast("That slot is already approved for another booking.");
    b.status = "Approved";
    saveData();
    addNotification("Your booking for " + b.venue + " on " + b.date + " was approved.");
    renderEverything();
    showToast("Booking approved.");
}

function rejectBooking(id) {
    var b = findBooking(id);
    if (!b) return;
    b.status = "Rejected";
    saveData();
    addNotification("Your booking request for " + b.venue + " was rejected.");
    renderEverything();
}

function requestChange(id) {
    var b = findBooking(id);
    if (!b) return;
    var newDate = prompt("Enter your new preferred date (YYYY-MM-DD):", b.date);
    if (!newDate) return;
    var newSlot = prompt("Enter new slot: Morning, Late morning, Afternoon, or Evening", b.slot);
    if (!newSlot) return;

    if (isSlotBooked(b.venue,newDate,newSlot,b.id)) return showToast("That slot is already booked.");

    b.requestedDate = newDate;
    b.requestedSlot = newSlot;
    b.changeType = "Reschedule";
    b.status = "Change Requested";
    saveData();
    addNotification("Reschedule request submitted for " + b.venue + ".");
    renderEverything();
    showToast("Reschedule request sent.");
}

function requestCancel(id) {
    var b = findBooking(id);
    if (!b) return;
    b.changeType = "Cancel";
    b.status = "Cancellation Requested";
    saveData();
    addNotification("Cancellation request submitted for " + b.venue + ".");
    renderEverything();
    showToast("Cancellation request sent.");
}

function approveChange(id) {
    var b = findBooking(id);
    if (!b) return;
    if (isSlotBooked(b.venue,b.requestedDate,b.requestedSlot,b.id)) {
        return showToast("The requested new slot is already booked.");
    }
    b.date = b.requestedDate;
    b.slot = b.requestedSlot;
    b.requestedDate = "";
    b.requestedSlot = "";
    b.changeType = "";
    b.status = "Approved";
    saveData();
    addNotification("Your reschedule request for " + b.venue + " was approved.");
    renderEverything();
}

function approveCancel(id) {
    var b = findBooking(id);
    if (!b) return;
    b.status = "Cancelled";
    saveData();
    addNotification("Your booking for " + b.venue + " was cancelled.");
    renderEverything();
}

function rejectChange(id) {
    var b = findBooking(id);
    if (!b) return;
    b.status = "Approved";
    b.requestedDate = "";
    b.requestedSlot = "";
    b.changeType = "";
    saveData();
    addNotification("Your booking change request was not approved.");
    renderEverything();
}

/* Notifications */
function renderNotifications() {
    var html = "";
    for (var i=0; i<notifications.length; i++) {
        html += '<div class="row"><span>🔔 ' + safeText(notifications[i].message) +
            '</span><small class="muted">' + safeText(notifications[i].date) + '</small></div>';
    }
    document.getElementById("notificationList").innerHTML = html || '<div class="empty">No notifications.</div>';
}

function clearNotifications() {
    notifications = [];
    saveData();
    renderEverything();
    showToast("Notifications cleared.");
}

/* Reports */
function renderReports() {
    var completed = 0;
    for (var i=0; i<matches.length; i++) {
        if (matches[i].status === "Completed") completed++;
    }

    document.getElementById("reportSports").textContent = sports.length;
    document.getElementById("reportTeams").textContent = teams.length;
    document.getElementById("reportMatches").textContent = completed;
    document.getElementById("reportBookings").textContent = bookings.length;

    var venueCounts = {};
    for (var j=0; j<bookings.length; j++) {
        var venueName = bookings[j].venue;
        if (!venueCounts[venueName]) venueCounts[venueName] = 0;
        venueCounts[venueName]++;
    }

    var venueHTML = "";
    for (var name in venueCounts) {
        venueHTML += '<div class="row"><span>' + safeText(name) + '</span><b>' + venueCounts[name] + ' request(s)</b></div>';
    }
    document.getElementById("venueReport").innerHTML = venueHTML || '<p class="muted">No booking requests yet.</p>';

    var sportCounts = {};
    for (var k=0; k<matches.length; k++) {
        if (matches[k].status === "Completed") {
            var sportName = matches[k].sport;
            if (!sportCounts[sportName]) sportCounts[sportName] = 0;
            sportCounts[sportName]++;
        }
    }

    var sportHTML = "";
    for (var sport in sportCounts) {
        sportHTML += '<div class="row"><span>' + safeText(sport) + '</span><b>' + sportCounts[sport] + ' completed</b></div>';
    }
    document.getElementById("sportReport").innerHTML = sportHTML || '<p class="muted">No completed matches yet.</p>';

    renderStandings();
    document.getElementById("reportStandings").innerHTML = document.getElementById("standingList").innerHTML;
}

/* Match scheduling */
function openMatchForm() {
    if (!isManager()) return showToast("Only organizers can schedule matches.");
    if (teams.length < 2) return showToast("Add at least two teams first.");

    var sportOptions = "";
    for (var i=0; i<sports.length; i++) sportOptions += '<option>' + safeText(sports[i].name) + '</option>';

    var teamOptions = "";
    for (var j=0; j<teams.length; j++) teamOptions += '<option value="' + teams[j].id + '">' + safeText(teams[j].name) + '</option>';

    var venueOptions = "";
    for (var k=0; k<venues.length; k++) venueOptions += '<option>' + safeText(venues[k].name) + '</option>';

    document.getElementById("modalTitle").textContent = "Schedule match";
    document.getElementById("modalDescription").textContent = "Choose match details, venue and preferred time.";

    document.getElementById("modalForm").innerHTML =
        '<div class="field"><label>Sport</label><select id="matchSport">' + sportOptions + '</select></div>' +
        '<div class="field"><label>Home team</label><select id="homeTeam">' + teamOptions + '</select></div>' +
        '<div class="field"><label>Away team</label><select id="awayTeam">' + teamOptions + '</select></div>' +
        '<div class="field"><label>Date</label><input id="matchDate" type="date" required></div>' +
        '<div class="field"><label>Preferred slot</label><select id="matchSlot"><option>Morning (6–9 AM)</option><option>Late morning (9 AM–12 PM)</option><option>Afternoon (2–5 PM)</option><option>Evening (5–8 PM)</option></select></div>' +
        '<div class="field"><label>Venue</label><select id="matchVenue">' + venueOptions + '</select></div>' +
        '<div class="field"><label>Referee</label><input id="matchReferee" placeholder="Optional"></div>' +
        '<div class="field"><label>Rules or notes</label><textarea id="matchNotes" placeholder="Add match notes"></textarea></div>' +
        '<button class="button primary">Save match</button>';

    document.getElementById("modalForm").onsubmit = function(event) {
        event.preventDefault();

        var home = Number(document.getElementById("homeTeam").value);
        var away = Number(document.getElementById("awayTeam").value);

        if (home === away) return showToast("Choose two different teams.");

        var match = {
            id:makeId(),
            sport:document.getElementById("matchSport").value,
            home:home,
            away:away,
            date:document.getElementById("matchDate").value,
            slot:document.getElementById("matchSlot").value,
            venue:document.getElementById("matchVenue").value,
            referee:document.getElementById("matchReferee").value,
            notes:document.getElementById("matchNotes").value,
            status:"Upcoming",
            homeScore:0,
            awayScore:0
        };

        matches.push(match);
        saveData();
        addNotification("A new " + match.sport + " match was scheduled for " + match.date + ".");
        closeModal();
        renderEverything();
        showToast("Match scheduled.");
    };

    document.getElementById("modalBackdrop").classList.remove("hidden");
}

/* Standings */
function renderStandings() {
    var selectedSport = document.getElementById("standingSport").value;
    var table = [];

    for (var i=0; i<teams.length; i++) {
        if (selectedSport === "" || teams[i].sport === selectedSport) {
            table.push({id:teams[i].id,name:teams[i].name,played:0,wins:0,draws:0,losses:0,points:0});
        }
    }

    for (var m=0; m<matches.length; m++) {
        var match = matches[m];
        if (match.status !== "Completed") continue;
        if (selectedSport !== "" && match.sport !== selectedSport) continue;

        var homeRow = null;
        var awayRow = null;

        for (var r=0; r<table.length; r++) {
            if (table[r].id === match.home) homeRow = table[r];
            if (table[r].id === match.away) awayRow = table[r];
        }

        if (homeRow === null || awayRow === null || homeRow === awayRow) continue;
        homeRow.played++;
        awayRow.played++;

        if (Number(match.homeScore) > Number(match.awayScore)) {
            homeRow.wins++;
            homeRow.points += 3;
            awayRow.losses++;
        } else if (Number(match.homeScore) < Number(match.awayScore)) {
            awayRow.wins++;
            awayRow.points += 3;
            homeRow.losses++;
        } else {
            homeRow.draws++;
            awayRow.draws++;
            homeRow.points++;
            awayRow.points++;
        }
    }

    table.sort(function(a,b) { return b.points - a.points; });
    var html = "";
    for (var j=0; j<table.length; j++) {
        html += '<tr><td>' + (j+1) + '</td><td>' + safeText(table[j].name) +
            '</td><td>' + table[j].played + '</td><td>' + table[j].wins +
            '</td><td>' + table[j].draws + '</td><td>' + table[j].losses +
            '</td><td><b>' + table[j].points + '</b></td></tr>';
    }

    document.getElementById("standingList").innerHTML = html || '<tr><td colspan="7">No teams found.</td></tr>';
}

/* Player management */
function addPlayer() {
    var name = prompt("Player name:");
    if (!name) return;
    var email = prompt("Player email:");
    if (!email) return;
    var sport = prompt("Sport:");
    if (!sport) return;
    var team = prompt("Team name:");
    if (!team) return;

    players.push({
        id:makeId(), name:name, email:email, sport:sport, team:team,
        appearances:0, goals:0, points:0
    });

    saveData();
    renderEverything();
    showToast("Player profile added.");
}

/* Admin profile */
function loadAdminProfile() {
    document.getElementById("adminName").value = currentUser.name;
    document.getElementById("adminEmail").value = currentUser.email;
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
}

document.getElementById("profileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if (currentUser.role !== "Admin") return showToast("Admin access required.");

    if (document.getElementById("oldPassword").value !== currentUser.password) {
        return showToast("Current password is incorrect.");
    }

    var newEmail = document.getElementById("adminEmail").value.trim().toLowerCase();
    for (var i=0; i<users.length; i++) {
        if (users[i].id !== currentUser.id && users[i].email.toLowerCase() === newEmail) {
            return showToast("Email is already in use.");
        }
    }

    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== "" && newPassword.length < 6) return showToast("New password needs 6 characters.");
    if (newPassword !== confirmPassword) return showToast("Passwords do not match.");

    currentUser.name = document.getElementById("adminName").value.trim();
    currentUser.email = newEmail;
    if (newPassword !== "") currentUser.password = newPassword;

    for (var j=0; j<users.length; j++) {
        if (users[j].id === currentUser.id) users[j] = currentUser;
    }

    saveData();
    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("avatar").textContent = currentUser.name.charAt(0).toUpperCase();
    loadAdminProfile();
    showToast("Admin profile updated.");
});

/* Popup controls */
function closeModal() {
    document.getElementById("modalBackdrop").classList.add("hidden");
    document.getElementById("modalForm").reset();
}

document.getElementById("modalBackdrop").addEventListener("click", function(event) {
    if (event.target === this) closeModal();
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeModal();
});

/* Start with today's date selected and display the first page data. */
renderEverything();
