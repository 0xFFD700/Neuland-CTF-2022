import base64
import smtplib
import ssl

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

text = "Hi Manu,<br><br>" \
       "look at this based meme I found online. I ordered some stickers of the meme.<br>" \
       "You can get some from my desk."

data = open('based_meme.jpg', 'rb').read()
data_base64 = base64.b64encode(data)
data_base64 = data_base64.decode()

html = '<html><body><p>' + text + '</p><p><img src="data:image/jpeg;' + data_base64 + '"></p></body></html>'
open('output.html', 'w').write(html)

local = 1

sender = "ctf@neuland-ingolstadt.de"
receiver = "manuel.voit@neuland-ingolstadt.de"
if not local:
    password = input("Type your password and press enter:")

# Create message container - the correct MIME type is multipart/alternative.
msg = MIMEMultipart('alternative')
msg['Subject'] = "Based meme"
msg['From'] = sender
msg['To'] = receiver
msg['Date'] = "Sun,  4 Apr 1337 13:37:00 +0000 (UTC)"

body = MIMEText(html, 'html')
msg.attach(body)

if local:
    s = smtplib.SMTP('localhost')
    s.sendmail(sender, receiver, msg.as_string())
    s.quit()
else:
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("mail.neuland-ingolstadt.de", 465, context=context) as server:
        server.login(sender, password)
        server.sendmail(sender, receiver, msg.as_string())
