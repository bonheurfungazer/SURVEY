import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Let's test numverify free tier API without key - wait, we found that apilayer/numverify requires a key.
# Is there ANY completely free no-key api that validates numbers?

url = 'https://api.reoon.com/v1/whatsapp/check_number' # Let's see if Reoon has a public endpoint
print("Reoon API test...")
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req, context=ctx)
    print(res.read().decode('utf-8'))
except Exception as e:
    print(e)
