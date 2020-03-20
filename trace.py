import mysql.connector

database = mysql.connector.connect(
  host = 'localhost',
  user = 'root',
  password = 'abcdef1234',
  database = 'users',
)

cursor = database.cursor()

message = input("Enter Message which should be traced : ")

cursor.execute("SELECT * FROM storage where message = '" + message + "'")

result = cursor.fetchall()

if len(result) == 0:
    print("Message doesn't exits")

else:
    print("Sender = " + result[0][0])
    print("receiver = " + result[0][1])
    print("Message = " + result[0][2])
    print("TimeStamp = " + str(result[0][3]))