from flask import Flask, jsonify, render_template
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# Biến toàn cục để lưu dữ liệu
cached_data = None

@app.route('/get_activities', methods=['GET'])
def get_activities():
    global cached_data
    if cached_data is None:
        # Tải dữ liệu và lưu vào biến cached_data
        cached_data = fetch_data_from_source()
    return render_template('hoatdong.html', activities=cached_data)

def fetch_data_from_source():
    # Hàm này thực hiện việc tải dữ liệu từ nguồn gốc
    activities = []
    start_checking_from_id = 8700
    largest_id = find_largest_activity_id(start_checking_from_id)
    if largest_id is not None:
        for activity_id in range(start_checking_from_id, largest_id + 1):
            activity_data = check_activity(activity_id)
            if activity_data:
                activities.append(activity_data)
    return activities

def check_activity(activity_id):
    url = "https://ctsv.hust.edu.vn/api-t/Activity/GetActivityById"
    headers = {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSIsImtpZCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSJ9.eyJhdWQiOiJodHRwczovL2N0c3YuaHVzdC5lZHUudm4iLCJpc3MiOiJodHRwczovL2Fzc28uaHVzdC5lZHU.udm4vYWRmcy9wb3J0YWwvdXBkYXRlcGFzc3dvcmQvIiwic2lkIjoiUy0xLTUtMjEtMjc0NjI1MTAwNy0xMzI0NTk1MjA2LTc4MTY1NDM1MS04ODA4MiJ9.VS50ZPhivXQCvnSxDOf1dGsEG37pCH1qFF5SbwgpdBtrqu69PJyW58iJt1GzDxHKKS_VNx8-R2Q7YBC7PbwusWuWUzjVEGv-lFF8D0wHInlj7umgGvyk78tQuzKdmtDiVyfQKYZ6ZlFcATst0TwVAYiKA8waF1hRoJn8ZIREcWKmUghFyO1IhRsVgfFgMyWriQpWYN8pv0ljC5mVO5hMB1kcaDfCHBsCeLFCejr7g4Gsxgzyc3XIqSE00C5EeuZ6aiHHJufb3qiOWCMEzTn0Yo8MhZpRGYB-WVOetLP_JYGatJW3iGBgnj3sGyNPodpzYL0mAdnv03vOnz9H4RZSIg",
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
                    "ActivityName": activity.get('AName', 'Unknown Name')
                }
    return None

def find_largest_activity_id(start_id):
    largest_id = None
    activity_id = start_id
    gap_count = 0
    while gap_count < 200:
        if check_activity(activity_id):
            largest_id = activity_id
            gap_count = 0
        else:
            gap_count += 1
        activity_id += 1
    return largest_id

if __name__ == "__main__":
    app.run(debug=True)
