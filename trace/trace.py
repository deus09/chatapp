import mysql.connector
import sys
import json
from Naked.toolshed.shell import execute_js,muterun_js

database = mysql.connector.connect(
  host = 'localhost',
  user = 'root',
  password = 'password',
  database = 'users',
)
cursor = database.cursor()
cursor.execute("SELECT * FROM storage")
result = cursor.fetchall()

def seperateKeyAndEncryptedText(Encrypted):
	key=""
	encrypted=""
	flag=1
	for i in range(len(Encrypted)):
		if Encrypted[i]=='$':
			flag=0
			continue
		if flag:
			key+=Encrypted[i]
		else:
			encrypted+=Encrypted[i]
	return [key,encrypted]

def requestDecrypted(encrypted):
  text = seperateKeyAndEncryptedText(encrypted);
  response = muterun_js('trace.js',text[0]+" "+text[1])
  return str(response.stdout)[2:-3]

def generate_lps(pattern):
  lps = [0]*(len(pattern))
  l = 0
  i = 1
  while i < len(pattern):
    if pattern[i] == pattern[l] :
      l += 1
      lps[i]=l
      i += 1
    else :
      if l is not 0 : 
        l = lps[l-1]
      else :
        lps[i] = 0
        i+=1
  return lps

def KMPsearch(text,pattern):
  i=0
  j=0
  count=0
  while i < len(text):
    if pattern[j] == text[i]:
      j += 1
      i += 1
    if j==len(pattern):
      count += 1
      j = lps[j-1]
    elif i<len(text) and pattern[j] != text[i]:
      if j!=0 :
        j = lps[j-1]
      else :
        i += 1
  return count

traced = None

message = input("Enter Message which should be traced : ")

lps = generate_lps(message)

for i in range(len(result)):
  decrypted = requestDecrypted(result[i][2])
  occurance = KMPsearch(decrypted,message)
  if occurance > 0 :
    traced=result[i]
    break

if traced!=None:
  print('sender: ' + decrypted(traced[0]))
  print('receiver: ' + decrypted(traced[1]))
