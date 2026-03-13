# 🛡️ Real-Time Intrusion Detection and Prevention System (IDPS)

> [cite_start]A proactive "Digital Immune System" for modern web servers[cite: 33, 34]. 

[cite_start]Standard firewalls act like simple locked doors, only logging attacks after the damage is done[cite: 34, 35]. [cite_start]This IDPS acts as a smart security guard that watches every single packet entering the network, uses Machine Learning to spot suspicious behavior, and automatically blocks malicious IPs in milliseconds[cite: 35, 49, 50].

## ✨ Core Features

* [cite_start]**Live Network Sniffing ("The Eye"):** Captures packet metadata (IP, port, protocol, size) in real-time[cite: 38, 40].
* [cite_start]**AI Anomaly Detection ("The Brain"):** Utilizes an Isolation Forest ML model to learn what "normal" traffic looks like and flags behavioral anomalies without relying on known attack signatures[cite: 42, 43, 114].
* [cite_start]**Plain-English Threat Intelligence ("The Voice"):** Integrates with OpenAI GPT-4o to translate raw, cryptic packet data into human-readable incident reports[cite: 45, 122].
* [cite_start]**Automated Firewall Response ("The Hands"):** Automatically writes new OS-level firewall rules to instantly blacklist high-risk IPs[cite: 49, 74].
* [cite_start]**CyberWar Room Dashboard ("The Command Center"):** A dark-mode UI featuring a live-updating traffic graph, geographical threat map, and a 1-click manual override switch[cite: 52, 53, 95, 102].

---

## 🏗️ System Architecture & Data Flow

[cite_start]Our decoupled architecture combines low-level networking, AI/ML, and full-stack web development[cite: 61]. 

1.  [cite_start]**Capture:** The Python Sidecar script captures a TCP packet using Scapy[cite: 137].
2.  [cite_start]**Score:** The ML script processes the packet and assigns a "Threat Score"[cite: 138].
3.  [cite_start]**Post:** If the Threat Score is high, the Python sensor POSTs the raw JSON to the Node.js backend[cite: 139].
4.  [cite_start]**Enrich:** The Node.js server receives the data, queries groq api for an explanation, and logs the event in MongoDB[cite: 140].
5.  [cite_start]**Emit & Display:** The backend emits a Socket.io message to the frontend, instantly spiking the React dashboard graphs and popping up an alert[cite: 141, 142].

---

## 💻 Tech Stack

### 1. Data Source & Intelligence (Python)
* [cite_start]**Scapy:** For raw network packet sniffing and extracting the "Five-Tuple" data[cite: 69, 112].
* [cite_start]**Scikit-Learn (Isolation Forest):** For behavioral anomaly detection and threat scoring[cite: 80, 114].
* [cite_start]**Pandas:** For structuring messy, high-speed packet data into AI-readable dataframes[cite: 113].

### 2. The Hub (Backend)
* [cite_start]**Node.js & Express.js:** High-speed REST API endpoints to receive Python threat alerts[cite: 88, 117, 118].
* [cite_start]**Socket.io:** Persistent WebSocket connection for zero-latency UI updates[cite: 89, 120].
* [cite_start]**OpenAI SDK (GPT-4o):** For generating contextual AI threat insights[cite: 90, 122].
* [cite_start]**MongoDB & Mongoose:** Persistent logging of threat events for historical review[cite: 131, 132].

### 3. The Command Center (Frontend)
* **Next.js (App Router) & React:** Component-based UI architecture.
* [cite_start]**Tailwind CSS & Material-UI:** For rapid, enterprise-grade dark-mode styling[cite: 125].
* [cite_start]**Recharts:** For rendering the live "Requests Per Second" line chart[cite: 97, 126].
* [cite_start]**Lucide React & Framer Motion:** For modern security iconography and urgent pulse animations[cite: 128, 129].

---

## 👥 Meet the Team

* [cite_start]**Saad (Security Architect):** Cyber Specialist handling low-level networking, network sniffing, and the OS-level firewall execution scripts[cite: 65, 66, 68, 74].
* [cite_start]**Abhay (ML Engineer):** Responsible for feature engineering, defining "normal" traffic, and implementing the Isolation Forest threat predictor[cite: 75, 78, 80].
* [cite_start]**Himanshu (Backend Orchestrator):** Manages integration, Socket.io real-time pipes, and the GPT-4o AI context layer[cite: 85, 89, 90].
* [cite_start]**Anurag (UI/UX Commander):** Leads frontend visualization, building the live dashboard, threat maps, and the visual "War Room" experience[cite: 92, 93, 95].

---

## 🚀 Getting Started (Local Development)

*(Ensure you have Python 3.x, Node.js, and MongoDB installed on your machine).*

### 1. Start the Backend Hub
```bash
cd server
npm install
npm run dev
```

### 2. Start the Frontend Command Center
```Bash
cd client
npm install
npm run dev
```
Access the dashboard at http://localhost:3000

### 3. Initialize the Python Sensor
```Bash
cd python_sensor
pip install scapy pandas scikit-learn requests
sudo python sniffer.py
```

