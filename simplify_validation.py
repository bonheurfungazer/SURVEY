import re

with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update import statement
old_import = "import { isValidPhoneNumber, validatePhoneNumberLength, CountryCode } from 'libphonenumber-js/min'"
new_import = "import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js/min'"
content = content.replace(old_import, new_import)

old_block = """    const validationResult = validatePhoneNumberLength(voteForm.contact, voteForm.countryCode as CountryCode);
    if (validationResult === 'TOO_LONG') {
      showToast("idiots la méchanceté te donne quoi , comment pense tu que tu sera recontacter?", 'error')
      return
    }

    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("idiots la méchanceté te donne quoi , comment pense tu que tu sera recontacter?", 'error')
      return
    }"""

new_block = """    if (!voteForm.contact || !isValidPhoneNumber(voteForm.contact, voteForm.countryCode as CountryCode)) {
      showToast("idiots la méchanceté te donne quoi , comment pense tu que tu sera recontacter?", 'error')
      return
    }"""

content = content.replace(old_block, new_block)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
