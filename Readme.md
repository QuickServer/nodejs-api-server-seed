# Nodejs-api-server-seed
1. Remove local.js from config on other environment & set NODE_ENV variable according to environment.
2. Use fixmyjs npm module to fix all javascript errors hinted by jshint.
3. Always return API response in JSON with underscore(URL safe delimiter) seperated property name. 
    Don't use hyphen or camelCase in JSON property name.
    first_name correct
    firstName incorrect
    first-name incorrect