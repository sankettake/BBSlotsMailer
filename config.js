var config = {};

// Stuff from BB on homepage look for this "/get_page_data/?cai" API, copy in postman and get the following two information
config.member_url = "https://www.bigbasket.com/auth/get_page_data/?cai=XXXXXXmem"
config.cookie = 'XXXXXX'
config.city = "pune"

// Email information for sender and receiver. In Gmail, for sender you have to allow access to low security apps
// Preferable to use burner account for sender
config.sender_email = 'XXXXXX@gmail.com'
config.sender_password = 'XXXXXX'
config.to_email = 'XXXXXX'

// Dont keep it too short to avoid sending too many requests
config.time_interval = 1

module.exports = config;