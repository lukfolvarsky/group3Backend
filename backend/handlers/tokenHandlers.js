require('dotenv').config()
const axios = require( 'axios');
const express = require ('express');
const path = require ('path');
const { authenticate } = require ('@google-cloud/local-auth');
const { google } = require ("googleapis");



async function getGoogleAccessToken(user_id){
    // Auth0 management API token request
  const tokenReqParamsBody = JSON.stringify({client_id: process.env.AUTH0_CLIENT_ID,client_secret: process.env.AUTH0_CLIENT_SECRET,audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,grant_type:"client_credentials"} )
  let tokenReqParams = {
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: tokenReqParamsBody
  };
  const { data } = await axios.post(tokenReqParams.url, tokenReqParams.body, { headers: tokenReqParams.headers });
  const accessToken = data.access_token;
  // console.log("data: ", data);
  // console.log("access token:", accessToken);
  
  // Google access token request
  let userReqParams = {
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`,
    headers: {authorization: `Bearer ${accessToken}`}
  };
  const user = await axios.get(userReqParams.url, { headers: userReqParams.headers });
  const googleIdPAccessToken = user.data.identities[0].access_token;
  return googleIdPAccessToken;
  // console.log(user.data)
};

module.exports = getGoogleAccessToken;
