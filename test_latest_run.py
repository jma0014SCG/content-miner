import requests
import json

# Get the run details for the latest run_id we just created
run_id = "dE5MY6Ea4finCKGYgt67xP"  # From our earlier test

url = "https://api.gumloop.com/api/v1/get_pl_run"
querystring = {"run_id": run_id, "user_id": "BOJsm756awOuwFoccac3ISyK4cV2"}
headers = {"Authorization": "Bearer b29a51e34c8d475b9a936d9dbc078d24"}

response = requests.request("GET", url, headers=headers, params=querystring)

print("Status Code:", response.status_code)
print("Response:")
try:
    data = response.json()
    print(f"State: {data.get('state')}")
    print(f"Input URL: {data.get('inputs', {})}")
    print(f"Finished: {data.get('finished_ts')}")
    
    # Check if it has outputs
    outputs = data.get('outputs', {})
    if outputs:
        print(f"Output keys: {list(outputs.keys())}")
        if 'output' in outputs:
            print(f"Output preview: {outputs['output'][:200]}...")
    else:
        print("No outputs yet")
        
except json.JSONDecodeError:
    print(response.text)