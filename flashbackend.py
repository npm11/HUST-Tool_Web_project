from flask import Flask, jsonify
from flask_cors import CORS
import requests
import json
import firebase_admin
from firebase_admin import credentials, db

# Khởi tạo Firebase
cred = credentials.Certificate(r"D:\npmdz.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://husttools-default-rtdb.firebaseio.com/'
})

app = Flask(__name__)
CORS(app)

# Biến toàn cục để lưu dữ liệu
cached_data = None

@app.route('/get_activities', methods=['GET'])
def get_activities():
    global cached_data
    # Đọc dữ liệu hiện tại từ Firebase
    ref = db.reference('activities')
    current_data = ref.get()
    largest_saved_id = max([activity['ActivityID'] for activity in current_data]) if current_data else 8720

    # Tải và lưu các hoạt động mới
    new_activities = fetch_data_from_source(largest_saved_id + 1)
    if new_activities:
        cached_data = current_data + new_activities if current_data else new_activities
        ref.set(cached_data)
    else:
        cached_data = current_data

    return jsonify(cached_data)

def fetch_data_from_source(start_id):
    activities = []
    largest_id = find_largest_activity_id(start_id)
    if largest_id is not None:
        for activity_id in range(start_id, largest_id + 1):
            activity_data = check_activity(activity_id)
            if activity_data:
                activities.append(activity_data)
    return activities

def check_activity(activity_id):
    url = "https://ctsv.hust.edu.vn/api-t/Activity/GetActivityById"
    headers = {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSIsImtpZCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSJ9.eyJhdWQiOiJodHRwczovL2N0c3YuaHVzdC5lZHUudm4iLCJpc3MiOiJodHRwczovL2Fzc28uaHVzdC5lZHUudm4vYWRmcyIsImlhdCI6MTY5MzEyMDE1MiwiZXhwIjoxNjkzMTIzNzUyLCJhdXRoX3RpbWUiOjE2OTMxMTYxNzQsIm5vbmNlIjoiYzE1Zjk4MzAtZGM4YS00ZmU3LWI0NmEtZjlkMzA1M2NmYzFmIiwic3ViIjoiSnVEc09RV09RWDhiSWVwcklNMGI2dlo1NGg4S1pnemRFbXdsY2RBMjVwMD0iLCJ1cG4iOiJtYW5oLm5wMjE1MDg3QHNpcy5odXN0LmVkdS52biIsInVuaXF1ZV9uYW1lIjoiSFVTVFxcTWFuaC5OUDIxNTA4NyIsInB3ZF91cmwiOiJodHRwczovL2Fzc28uaHVzdC5lZHUudm4vYWRmcy9wb3J0YWwvdXBkYXRlcGFzc3dvcmQvIiwic2lkIjoiUy0xLTUtMjEtMjc0NjI1MTAwNy0xMzI0NTk1MjA2LTc4MTY1NDM1MS04ODA4MiJ9.QAaic4XBzUo-lIg4j9_uU_wxAThxHwKsC1yEoukju0r_ZXDsGqf56hL3xClhTI-uRaSet4Yg_05aQo1jgEFenfea1iO4ccI5zHTqvtMM13CmHE0k3pztg9D-cCnx87FGTuQcft8ILcUuCx4ihcHVb80qLB5PCDMeqY6MwvRTNd6kHzlWuLbzJflewObdIDCqNtLzll6i0b6wUobQrII4rIEywhh8TcklidkvvORK9mJ3vNZhvPBjiYmeaWh7L3EPsnseNt-DxJar3nyFcjBMILJ2_p3Se8QyLRBZtkU9eMR3r3VBy2U0IH5n1KTTHyWPlBDU6Bzs8smd_RZKKWsvdw",  # Thay thế <Your-Token-Here> với token của bạn
        "Content-Type": "application/json",
    }
    payload = json.dumps({"Aid": activity_id})
    response = requests.post(url, headers=headers, data=payload)
    if response.status_code == 200:
        resp_data = response.json()
        if resp_data["RespCode"] == 0:
            for activity in resp_data.get("Activities", []):
                return {
                    "ActivityID": activity_id,
                    "ActivityName": activity.get('AName', 'Unknown Name'),
                    "StartTime": activity.get('StartTime', 'Unknown Start Time'),
                    "FinishTime": activity.get('FinishTime', 'Unknown Finish Time')
                }
    return None
def find_largest_activity_id(start_id):
    largest_id = None
    activity_id = start_id
    gap_count = 0
    while gap_count < 50:
        if check_activity(activity_id):
            largest_id = activity_id
            gap_count = 0
        else:
            gap_count += 1
        activity_id += 1
    return largest_id

if __name__ == "__main__":
    app.run(debug=True)
