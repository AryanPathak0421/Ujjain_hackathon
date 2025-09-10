 // Initialize crowd chart
 const crowdChart = new Chart(document.getElementById('crowdChart'), {
    type: 'line',
    data: {
        labels: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        datasets: [{
            label: 'Crowd Density (people/m²)',
            data: [3.2, 4.5, 5.8, 6.2, 4.8, 5.1, 6.5],
            borderColor: '#2c5282',
            backgroundColor: 'rgba(44, 82, 130, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('current-time-display').textContent = timeString;
}

updateCurrentTime();
setInterval(updateCurrentTime, 60000);

// Mock data and state management
let systemData = {
    totalVisitors: 247382,
    currentDensity: 4.2,
    alerts: [
        {
            id: 1,
            type: 'info',
            message: 'Main Ghat area experiencing moderate crowd buildup',
            time: '2 minutes ago',
            icon: 'info-circle'
        }
    ],
    metrics: {
        crowd: { value: 'Normal', trend: 'Normal', color: 'normal' },
        weather: { value: '28°C', trend: 'Good', color: 'normal' },
        movement: { value: '1.2 m/s', trend: 'Smooth', color: 'normal' }
    }
};

// Form handling
const form = document.getElementById("hazardForm");
const resultBox = document.getElementById("result");
const hazardLevel = document.getElementById("hazardLevel");
const hazardMessage = document.getElementById("hazardMessage");
const scoreValue = document.getElementById("scoreValue");
const recommendations = document.getElementById("recommendations");
const recommendationsList = document.getElementById("recommendationsList");

// Location-specific risk factors
const locationRiskFactors = {
    'main_ghat': 1.5,
    'ram_ghat': 1.3,
    'entrance': 1.4,
    'parking': 1.1,
    'food_court': 1.2,
    'accommodation': 1.0
};

// Time-specific risk factors
const timeRiskFactors = {
    'early_morning': 1.8, // High spiritual activity
    'morning': 1.4,
    'afternoon': 1.2,
    'evening': 1.6, // Evening prayers
    'night': 1.0
};

function calculateRiskScore(density, temp, speed, location, timeOfDay) {
    let baseScore = 0;

    // Crowd density scoring (0-40 points)
    if (density > 8) baseScore += 40;
    else if (density > 6) baseScore += 30;
    else if (density > 4) baseScore += 20;
    else if (density > 2) baseScore += 10;

    // Temperature scoring (0-25 points)
    if (temp > 40 || temp < 5) baseScore += 25;
    else if (temp > 35 || temp < 10) baseScore += 15;
    else if (temp > 30 || temp < 15) baseScore += 10;

    // Movement speed scoring (0-20 points)
    if (speed < 0.5) baseScore += 20; // Very slow = congestion
    else if (speed < 1.0) baseScore += 15;
    else if (speed > 3.0) baseScore += 10; // Too fast = panic

    // Location multiplier
    const locationFactor = locationRiskFactors[location] || 1.0;
    const timeFactor = timeRiskFactors[timeOfDay] || 1.0;

    baseScore *= (locationFactor * timeFactor);

    return Math.min(Math.round(baseScore), 100);
}

function getHazardLevel(score) {
    if (score >= 80) return { level: "Critical", class: "critical" };
    if (score >= 60) return { level: "Highly Crowded", class: "highly-crowded" };
    if (score >= 35) return { level: "Crowded", class: "crowded" };
    return { level: "Safe", class: "safe" };
}

function generateRecommendations(score, location, timeOfDay, density, temp, speed) {
    const recommendations = [];

    if (score >= 80) {
        recommendations.push("🚨 IMMEDIATE EVACUATION: Deploy emergency evacuation protocols");
        recommendations.push("📢 Activate loudspeaker announcements in local languages");
        recommendations.push("👮 Deploy additional security personnel immediately");
        recommendations.push("🚑 Alert medical teams and ambulance services");
    } else if (score >= 60) {
        recommendations.push("⚠️ Implement crowd control barriers");
        recommendations.push("📱 Send SMS alerts to registered pilgrims");
        recommendations.push("🚶 Open alternative routes and passages");
        recommendations.push("💧 Increase water distribution points");
    } else if (score >= 35) {
        recommendations.push("👁️ Increase monitoring frequency");
        recommendations.push("📊 Monitor entry points more closely");
        recommendations.push("🔊 Make periodic safety announcements");
    } else {
        recommendations.push("✅ Continue normal operations");
        recommendations.push("🔄 Maintain regular monitoring schedule");
        recommendations.push("📋 Log current conditions for analysis");
    }

    // Location-specific recommendations
    if (location === 'main_ghat' && score > 50) {
        recommendations.push("🏛️ Consider redirecting pilgrims to alternative ghats");
    }

    // Weather-specific recommendations
    if (temp > 35) {
        recommendations.push("☀️ Increase shade and cooling arrangements");
        recommendations.push("💧 Deploy additional water tankers");
    }

    return recommendations;
}

// Enhanced form submission with validation
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
        return;
    }

    const submitBtn = form.querySelector('button');
    submitBtn.innerHTML = '<div class="loading"></div> Analyzing Risk Factors...';
    submitBtn.disabled = true;

    // Simulate API processing time
    setTimeout(() => {
        const density = parseFloat(document.getElementById("crowd_density").value);
        const temp = parseFloat(document.getElementById("temperature").value);
        const speed = parseFloat(document.getElementById("movement_speed").value);
        const location = document.getElementById("location").value;
        const timeOfDay = document.getElementById("time_of_day").value;

        const riskScore = calculateRiskScore(density, temp, speed, location, timeOfDay);
        const hazard = getHazardLevel(riskScore);

        // Update result display with enhanced animations
        resultBox.style.display = 'block';
        resultBox.className = `result-box ${hazard.class}`;

        const statusIcon = riskScore >= 80 ? "fas fa-exclamation-triangle" : 
                         riskScore >= 60 ? "fas fa-exclamation-circle" :
                         riskScore >= 35 ? "fas fa-info-circle" : "fas fa-check-circle";

        hazardLevel.innerHTML = `<i class="${statusIcon}"></i> Status: ${hazard.level}`;
        scoreValue.textContent = riskScore;

        // Generate enhanced contextual messages
        let message = "";
        const locationName = location.replace('_', ' ').toUpperCase();
        
        if (riskScore >= 80) {
            message = `🚨 CRITICAL ALERT: Immediate evacuation required in ${locationName} zone. Deploy emergency response teams. Risk Score: ${riskScore}/100`;
        } else if (riskScore >= 60) {
            message = `⚠️ HIGH RISK: Significant crowd density in ${locationName}. Implement crowd control measures and monitor closely. Risk Score: ${riskScore}/100`;
        } else if (riskScore >= 35) {
            message = `⚡ MODERATE RISK: Elevated crowd levels in ${locationName} during ${timeOfDay.replace('_', ' ')}. Increase surveillance. Risk Score: ${riskScore}/100`;
        } else {
            message = `✅ SAFE CONDITIONS: Current situation in ${locationName} is manageable. Continue standard monitoring. Risk Score: ${riskScore}/100`;
        }

        hazardMessage.textContent = message;

        // Show enhanced recommendations
        const recs = generateRecommendations(riskScore, location, timeOfDay, density, temp, speed);
        recommendationsList.innerHTML = recs.map(rec => 
            `<div class="recommendation-item">${rec}</div>`
        ).join('');
        recommendations.style.display = 'block';

        // Update live dashboard
        updateLiveMetrics(density, temp, speed, riskScore);

        // Add new alert based on assessment
        if (riskScore >= 35) {
            addAssessmentAlert(hazard.level, locationName, riskScore);
        }

        submitBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Risk Level';
        submitBtn.disabled = false;

        // Scroll to results
        resultBox.scrollIntoView({ behavior: 'smooth' });
    }, 2000); // Longer processing time for realism
});

function updateLiveMetrics(density, temp, speed, riskScore) {
    // Update crowd trend
    const crowdTrend = document.getElementById('crowdTrend');
    const crowdMetric = document.querySelector('#livecrowd').parentElement.parentElement;
    
    if (density > 6) {
        crowdTrend.textContent = 'High';
        crowdTrend.className = 'metric-trend danger';
        crowdMetric.style.borderLeftColor = 'var(--danger)';
    } else if (density > 4) {
        crowdTrend.textContent = 'Moderate';
        crowdTrend.className = 'metric-trend warning';
        crowdMetric.style.borderLeftColor = 'var(--warning)';
    } else {
        crowdTrend.textContent = 'Normal';
        crowdTrend.className = 'metric-trend';
        crowdMetric.style.borderLeftColor = 'var(--success)';
    }

    // Update weather trend
    const weatherTrend = document.getElementById('weatherTrend');
    const weatherMetric = document.querySelector('#liveWeather').parentElement.parentElement;
    
    if (temp > 38 || temp < 8) {
        weatherTrend.textContent = 'Extreme';
        weatherTrend.className = 'metric-trend danger';
        weatherMetric.style.borderLeftColor = 'var(--danger)';
    } else if (temp > 33 || temp < 12) {
        weatherTrend.textContent = 'Challenging';
        weatherTrend.className = 'metric-trend warning';
        weatherMetric.style.borderLeftColor = 'var(--warning)';
    } else {
        weatherTrend.textContent = 'Good';
        weatherTrend.className = 'metric-trend';
        weatherMetric.style.borderLeftColor = 'var(--success)';
    }

    // Update movement trend
    const movementTrend = document.getElementById('movementTrend');
    const movementMetric = document.querySelector('#liveMovement').parentElement.parentElement;
    
    if (speed < 0.5 || speed > 2.5) {
        movementTrend.textContent = 'Congested';
        movementTrend.className = 'metric-trend danger';
        movementMetric.style.borderLeftColor = 'var(--danger)';
    } else if (speed < 1.0 || speed > 2.0) {
        movementTrend.textContent = 'Slow';
        movementTrend.className = 'metric-trend warning';
        movementMetric.style.borderLeftColor = 'var(--warning)';
    } else {
        movementTrend.textContent = 'Smooth';
        movementTrend.className = 'metric-trend';
        movementMetric.style.borderLeftColor = 'var(--success)';
    }

    // Update live values
    document.getElementById('liveWeather').textContent = `${temp}°C`;
    document.getElementById('liveMovement').textContent = `${speed} m/s`;
    document.getElementById('currentDensity').textContent = density.toFixed(1);
    
    // Update crowd level text
    if (density > 6) {
        document.getElementById('livecrowd').textContent = 'High';
    } else if (density > 4) {
        document.getElementById('livecrowd').textContent = 'Moderate';
    } else {
        document.getElementById('livecrowd').textContent = 'Normal';
    }
}

function addAssessmentAlert(level, location, score) {
    const alertsList = document.getElementById('alertsList');
    const icons = {
        'Critical': 'exclamation-triangle',
        'Highly Crowded': 'exclamation-circle',
        'Crowded': 'info-circle',
        'Safe': 'check-circle'
    };

    const newAlert = document.createElement('div');
    newAlert.className = 'alert-item';
    newAlert.innerHTML = `
        <i class="fas fa-${icons[level]} alert-icon"></i>
        <div class="alert-content">
            <strong>Assessment Complete:</strong> ${level} status detected in ${location} (Score: ${score})
            <div class="alert-time">
                <i class="fas fa-clock"></i> Just now
            </div>
        </div>
    `;
    
    alertsList.insertBefore(newAlert, alertsList.firstChild);
    
    // Keep only last 4 alerts
    if (alertsList.children.length > 4) {
        alertsList.removeChild(alertsList.lastChild);
    }

    // Animate new alert
    newAlert.style.opacity = '0';
    newAlert.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        newAlert.style.transition = 'all 0.3s ease';
        newAlert.style.opacity = '1';
        newAlert.style.transform = 'translateX(0)';
    }, 100);
}

// Enhanced input validation
function validateInputs() {
    const density = parseFloat(document.getElementById("crowd_density").value);
    const temp = parseFloat(document.getElementById("temperature").value);
    const speed = parseFloat(document.getElementById("movement_speed").value);

    let isValid = true;
    let errors = [];

    if (isNaN(density) || density < 0 || density > 20) {
        errors.push("Crowd density must be between 0-20 people/m²");
        isValid = false;
    }

    if (isNaN(temp) || temp < -10 || temp > 55) {
        errors.push("Temperature must be between -10°C to 55°C");
        isValid = false;
    }

    if (isNaN(speed) || speed < 0 || speed > 5) {
        errors.push("Movement speed must be between 0-5 m/s");
        isValid = false;
    }

    if (!isValid) {
        alert("Input Validation Errors:\n" + errors.join("\n"));
    }

    return isValid;
}

// Simulate real-time data updates
function simulateRealTimeUpdates() {
    const totalVisitorsEl = document.getElementById('totalVisitors');
    let currentVisitors = 247382;

    setInterval(() => {
        // Randomly increase visitors (simulating pilgrim flow)
        currentVisitors += Math.floor(Math.random() * 20) + 5;
        totalVisitorsEl.textContent = currentVisitors.toLocaleString('en-IN');

        // Randomly update crowd density
        const newDensity = (Math.random() * 2 + 3).toFixed(1);
        document.getElementById('currentDensity').textContent = newDensity;

        // Add random alerts occasionally
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
            addRandomAlert();
        }
        
        // Update chart with new data
        const newData = crowdChart.data.datasets[0].data;
        newData.push((Math.random() * 3 + 4).toFixed(1));
        if (newData.length > 7) newData.shift();
        crowdChart.update();
    }, 5000);
}

function addRandomAlert() {
    const alertTypes = [
        { type: 'warning', icon: 'exclamation-triangle', message: 'Increased crowd movement detected in Ram Ghat area' },
        { type: 'info', icon: 'info-circle', message: 'Weather update: Light breeze expected in evening hours' },
        { type: 'success', icon: 'check-circle', message: 'Crowd flow normalized in Main Entrance zone' }
    ];

    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const alertsList = document.getElementById('alertsList');
    
    const newAlert = document.createElement('div');
    newAlert.className = 'alert-item';
    newAlert.innerHTML = `
        <i class="fas fa-${randomAlert.icon} alert-icon"></i>
        <div class="alert-content">
            <strong>Live Update:</strong> ${randomAlert.message}
            <div class="alert-time">
                <i class="fas fa-clock"></i> Just now
            </div>
        </div>
    `;
    
    alertsList.insertBefore(newAlert, alertsList.firstChild);
    
    // Keep only last 3 alerts
    if (alertsList.children.length > 3) {
        alertsList.removeChild(alertsList.lastChild);
    }

    // Animate new alert
    newAlert.style.opacity = '0';
    newAlert.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        newAlert.style.transition = 'all 0.3s ease';
        newAlert.style.opacity = '1';
        newAlert.style.transform = 'translateX(0)';
    }, 100);
}

// Initialize real-time simulation
simulateRealTimeUpdates();

// Add tooltips for better UX
const tooltips = {
    'crowd_density': 'Normal: 1-3, Crowded: 4-6, Very Crowded: 7+',
    'temperature': 'Comfortable range: 20-30°C',
    'movement_speed': 'Normal walking: 1.0-1.5 m/s, Slow: <1.0 m/s',
    'location': 'Different zones have varying risk factors',
    'time_of_day': 'Peak hours have higher risk multipliers'
};

Object.keys(tooltips).forEach(id => {
    const input = document.getElementById(id);
    input.title = tooltips[id];
});

console.log("🕉️ Kumbh Ujjain 2028 Smart Safety System Initialized");
console.log("🚀 Real-time monitoring active");
console.log("📊 Dashboard ready for hackathon demonstration");