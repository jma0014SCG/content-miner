import requests

url = "https://api.gumloop.com/api/v1/get_pl_run"

querystring = {"run_id":"2jMWM2FEh9mcCDZjg5VpBf","user_id":"BOJsm756awOuwFoccac3ISyK4cV2"}

headers = {"Authorization": "Bearer b29a51e34c8d475b9a936d9dbc078d24"}

response = requests.request("GET", url, headers=headers, params=querystring)

print("Status Code:", response.status_code)
print("Response:")
try:
    import json
    data = response.json()
    print(json.dumps(data, indent=2))
except json.JSONDecodeError:
    print(response.text)