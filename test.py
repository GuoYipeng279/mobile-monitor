import requests

def check_url(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        # Handle any exceptions that occurred during the request.
        return False

# Test a URL
url_to_check = "https://mobile-monitor-15fd6359364b.herokuapp.com"
result = check_url(url_to_check)

if result:
    print(f"The URL {url_to_check} can be fetched normally.")
else:
    print(f"The URL {url_to_check} could not be fetched normally.")
