var mysql = require('mysql');
var CryptoJS = require("crypto-js");
var crypto = require('crypto');
const prompt = require('prompt-sync')();

var iv   = CryptoJS.enc.Hex.parse("814fa0c9672c550f2215a2528ca59587");

function encrypt(data){
    crypto.pbkdf2(data, 'salt', 5000, 32, 'SHA512', function(err,derivedKey){
    key = CryptoJS.enc.Hex.parse(derivedKey.toString('hex'));
    var encrypted = CryptoJS.AES.encrypt(data, key, { 
      iv: iv, 
      mode: CryptoJS.mode.CBC
    });
    console.log(derivedKey.toString('hex')+"$"+encrypted.toString());  
})
};

function decrypt(data){
  var key="", Encrypted="";
  var flag=1;
  var original;
  for(var i=0;i<data.length;i++)
  {
    if(data[i]==='$')
    {
      flag=0;
      continue;
    }
    if(flag)
    {
      key+=data[i];
    }
    else
    {
      Encrypted+=data[i];
    }
  }
  key = CryptoJS.enc.Hex.parse(key.toString('hex'));
  var decrypted = CryptoJS.AES.decrypt(Encrypted, key, { 
      iv: iv, 
    });
  console.log(decrypted.toString(CryptoJS.enc.Utf8));
}

const data = prompt('Message: ');

encrypt(data);