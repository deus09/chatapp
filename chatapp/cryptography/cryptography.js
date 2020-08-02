import { NativeModules, Platform } from 'react-native'
var Aes = NativeModules.Aes

const iv="814fa0c9672c550f2215a2528ca59587";
 
const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length)
 
const encryptData = (text, key) => {
    return Aes.encrypt(text, key, iv).then(cipher => ({
        cipher
    }))
}
 
const decryptData = (encryptedData, key) => Aes.decrypt(encryptedData, key, iv)

export const encrypt = async (data) => {
    var Encrypted;
    await generateKey(data, 'salt', 5000, 256)
    .then(async key => {
        await encryptData(data, key)
        .then(({ cipher }) => {
            Encrypted = (key+"$"+cipher);
        })
    })
    return Encrypted;
}

export const decrypt = async (data) => {
	if(data === undefined)
	{
		return null;
	}
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
	await decryptData(Encrypted, key)
	.then(text => {
		original=text;
	})
	return original;
}