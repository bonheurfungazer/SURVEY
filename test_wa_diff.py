import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch(phone):
    url = f"https://api.whatsapp.com/send/?phone={phone}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        response = urllib.request.urlopen(req, context=ctx)
        html = response.read().decode('utf-8')
        return html
    except Exception as e:
        return str(e)

# Real valid whatsapp numbers (e.g. WhatsApp Business number for some service)
html_real = fetch("15551234567") # typically fake but maybe registered? Let's use a known whatsapp number. Wait, maybe just formatted number
html_fake = fetch("33600000000") # definitely fake

with open('real.html', 'w') as f: f.write(html_real)
with open('fake.html', 'w') as f: f.write(html_fake)
