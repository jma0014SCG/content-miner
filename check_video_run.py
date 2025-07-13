import requests
import json

# Check the video run_id to see if it has correct data
run_id = "AinE7uJwZSPjijs67rhHne"

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
    print(f"Credits: {data.get('credit_cost')}")
    
    # Check the actual output content
    outputs = data.get('outputs', {})
    output_keys = list(outputs.keys()) if outputs else []
    print(f"Output keys: {output_keys}")
    
    if outputs:
        # Check both summary and output fields
        if 'summary' in outputs:
            summary_content = outputs['summary']
            print(f"\nSummary content preview:")
            print(f"First 200 chars: {summary_content[:200]}...")
            
        if 'output' in outputs:
            output_content = outputs['output']
            print(f"\nOutput content preview:")
            print(f"First 200 chars: {output_content[:200]}...")
    else:
        print("No outputs available")
        
except json.JSONDecodeError:
    print(response.text)