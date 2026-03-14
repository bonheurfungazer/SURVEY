with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
import_statement = "import { isValidPhoneNumber, parsePhoneNumber, CountryCode } from 'libphonenumber-js/min'\n"
content = content.replace("import { verifyAdminCredentials, fetchSensitiveAdminData, checkAdminAuthStatus, logoutAdmin } from './actions'\n",
                          "import { verifyAdminCredentials, fetchSensitiveAdminData, checkAdminAuthStatus, logoutAdmin } from './actions'\n" + import_statement)

# Replace regex validation
old_validation = """    const dialCode = countryDialCodes[voteForm.countryCode] || '';
    const fullContact = dialCode + voteForm.contact;
    const phoneRegex = /^\\+?[0-9\\s\\-\\.()]{7,25}$/;
    if (!voteForm.contact || !phoneRegex.test(fullContact)) {
      showToast("Veuillez renseigner un numéro de téléphone valide (ex: +33612345678).", 'error')
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

if old_validation in content:
    content = content.replace(old_validation, submit_new)
else:
    print("Old validation logic not found. Trying another way...")

insert_old = "contact_info: fullContact,"
insert_new = "contact_info: formattedNumber,\n            osint_data: osintData,"
content = content.replace(insert_old, insert_new)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied.")
