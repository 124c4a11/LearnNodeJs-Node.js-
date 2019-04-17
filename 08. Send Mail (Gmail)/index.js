const sendMail = require('./libs/sendMail');


(async () => {
  const transportResponse = await sendMail({
    template:     'hello',
    subject:      'Привет',
    to:           'to@1.mail',
    name:         'John'
  });

  console.log(transportResponse);
})().catch(console.error);
