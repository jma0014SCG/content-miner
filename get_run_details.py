import requests
import json

url = "https://api.gumloop.com/api/v1/get_pl_run"

querystring = {"run_id":"JGDnHeZgCpgxvDXoCFbcEC","user_id":"BOJsm756awOuwFoccac3ISyK4cV2"}

headers = {"Authorization": "Bearer b29a51e34c8d475b9a936d9dbc078d24"}

response = requests.request("GET", url, headers=headers, params=querystring)

print("Status Code:", response.status_code)
print("Response:")
try:
    # Try to parse as JSON for better formatting
    data = response.json()
    print(json.dumps(data, indent=2))
except json.JSONDecodeError:
    # If not JSON, print raw text
    print(response.text)