import requests
import json

# Check the API key in URL test result
run_id = "cqYvUqLNsZCj8sGoAfc8qr"

url = "https://api.gumloop.com/api/v1/get_pl_run"
querystring = {"run_id": run_id, "user_id": "BOJsm756awOuwFoccac3ISyK4cV2"}
headers = {"Authorization": "Bearer b29a51e34c8d475b9a936d9dbc078d24"}

response = requests.request("GET", url, headers=headers, params=querystring)

print("Status Code:", response.status_code)
try:
    data = response.json()
    print(f"State: {data.get('state')}")
    print(f"Input URL: {data.get('inputs', {})}")
    print(f"Finished: {data.get('finished_ts')}")
    print(f"Credits: {data.get('credit_cost')}")
    
    # Check the actual output content
    outputs = data.get('outputs', {})
    if outputs and 'output' in outputs:
        output_content = outputs['output']
        if 'FreyChu' in output_content or 'Frey' in output_content:
            print("✅ SUCCESS: API key in URL method worked!")
        elif 'Tjas' in output_content:
            print("❌ PROBLEM: API key in URL still got wrong content")
        else:
            print("⚠️ UNCLEAR: Got unknown content")
        print(f"Preview: {output_content[:200]}...")
    else:
        print("No outputs available yet - still processing")
        
except json.JSONDecodeError:
    print(response.text)