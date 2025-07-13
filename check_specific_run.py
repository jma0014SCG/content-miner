import requests
import json

# Check the specific run_id that our API just returned
run_id = "MzUyDFQa6owSEsYiBs7SdU"

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
    if outputs and 'output' in outputs:
        output_content = outputs['output']
        print(f"\nOutput content preview:")
        # Look for the channel name in the output
        if 'Tjas' in output_content:
            print("❌ PROBLEM: Output still contains 'Tjas' - wrong channel!")
        elif 'FreyChu' in output_content or 'Frey' in output_content:
            print("✅ SUCCESS: Output contains FreyChu content!")
        else:
            print("⚠️ UNCLEAR: Output doesn't clearly show which channel")
            
        print(f"First 200 chars: {output_content[:200]}...")
    else:
        print("No outputs available")
        
except json.JSONDecodeError:
    print(response.text)