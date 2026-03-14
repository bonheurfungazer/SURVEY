import re

with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply the strict logic to the actual main branch

# Update validation block
old_validation_block = """    const dialCode = countryDialCodes[voteForm.countryCode] || '';
    const fullContact = dialCode + voteForm.contact;
    const phoneRegex = /^\\+?[0-9\\s\\-\\.()]{7,25}$/;
    if (!voteForm.contact || !phoneRegex.test(fullContact)) {
      showToast("Veuillez renseigner un numéro de téléphone valide (ex: +33612345678).", 'error')
      return
    }"""

new_validation_block = """    const dialCode = countryDialCodes[voteForm.countryCode] || '';
    const fullContact = dialCode + voteForm.contact;

    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("idiots la méchanceté te donne quoi , comment pense tu que tu sera recontacter?", 'error')
      return
    }"""

if old_validation_block in content:
    content = content.replace(old_validation_block, new_validation_block)
else:
    print("Old validation block not found. Trying alternative...")
    # It might be the simplified one from the previous PR
    alt_block = """    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("idiots la méchanceté te donne quoi , comment pense tu que tu sera recontacter?", 'error')
      return
    }

    const dialCode = countryDialCodes[voteForm.countryCode] || '';
    const formattedNumber = dialCode + voteForm.contact;"""

    # Let's check what exactly is in the current main branch
    pass

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
