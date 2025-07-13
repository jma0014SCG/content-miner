import requests
import json

# Use the EXACT code you provided for channel analysis
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
        new_run_id = data['run_id']
        print(f"\n🔗 Manual test run_id: {new_run_id}")
        
        # Wait a moment then check the result
        import time
        print("Waiting 60 seconds for processing...")
        time.sleep(60)
        
        # Check the result
        check_url = "https://api.gumloop.com/api/v1/get_pl_run"
        check_params = {"run_id": new_run_id, "user_id": "BOJsm756awOuwFoccac3ISyK4cV2"}
        check_headers = {"Authorization": "Bearer b29a51e34c8d475b9a936d9dbc078d24"}
        
        check_response = requests.get(check_url, headers=check_headers, params=check_params)
        check_data = check_response.json()
        
        print(f"\nResult state: {check_data.get('state')}")
        print(f"Input URL: {check_data.get('inputs', {})}")
        
        outputs = check_data.get('outputs', {})
        if outputs and 'output' in outputs:
            output_content = outputs['output']
            if 'FreyChu' in output_content or 'Frey' in output_content:
                print("✅ SUCCESS: Manual test got FreyChu content!")
            elif 'Tjas' in output_content:
                print("❌ PROBLEM: Manual test also got Tjas content!")
            else:
                print("⚠️ UNCLEAR: Manual test got unknown content")
                print(f"Preview: {output_content[:200]}...")
        
except json.JSONDecodeError:
    print(response.text)