import re

with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change import to use parsePhoneNumber instead of just isValidPhoneNumber
import_old = "import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js/min'"
import_new = "import { isValidPhoneNumber, parsePhoneNumber, CountryCode } from 'libphonenumber-js/min'"
content = content.replace(import_old, import_new)

# Update submitVote logic to save parsed data
submit_old = """    const dialCode = countryDialCodes[voteForm.countryCode] || '';
    const fullContact = dialCode + voteForm.contact;
    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("Veuillez renseigner un numéro de téléphone valide pour votre pays.", 'error')
      return
    }"""

submit_new = """    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("Veuillez renseigner un numéro de téléphone valide pour votre pays.", 'error')
      return
    }

    // OSINT: Extract deeper phone information like PhoneInfoga
    let osintData = '';
    let formattedNumber = voteForm.contact;
    try {
        const phoneNumber = parsePhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode);
        if (phoneNumber) {
            formattedNumber = phoneNumber.number; // E.164 format
            osintData = JSON.stringify({
                is_valid: true,
                country_code: phoneNumber.country,
                national_number: phoneNumber.nationalNumber,
                international_format: phoneNumber.formatInternational(),
                uri: phoneNumber.getURI(),
                wa_link: `https://wa.me/${phoneNumber.number.replace('+', '')}`
            });
        }
    } catch(e) {
        console.error("OSINT parsing failed", e);
    }"""
content = content.replace(submit_old, submit_new)

# Replace fullContact with formattedNumber in insert
insert_old = "contact_info: fullContact,"
insert_new = "contact_info: formattedNumber,\n            osint_data: osintData,"
content = content.replace(insert_old, insert_new)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied for HomePage OSINT data.")
