var nodemailer = require('nodemailer');
const fetch = require("node-fetch");
var cron = require('node-cron');
var config = require('./config');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.sender_email,
    pass: config.sender_password
  }
});

let send_mail_flag = false

const getData = async () => {
  console.log("Running BB API")
  try {
    const response = await fetch(config.member_url, {
      'headers': {
        'authority': 'www.bigbasket.com',
        'accept': 'application/json, text/plain, */*',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
        'x-csrftoken': 'q3OW3vDq49k2JfmrHLqBRJUMlGxCfNoVGKtBTpHO5k6T7P8APA7igp3NrsgzS9tu',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://www.bigbasket.com/?nc=logo',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cookie': config.cookie
      }
    });
    const json = await response.json();
    const city = json.current_city.name
    const slot = json.darkstore_next_slot;

    if (city.toLowerCase() == config.city && slot.includes('Delivery')) {
      console.log("Slot Available")
      console.log(city.toLowerCase())
      console.log(slot)
      send_mail_flag = true
    }
    else {
      console.log("No Slots available")
      console.log(city.toLowerCase())
      console.log(slot)
    }

  } catch (error) {
    console.log(error);
  }
};

var task = cron.schedule(`*/${config.time_interval} * * * *`, async () => {
  console.log(`running a every ${config.time_interval} minutes`);
  console.log(send_mail_flag)
  await getData();
  if (send_mail_flag) {
    var mailOptions = {
      from: config.sender_email,
      to: config.to_email,
      subject: 'Slot available for BB',
      text: "Slot available"
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        console.log("stopping cron task")
        task.stop();
      }
    });
  }
});


