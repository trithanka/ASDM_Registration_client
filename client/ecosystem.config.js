   module.exports = {
     apps: [
       {
         name: "ASDM_PUBLIC_REGISTRATION_CLIENT",  // Replace with your application name
         script: "app.js",     // Replace with your main script
         interpreter: "/root/.nvm/versions/node/v21.7.3/bin/node", // Use the latest Node.js version
         env: {
           NODE_ENV: "production",
         },
       },
     ],
   };
