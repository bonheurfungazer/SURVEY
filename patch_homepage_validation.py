import re

with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I also need to make sure the number saved in contact_info still has the prefix like we originally did because we removed the osint parsing which was doing the global formatting!
# Let's check what it was initially:
# const dialCode = countryDialCodes[voteForm.countryCode] || '';
# const fullContact = dialCode + voteForm.contact;

old_submit = """    const validationResult = validatePhoneNumberLength(voteForm.contact, voteForm.countryCode as CountryCode);
    if (validationResult === 'TOO_LONG') {
      showToast("idiots la méchanceté vous donne quoi", 'error')
      return
    }

    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("Veuillez renseigner un numéro de téléphone valide pour votre pays.", 'error')
      return
    }

    const formattedNumber = voteForm.contact;"""

new_submit = """    const validationResult = validatePhoneNumberLength(voteForm.contact, voteForm.countryCode as CountryCode);
    if (validationResult === 'TOO_LONG') {
      showToast("idiots la méchanceté vous donne quoi", 'error')
      return
    }

    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("Veuillez renseigner un numéro de téléphone valide pour votre pays.", 'error')
      return
    }

    const dialCode = countryDialCodes[voteForm.countryCode] || '';
    const formattedNumber = dialCode + voteForm.contact;"""

content = content.replace(old_submit, new_submit)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
