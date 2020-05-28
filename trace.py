import mysql.connector
database = mysql.connector.connect(
  host = 'localhost',
  user = 'root',
  password = 'abcdef1234',
  database = 'users',
)
cursor = database.cursor()
cursor.execute("SELECT * FROM storage")
result = cursor.fetchall()

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

traced = []

message = input("Enter Message which should be traced : ")

lps = generate_lps(message)

for i in range(len(result)):
  occurance = KMPsearch(result[i][2],message)
  if occurance > 0 :
    traced.append([occurance,result[i]])

traced.sort()

for i in range(len(traced)):
  print(traced[i])