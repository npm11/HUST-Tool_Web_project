from flask import Flask, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

cached_data = None

def write_to_html_file(data):
    with open("hoatdong.html", "w") as f:
        f.write("<html><body><table>")
        f.write("<tr><th>Activity ID</th><th>Activity Name</th></tr>")
        for activity in data:
            f.write(f"<tr><td>{activity['ActivityID']}</td><td>{activity['ActivityName']}</td></tr>")
        f.write("</table></body></html>")

@app.route('/get_activities', methods=['GET'])
def get_activities():
    global cached_data
    if cached_data is None:
        cached_data = fetch_data_from_source()
        write_to_html_file(cached_data)
    return jsonify(cached_data)

def fetch_data_from_source():
    # Hàm này thực hiện việc tải dữ liệu từ nguồn gốc
    activities = []
    start_checking_from_id = 8720  # Bắt đầu kiểm tra từ ID này
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
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSIsImtpZCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSJ9.eyJhdWQiOiJodHRwczovL2N0c3YuaHVzdC5lZHUudm4iLCJpc3MiOiJodHRwczovL2Fzc28uaHVzdC5lZHUudm4vYWRmcyIsImlhdCI6MTY5MzA4NTAwNSwiZXhwIjoxNjkzMDg4NjA1LCJhdXRoX3RpbWUiOjE2OTMwODA4ODUsIm5vbmNlIjoiYWY5MzU2NTAtNjEwNC00NjlkLWI2ZTQtYWJhMGJkMjBkZjAzIiwic3ViIjoiSnVEc09RV09RWDhiSWVwcklNMGI2dlo1NGg4S1pnemRFbXdsY2RBMjVwMD0iLCJ1cG4iOiJtYW5oLm5wMjE1MDg3QHNpcy5odXN0LmVkdS52biIsInVuaXF1ZV9uYW1lIjoiSFVTVFxcTWFuaC5OUDIxNTA4NyIsInB3ZF91cmwiOiJodHRwczovL2Fzc28uaHVzdC5lZHUudm4vYWRmcy9wb3J0YWwvdXBkYXRlcGFzc3dvcmQvIiwic2lkIjoiUy0xLTUtMjEtMjc0NjI1MTAwNy0xMzI0NTk1MjA2LTc4MTY1NDM1MS04ODA4MiJ9.VS50ZPhivXQCvnSxDOf1dGsEG37pCH1qFF5SbwgpdBtrqu69PJyW58iJt1GzDxHKKS_VNx8-R2Q7YBC7PbwusWuWUzjVEGv-lFF8D0wHInlj7umgGvyk78tQuzKdmtDiVyfQKYZ6ZlFcATst0TwVAYiKA8waF1hRoJn8ZIREcWKmUghFyO1IhRsVgfFgMyWriQpWYN8pv0ljC5mVO5hMB1kcaDfCHBsCeLFCejr7g4Gsxgzyc3XIqSE00C5EeuZ6aiHHJufb3qiOWCMEzTn0Yo8MhZpRGYB-WVOetLP_JYGatJW3iGBgnj3sGyNPodpzYL0mAdnv03vOnz9H4RZSIg",  # Thay thế <Your-Token-Here> với token của bạn
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
