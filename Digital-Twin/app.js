// ====================================
// ELEV-X1 DIGITAL TWIN CONTROLLER
// ====================================

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // ELEMENT REFERENCES
    // ==============================

    const elevator = document.getElementById("elevator-car");
    const counterweight = document.getElementById("counterweight");
    // Passenger container
const passengerContainer =
    document.getElementById("passenger-container");

    const heightDisplay = document.getElementById("tel-height");
    const speedDisplay = document.getElementById("tel-speed");
    const accelDisplay = document.getElementById("tel-accel");

    const loadSlider = document.getElementById("payload-slider");
    const payloadDisplay = document.getElementById("payload-value");
    const weightDisplay = document.getElementById("tel-weight");
    const weightBar = document.getElementById("tel-weight-bar");

    const tempDisplay = document.getElementById("tel-temp");
    const powerDisplay = document.getElementById("tel-power");
    const vibrationDisplay = document.getElementById("tel-vibration");

    const healthDisplay = document.getElementById("system-health");
    const healthStatus = document.getElementById("health-status");
    // ==============================
// AI Predictive Maintenance
// ==============================

const motorHealthDisplay =
    document.getElementById("motor-health");

const doorHealthDisplay =
    document.getElementById("door-health");

const cableHealthDisplay =
    document.getElementById("cable-health");

const sensorHealthDisplay =
    document.getElementById("sensor-health");

const aiMessage =
    document.getElementById("ai-message");

    const floorDisplay = document.getElementById("header-floor");
    // ==============================
// LiDAR & Smart ETA
// ==============================

const lidarDisplay =
    document.getElementById("lidar-distance");

const etaDisplays = [
    document.getElementById("eta0"),
    document.getElementById("eta1"),
    document.getElementById("eta2"),
    document.getElementById("eta3"),
    document.getElementById("eta4"),
    document.getElementById("eta5"),
    document.getElementById("eta6"),
    document.getElementById("eta7"),
    document.getElementById("eta8"),
    document.getElementById("eta9")
];
// ==============================
// Passenger Hall Display
// ==============================

const hallETA = [
    document.getElementById("hall-eta0"),
    document.getElementById("hall-eta1"),
    document.getElementById("hall-eta2"),
    document.getElementById("hall-eta3"),
    document.getElementById("hall-eta4"),
    document.getElementById("hall-eta5"),
    document.getElementById("hall-eta6"),
    document.getElementById("hall-eta7"),
    document.getElementById("hall-eta8"),
    document.getElementById("hall-eta9")
];


const hallDirection = [
    document.getElementById("hall-dir0"),
    document.getElementById("hall-dir1"),
    document.getElementById("hall-dir2"),
    document.getElementById("hall-dir3"),
    document.getElementById("hall-dir4"),
    document.getElementById("hall-dir5"),
    document.getElementById("hall-dir6"),
    document.getElementById("hall-dir7"),
    document.getElementById("hall-dir8"),
    document.getElementById("hall-dir9")
];

    const logArea = document.getElementById("event-log");
    const clearLogBtn = document.getElementById("clear-log");


    // ==============================
    // SYSTEM VARIABLES
    // ==============================

    let currentFloor = 0;
    let currentHeight = 0;

// LiDAR measured distance from ground
    let lidarDistance = 0;

    let currentSpeed = 0;
    let acceleration = 0;

    let currentLoad = 0;

    let systemHealth = 100;
    // ==============================
// Elevator Queue System
// ==============================

let requestQueue = [];

let isMoving = false;
let elevatorDirection = "IDLE";
    // ==============================
// LiDAR ETA Constants
// ==============================

const FLOOR_HEIGHT = 4; // meters
const TOTAL_FLOORS = 10;
const ELEVATOR_SPEED = 2; // m/s

let doorDelay = 3; // seconds
// Door safety curtain status
let doorBlocked = false;

    // ==============================
    // EVENT LOG FUNCTION
    // ==============================

    function addLog(message, type = "INFO") {

        let time = new Date().toLocaleTimeString();

        let entry = document.createElement("p");

        entry.textContent =
            `[${time}] ${type}: ${message}`;

        if(type === "WARNING") {
            entry.style.color = "yellow";
        }

        if(type === "CRITICAL") {
            entry.style.color = "red";
        }

        logArea.prepend(entry);
    }

     // ==============================
// LiDAR Position & ETA Update
// ==============================

function updateLidarAndETA() {

    // Update LiDAR distance display
    lidarDistance = currentHeight;

    lidarDisplay.textContent =
        lidarDistance.toFixed(1);


    // Calculate ETA for every floor
    for(let floor = 0; floor < TOTAL_FLOORS; floor++) {

        let floorDistance =
            floor * FLOOR_HEIGHT;

        let distance =
            Math.abs(floorDistance - lidarDistance);


        // If elevator is already at this floor
        if(distance < 0.5) {

    etaDisplays[floor].textContent = "HERE";

    hallETA[floor].textContent = "HERE";

    hallDirection[floor].textContent = "●";
}

        else {

    let travelTime =
        distance / ELEVATOR_SPEED;


    let totalETA =
        Math.round(
            travelTime + doorDelay
        );


    // Update internal ETA panel
    etaDisplays[floor].textContent =
        totalETA + " sec";


    // Update passenger floor display
    hallETA[floor].textContent =
        totalETA + " sec";


    // Show elevator direction
    if(elevatorDirection === "UP") {

        hallDirection[floor].textContent = "↑";

    }

    else if(elevatorDirection === "DOWN") {

        hallDirection[floor].textContent = "↓";

    }

    else {

        hallDirection[floor].textContent = "■";

    }

}

    }

}
// ==============================
// PASSENGER SIMULATION
// ==============================

function updatePassengers(load) {

    // Average passenger weight
    const averageWeight = 70;

    // Calculate passenger count
    let count = Math.floor(load / averageWeight);

    // Maximum cabin capacity
    if (count > 10) {
        count = 10;
    }


    // Clear old passengers
    passengerContainer.innerHTML = "";


    // Create passenger icons
    for (let i = 0; i < count; i++) {

        let person =
            document.createElement("div");

        person.className = "passenger";

        person.textContent = "🧍";

        passengerContainer.appendChild(person);

    }

}
// ==============================
// AI MAINTENANCE ENGINE
// ==============================

function updateAIMaintenance() {


    let motorHealth = 100;
    let doorHealth = 100;
    let cableHealth = 100;
    let sensorHealth = 100;


    // Motor condition based on vibration
    if(currentLoad > 700) {
        motorHealth -= 10;
    }


    let vibration =
        parseFloat(vibrationDisplay.textContent);


    if(vibration > 0.5) {

        motorHealth -= 30;

    }


    // Cable health based on overload
    if(currentLoad > 1000) {

        cableHealth -= 40;

    }


    // Door safety curtain issues
    if(doorBlocked) {

        doorHealth -= 30;

    }


    // Sensor reliability
    let temperature =
        parseFloat(tempDisplay.textContent);


    if(temperature > 45) {

        sensorHealth -= 25;

    }


    // Prevent negative values

    motorHealth =
        Math.max(0, motorHealth);

    doorHealth =
        Math.max(0, doorHealth);

    cableHealth =
        Math.max(0, cableHealth);

    sensorHealth =
        Math.max(0, sensorHealth);


    // Update dashboard

    motorHealthDisplay.textContent =
        motorHealth + "%";


    doorHealthDisplay.textContent =
        doorHealth + "%";


    cableHealthDisplay.textContent =
        cableHealth + "%";


    sensorHealthDisplay.textContent =
        sensorHealth + "%";


    // AI Recommendations

    if(motorHealth < 70) {

        aiMessage.textContent =
        "⚠ High vibration detected. Inspect motor and guide rails.";

    }

    else if(cableHealth < 70) {

        aiMessage.textContent =
        "⚠ Repeated overload detected. Inspect suspension cables.";

    }

    else if(doorHealth < 70) {

        aiMessage.textContent =
        "⚠ Door safety curtain issues detected. Check door mechanism.";

    }

    else if(sensorHealth < 70) {

        aiMessage.textContent =
        "⚠ Sensor environment abnormal. Perform sensor calibration.";

    }

    else {

        aiMessage.textContent =
        "✓ System operating normally. No maintenance required.";

    }

}
    // ==============================
    // CLEAR LOG BUTTON
    // ==============================

    clearLogBtn.addEventListener("click", () => {

        logArea.innerHTML = "";

        addLog("Event history cleared");

    });


    // ==============================
    // SYSTEM BOOT MESSAGE
    // ==============================

    addLog("ELEV-X1 Digital Twin started");
    updateAIMaintenance();
    updatePassengers(0);
    updateLidarAndETA();
        // ==============================
    // LOAD SLIDER SIMULATION
    // ==============================

    loadSlider.addEventListener("input", () => {

        currentLoad = parseInt(loadSlider.value);


        // Update load displays
        payloadDisplay.textContent = currentLoad;
        weightDisplay.textContent = currentLoad;
        // Update passengers in cabin
        updatePassengers(currentLoad);

        // Load bar percentage
        let loadPercent = (currentLoad / 1000) * 100;

        if(loadPercent > 100) {
            loadPercent = 100;
        }

        weightBar.style.width = loadPercent + "%";


        // ==========================
        // Power Consumption
        // ==========================

        let power = 0.45 + (currentLoad * 0.0008);

        powerDisplay.textContent =
            power.toFixed(3);


        // ==========================
        // Temperature Simulation
        // ==========================

        let temperature =
            21.5 + (currentLoad * 0.005);

        tempDisplay.textContent =
            temperature.toFixed(1);


        // ==========================
        // Vibration Simulation
        // ==========================

        let vibration =
            0.015 + (currentLoad * 0.00005);

        vibrationDisplay.textContent =
            vibration.toFixed(3);


        // ==========================
        // System Health Calculation
        // ==========================

        systemHealth =
            100 - (currentLoad * 0.02);

        if(systemHealth < 0) {
            systemHealth = 0;
        }


        healthDisplay.textContent =
            systemHealth.toFixed(0);


        // Health Status

        if(systemHealth >= 80) {

            healthStatus.textContent =
                "NORMAL";

            healthStatus.style.color =
                "#22c55e";

        }
        else if(systemHealth >= 50) {

            healthStatus.textContent =
                "WARNING";

            healthStatus.style.color =
                "orange";

            addLog(
              "System health degrading due to high load",
              "WARNING"
            );

        }
        else {

            healthStatus.textContent =
                "CRITICAL";

            healthStatus.style.color =
                "red";

            addLog(
              "System health critical. Maintenance required",
              "CRITICAL"
            );
        }


        // ==========================
        // Overload Protection
        // ==========================

        if(currentLoad > 1000) {

            addLog(
              "Cabin overload detected. Elevator locked.",
              "CRITICAL"
            );

            weightDisplay.style.color = "red";

        }
        else {

            weightDisplay.style.color = "#00e5ff";

        }


        // ==========================
        // Update Event Log
        // ==========================

        addLog(
          `Cabin load changed to ${currentLoad} kg`
        );
        updateAIMaintenance();

    });
        // ==============================
    // FLOOR BUTTON CONTROL
    // ==============================

    const floorButtons =
        document.querySelectorAll(".floor-btn");


    floorButtons.forEach(button => {

    button.addEventListener("click", () => {

        let targetFloor = parseInt(button.dataset.floor);


        // Ignore current floor
        if (targetFloor === currentFloor) {

            addLog(
              `Already at Floor ${currentFloor}`
            );

            return;
        }


        // Avoid duplicate requests
        if (!requestQueue.includes(targetFloor)) {

           requestQueue.push(targetFloor);


// Intelligent sorting
if (elevatorDirection === "UP") {

    requestQueue.sort((a, b) => a - b);

}
else if (elevatorDirection === "DOWN") {

    requestQueue.sort((a, b) => b - a);

}


            addLog(
              `Floor ${targetFloor} added to queue`
            );

        }


        // If elevator is idle, start processing
        if (!isMoving) {

            processNextRequest();

        }

    });

});



    // ==============================
    // ELEVATOR MOVEMENT FUNCTION
    // ==============================

    function moveElevator(targetFloor) {

    let targetHeight = targetFloor * FLOOR_HEIGHT;

    let direction =
        targetHeight > currentHeight ? 1 : -1;
    if(direction === 1) {

    elevatorDirection = "UP";

}
else {

    elevatorDirection = "DOWN";

}


    currentSpeed = ELEVATOR_SPEED;
    acceleration = 0.8;


    speedDisplay.textContent =
        currentSpeed.toFixed(2);

    accelDisplay.textContent =
        acceleration.toFixed(2);


    addLog(
        direction === 1 ?
        "Elevator moving UP" :
        "Elevator moving DOWN"
    );


    let movement = setInterval(() => {


        // Move 0.2 meters every 100 ms
        currentHeight += direction * 0.2;


        // Update LiDAR
        updateLidarAndETA();


        // Update elevator visual
        let positionPercent =
            (currentHeight / 36) * 90;


        elevator.style.bottom =
            positionPercent + "%";


        // Counterweight opposite movement
        counterweight.style.bottom =
            (90 - positionPercent) + "%";


        // Update height display
        heightDisplay.textContent =
            currentHeight.toFixed(2);


        // Update current floor
        currentFloor =
            Math.round(currentHeight / FLOOR_HEIGHT);


        if (currentFloor === 0) {
    floorDisplay.textContent = "GROUND";
} else {
    floorDisplay.textContent = "FLR " + currentFloor;
}


        // Check arrival
        if (
            (direction === 1 && currentHeight >= targetHeight) ||
            (direction === -1 && currentHeight <= targetHeight)
        ) {


            clearInterval(movement);


            // Correct final position
            currentHeight = targetHeight;

            updateLidarAndETA();


            currentFloor = targetFloor;


            if (currentFloor === 0) {
    floorDisplay.textContent = "GROUND";
} else {
    floorDisplay.textContent = "FLR " + currentFloor;
}


            // Stop motor
            currentSpeed = 0;
            acceleration = 0;


            speedDisplay.textContent =
                "0.00";

            accelDisplay.textContent =
                "0.00";


            addLog(
                "Elevator arrived at Floor " +
                currentFloor
            );


            // Start door operation
            operateDoor();

        }


    }, 100);

}
        // ==============================
    // FAULT INJECTION SYSTEM
    // ==============================

    const faultOverload =
        document.getElementById("fault-overload");

    const faultDoor =
        document.getElementById("fault-door");

    const faultVibration =
        document.getElementById("fault-vibration");

    const faultTemperature =
        document.getElementById("fault-temperature");

    const faultPower =
        document.getElementById("fault-power");

    const faultEstop =
        document.getElementById("fault-estop");


    // Cabin overload fault
   // Door safety curtain simulation
faultDoor.addEventListener("change", () => {

    doorBlocked = faultDoor.checked;
    updateAIMaintenance();

    if(doorBlocked) {

        addLog(
            "Door safety curtain blocked - Passenger detected",
            "WARNING"
        );

    } 
    else {

        addLog(
            "Door area clear - Safety curtain restored"
        );

    }

});


    // Door obstruction
    faultDoor.addEventListener("change", () => {

        addLog(
            faultDoor.checked ?
            "Door obstruction detected" :
            "Door obstruction cleared",
            faultDoor.checked ? "WARNING" : "INFO"
        );

    });


    // High vibration fault
    faultVibration.addEventListener("change", () => {

        if(faultVibration.checked) {

            vibrationDisplay.textContent = "1.250";
            

            addLog(
                "Abnormal guide rail vibration detected",
                "WARNING"
            );

        } else {

            vibrationDisplay.textContent = "0.015";
         

            addLog(
                "Vibration returned to normal"
            );
        }
        updateAIMaintenance();
        

    });


    // Temperature fault
    faultTemperature.addEventListener("change", () => {

        if(faultTemperature.checked) {

            tempDisplay.textContent = "55.0";
            

            addLog(
                "HVAC overheating detected",
                "WARNING"
            );

        } else {

            tempDisplay.textContent = "21.5";
         

            addLog(
                "Temperature returned to normal"
            );
        }
        updateAIMaintenance();

    });


    // Power failure
    faultPower.addEventListener("change", () => {

        if(faultPower.checked) {

            powerDisplay.textContent = "0.000";

            addLog(
                "Main AC supply failure",
                "CRITICAL"
            );

        } else {

            powerDisplay.textContent = "0.450";

            addLog(
                "Power restored"
            );
        }

    });


    // Emergency stop
    faultEstop.addEventListener("change", () => {

        if(faultEstop.checked) {

            speedDisplay.textContent = "0.00";
            accelDisplay.textContent = "-2.50";

            addLog(
                "Emergency brake activated",
                "CRITICAL"
            );

        } else {

            accelDisplay.textContent = "0.00";

            addLog(
                "Emergency stop cleared"
            );
        }

    });


    // ==============================
    // SYSTEM UPTIME TIMER
    // ==============================

    const uptimeDisplay =
        document.getElementById("header-uptime");

    let seconds = 0;


    setInterval(() => {

        seconds++;


        let mins =
            String(Math.floor(seconds / 60))
            .padStart(2, "0");


        let secs =
            String(seconds % 60)
            .padStart(2, "0");


        uptimeDisplay.textContent =
            mins + ":" + secs;


    }, 1000);



    // ==============================
    // DIGITAL TWIN READY
    // ==============================
    // ==============================
// DOOR OPERATION SYSTEM
// ==============================
// ==============================
// Process Elevator Queue
// ==============================

function processNextRequest() {


    if (requestQueue.length === 0) {

        isMoving = false;
        elevatorDirection = "IDLE";

        addLog(
            "Elevator waiting for request"
        );

        return;

    }


    isMoving = true;


    let nextFloor = requestQueue.shift();


    addLog(
        `Processing Floor ${nextFloor}`
    );


    moveElevator(nextFloor);

}
function operateDoor() {

    const cabin =
        document.getElementById("elevator-car");


    addLog("Door opening");

    // Open door
    cabin.classList.add("door-open");
    cabin.classList.remove("door-close");


    // Keep door open for passengers
    setTimeout(() => {

        addLog("Door closing");

        cabin.classList.add("door-close");
        cabin.classList.remove("door-open");


        // Check safety curtain during closing
        setTimeout(() => {

            if(doorBlocked) {

                addLog(
                    "Passenger detected! Reopening door",
                    "WARNING"
                );

                cabin.classList.add("door-open");
                cabin.classList.remove("door-close");


                // Wait again and try closing
                setTimeout(() => {

                    addLog(
                        "Attempting door close again"
                    );

                    cabin.classList.add("door-close");
                    cabin.classList.remove("door-open");


                    // Continue queue after door action
                    setTimeout(() => {

                        processNextRequest();

                    }, 1500);


                }, 3000);

            }

            else {

                addLog(
                    "Door closed safely"
                );

                processNextRequest();

            }

        }, 1200);


    }, 3000);

}
    addLog(
        "All sensors online. System ready."
    );


}); // End of DOMContentLoaded
