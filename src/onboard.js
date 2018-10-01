const qs = require('querystring');
const axios = require('axios');
const JsonDB = require('node-json-db');

const db = new JsonDB('users', true, false);

const postResult = result => console.log(result.data);

// default message - edit to include actual ToS
const message = {
  token: process.env.SLACK_TOKEN,
  as_user: true,
  link_names: true,
  text: 'Welcome to the Accord Project! We\'re glad you\'re here.',
  attachments: [
    {
      title: 'What is the Accord Project?',
      text: 'Industry-Led Specification and Open Source Code for Smart Legal Contracts. Find out more at accordproject.org and see the documentation at docs.accordproject.org',
      color: '#74c8ed',
    },
    {
      title: 'Code of Conduct',
      text: 'Help us keep the Accord Project open and inclusive. Please read and follow our <https://github.com/accordproject/docs/blob/master/Accord%20Project%20Code%20of%20Conduct.pdf|Code of Conduct> before continuing.',
      color: '#3060f0',
    },
    {
      title: 'Channels',
      color: '#2243a5',
      text: `We use slack channels to group related conversations for the different Accord Project working groups (WGs). Each working group has a chairperson who schedules regular meetings with members. 

To join, simply introduce yourself in the corresponding channel.`
    },
    {
      title: 'Financial Services',
      color: '#edcd5a',
      text: '#financialservices-wg. https://accordproject.org/working-groups/financial-services'
    },
    {
      title: 'Supply Chain & Logistics ',
      color: '#edcd5a',
      text: '#supplychain-wg. https://accordproject.org/working-groups/supply-chain'
    },
        {
      title: 'Intellectual Property',
      color: '#edcd5a',
      text: '#ip-wg. https://accordproject.org/working-groups/ip'
    },
    {
      title: 'Venture and Token Sales',
      color: '#edcd5a',
      text: '#ventureandtokens-wg. https://accordproject.org/working-groups/venture'
    },
    {
      title: 'Dispute Resolution',
      color: '#edcd5a',
      text: '#disputeresolution-wg'
    },
    {
      title: 'Real Estate',
      color: '#edcd5a',
      text: '#realestate-wg'
    },
    {
      title: 'Technology',
      color: '#86d67c',
      text: `#technology-wg. The technology working group builds the Accord Project's open-source software. 

There are also several sub-groups for projects (#technology-cicero, #technology-ergo, #technology-models) and technologies (#tech-hyperledger & #technology-corda).`
    },
  ],
};

const initialMessage = (teamId, userId) => {
  let data = false;
  // try fetch team/user pair. This will throw an error if nothing exists in the db
  try { data = db.getData(`/${teamId}/${userId}`); } catch (error) {
    console.error(error);
  }

  // `data` will be false if nothing is found or the user hasn't accepted the ToS
  if (!data) {
    // add or update the team/user record
    db.push(`/${teamId}/${userId}`, false);

    // send the default message as a DM to the user
    message.channel = userId;
    message.attachments = JSON.stringify(message.attachments);
    const params = qs.stringify(message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  } else {
    console.log('Already onboarded');
  }
};

// // set the team/user record to true to indicate that they've accepted the ToS
// // you might want to store the date/time that the terms were accepted

// const accept = (userId, teamId) => db.push(`/${teamId}/${userId}`, true);

// // find all the users who've been presented the ToS and send them a reminder to accept.
// // the same logic can be applied to find users that need to be removed from the team
// const remind = () => {
//   try {
//     const data = db.getData('/');
//     Object.keys(data).forEach((team) => {
//       Object.keys(data[team]).forEach((user) => {
//         if (!data[team][user]) {
//           message.channel = user;
//           message.text = 'REMIND I am a test message';

//           const params = qs.stringify(message);
//           const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);

//           sendMessage.then(postResult);
//         }
//       });
//     });
//   } catch (error) { console.error(error); }
// };

module.exports = { initialMessage, message };
