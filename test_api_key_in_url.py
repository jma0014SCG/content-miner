import requests
import json

# Try with API key in URL instead of header
url = "https://api.gumloop.com/api/v1/start_pipeline?api_key=b29a51e34c8d475b9a936d9dbc078d24&user_id=BOJsm756awOuwFoccac3ISyK4cV2&saved_item_id=nt6xZYT6ap9kqVh5MR1kyz"

payload = {"link": "https://www.youtube.com/@FreyChu"}
headers = {
    "Content-Type": "application/json"
    # No Authorization header this time
}

response = requests.request("POST", url, json=payload, headers=headers)

print("Status Code:", response.status_code)
print("Response:")
try:
    data = response.json()
    print(json.dumps(data, indent=2))
    
    if 'run_id' in data:
        new_run_id = data['run_id']
        print(f"\n🔗 API key in URL test run_id: {new_run_id}")
        
        # Wait a moment then check the result
        import time
        print("Waiting 90 seconds for processing...")
        time.sleep(90)
        
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
                print("✅ SUCCESS: API key in URL got FreyChu content!")
                print(f"Preview: {output_content[:300]}...")
            elif 'Tjas' in output_content:
                print("❌ PROBLEM: API key in URL still got Tjas content!")
                print(f"Preview: {output_content[:200]}...")
            else:
                print("⚠️ UNCLEAR: API key in URL got unknown content")
                print(f"Preview: {output_content[:200]}...")
        else:
            print("No output available yet")
        
except json.JSONDecodeError:
    print(response.text)