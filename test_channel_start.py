import requests
import json

# Test starting a new channel analysis pipeline
url = "https://api.gumloop.com/api/v1/start_pipeline?user_id=BOJsm756awOuwFoccac3ISyK4cV2&saved_item_id=nt6xZYT6ap9kqVh5MR1kyz"

payload = {"link": "https://www.youtube.com/@FreyChu"}
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer b29a51e34c8d475b9a936d9dbc078d24"
}

response = requests.request("POST", url, json=payload, headers=headers)

print("Status Code:", response.status_code)
print("Response:")
try:
    data = response.json()
    print(json.dumps(data, indent=2))
    
    if 'run_id' in data:
        print(f"\n🔗 New run_id: {data['run_id']}")
except json.JSONDecodeError:
    print(response.text)