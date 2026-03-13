import joblib

iso_model = joblib.load("isolation_forest_model.pkl")
iso_scaler = joblib.load("feature_scaler.pkl")

rf_model = joblib.load("attack_classifier_model.pkl")
rf_scaler = joblib.load("classifier_scaler.pkl")

label_encoder = joblib.load("attack_label_encoder.pkl")

print("Models loaded successfully")


from scapy.layers.inet import IP, TCP, UDP

def extract_packet_features(packet):

    features = [0]*78

    if IP in packet:

        features[0] = packet[IP].ttl
        features[1] = len(packet)

        if TCP in packet:
            features[2] = packet[TCP].sport
            features[3] = packet[TCP].dport

        if UDP in packet:
            features[4] = packet[UDP].sport
            features[5] = packet[UDP].dport

    return features


import numpy as np

def calculate_risk(packet):

    features = extract_packet_features(packet)

    scaled = iso_scaler.transform([features])

    anomaly = iso_model.predict(scaled)[0]

    if anomaly == 1:
        return 0.1, "Normal"

    features_194 = np.zeros(194)
    features_194[:len(features)] = features

    scaled2 = rf_scaler.transform([features_194])

    pred = rf_model.predict(scaled2)

    attack = label_encoder.inverse_transform(pred)[0]

    risk_score = 0.85

    return risk_score, attack


import requests

def send_alert(src_ip, dst_ip, attack, risk):

    url = "http://localhost:5000/api/alerts"

    # Updated keys to match Node.js backend
    data = {
        "src_ip": src_ip,
        "dst_ip": dst_ip,
        "anomaly_type": attack,
        "risk_score": float(risk)
    }

    try:

        response = requests.post(url, json=data)

        print("Alert sent:", response.status_code)

    except Exception as e:

        print("Error sending alert:", e)


def analyze_packet(packet):

    if IP not in packet:
        return

    src = packet[IP].src
    dst = packet[IP].dst

    risk, attack = calculate_risk(packet)

    print("Traffic:", src, "→", dst, "| Risk:", risk, "| Type:", attack)

    if risk > 0.7:

        print("⚠ ALERT:", attack)

        send_alert(src, dst, attack, risk)


from scapy.all import sniff

def packet_callback(packet):

    analyze_packet(packet)


# ===============================
# Start IDS (Portable Version)
# ===============================

print("Starting ML Intrusion Detection...")

# Scapy automatically selects the default network interface
sniff(
    prn=packet_callback,
    store=False,
    count=30
)