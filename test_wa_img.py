import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_profile_pic(phone):
    # This is a community trick: we can use wa.me and see if it redirects or has a specific profile picture element
    # But usually, it requires scraping the DOM. Let's look for specific og:image meta tags.
    url = f"https://api.whatsapp.com/send/?phone={phone}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        response = urllib.request.urlopen(req, context=ctx)
        html = response.read().decode('utf-8')
        import re
        m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if m: return m.group(1)
        return "No image"
    except Exception as e:
        return str(e)

print('33612345678', fetch_profile_pic('33612345678'))
print('15551234567', fetch_profile_pic('15551234567'))
