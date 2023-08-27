from flask import Flask, jsonify
from flask_cors import CORS  # Thêm dòng này
import requests
import json

app = Flask(__name__)
CORS(app)  # Thêm dòng này

# Biến toàn cục để lưu dữ liệu
cached_data = None

@app.route('/get_activities', methods=['GET'])
def get_activities():
    global cached_data
    if cached_data is None:
        # Tải dữ liệu và lưu vào biến cached_data
        cached_data = fetch_data_from_source()
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
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSIsImtpZCI6IkZNU3BaNmFOa1JBOXN5ZzJLNl9HMlhUdzZLQSJ9.eyJhdWQiOiJodHRwczovL2N0c3YuaHVzdC5lZHUudm4iLCJpc3MiOiJodHRwczovL2Fzc28uaHVzdC5lZHUudm4vYWRmcyIsImlhdCI6MTY5MzExNjE3NCwiZXhwIjoxNjkzMTE5Nzc0LCJhdXRoX3RpbWUiOjE2OTMxMTYxNzQsIm5vbmNlIjoiYzRiMjk2NmUtNDU2MS00OWE2LTgxYmEtMmMxM2NkNmYxMmY0Iiwic3ViIjoiSnVEc09RV09RWDhiSWVwcklNMGI2dlo1NGg4S1pnemRFbXdsY2RBMjVwMD0iLCJ1cG4iOiJtYW5oLm5wMjE1MDg3QHNpcy5odXN0LmVkdS52biIsInVuaXF1ZV9uYW1lIjoiSFVTVFxcTWFuaC5OUDIxNTA4NyIsInB3ZF91cmwiOiJodHRwczovL2Fzc28uaHVzdC5lZHUudm4vYWRmcy9wb3J0YWwvdXBkYXRlcGFzc3dvcmQvIiwic2lkIjoiUy0xLTUtMjEtMjc0NjI1MTAwNy0xMzI0NTk1MjA2LTc4MTY1NDM1MS04ODA4MiJ9.oK6zcAXaqra2skh-Y4q7-Xbf2jkkCaMwpkFpf0-evx3fpvgWcpSN1C5cVCxYW74ovgmqK6uAGtBVwneav1Dw6F0HFhLZdNE8Y6hYiuhIrwweJJCp301OT9wL4MdsTjRQWR438hgqb7bxmcLzjDE8SEcmIE7NA2l8gOlRF2TsFac5DwlKaNtZSw5PP3viiBHyWpopKVgVQzkTUutTpwkJspBgiGpTVs26cD9BjE9yNABcF26d_mEN5JiDx4cogiPmH-2_furalXyl3-xQxgmAanK_RHCUn207oE3z6P9TqEuYddGqZEZ_TTaoQYO-xZCEGsyeLzcizZSsuiObR1BuXw",  # Thay thế <Your-Token-Here> với token của bạn
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
    while gap_count < 100:
        if check_activity(activity_id):
            largest_id = activity_id
            gap_count = 0
        else:
            gap_count += 1
        activity_id += 1
    return largest_id

if __name__ == "__main__":
    app.run(debug=True)
