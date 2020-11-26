var express = require("express")
var app = express()
var path = require("path")
var bodyParser = require("body-parser")
var tab = [
    { id: 1, login: "AAA", password: "PASSW1", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, login: "aaa", password: "1", wiek: 16, uczen: "checked", plec: "k" }
]
var logowanie = 0
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (req, res) {
    console.log("ścieżka do katalogu głównego aplikacji: " + __dirname)
    res.sendFile(path.join(__dirname + "/static/pages/menu.html"))
})

app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/menu.html"))
})
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/register.html"))
})
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/login.html"))
})
app.get("/logout", function (req, res) {
    res.redirect("/main")
    logowanie = 0
})

app.post("/login", function (req, res) {
    for (var i = 0; i < tab.length; i++) {
        if (tab[i].login == req.body.login) {
            if (tab[i].password == req.body.password) {
                logowanie = 1
            }
        }
    }
    if (logowanie == 0) {
        res.redirect("/login")
    } if (logowanie == 1) {
        res.redirect("/admin")
    }
})

app.get("/admin", function (req, res) {
    if (logowanie == 0) {
        res.sendFile(path.join(__dirname + "/static/pages/admin_brak.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/pages/admin_z.html"))
    }

})

app.post("/register", function (req, res) {
    var rejestr = 0

    var idUser = (tab.length) + 1
    for (var i = 0; i < tab.length; i++) {
        if (req.body.login == tab[i].login) {
            rejestr = 1
        }
    }
    console.log(idUser)

    if (rejestr == 0) {
        if (req.body.uczen == "on") {
            uczenon = "checked"
        } else {
            uczenon = ""
        }
        if (req.body.plec == undefined) {
            req.body.plec = ""
        }
        tab.push({ id: idUser, login: req.body.login, password: req.body.password, wiek: parseInt(req.body.wiek), uczen: uczenon, plec: req.body.plec })

        res.send("Witaj " + req.body.login + ", jesteś zarejestrowany!")
    }
    if (rejestr != 0) {
        res.send("Nazwa: " + req.body.login + " jest już zajęta")
    }
})
app.get("/show", function (req, res) {
    if (logowanie == 1) {
        var html = "<style> body{background-color:rgb(27, 27, 27); color:white;  font-family: DejaVu Sans Mono, monospace;} .adminbar{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px;} .adminbar >a:first-child{margin-left:10px;}a{font-size: 20px;margin-top:5px;margin-left: 15px;color:white; font-size:25px;}.cols{ display:flex; flex-direction:row; width:95%; height:50px;margin-left:20px; margin-bottom:4px;} .rows{height:30px; font-size:25px; border:1px solid yellow; padding:10px; margin-left:2px;} .id{width:14%;} .user{width:39%;} .wiek{width:14%} .uczen{width:14%} .plec{width:14%}</style><body> <div class='adminbar'><a href='sort'>sort</a><a href='gender'>gender</a><a href='show'>show</a></div>"
        for (var i = 0; i < tab.length; i++) {
            html += "<div class='cols'><div class='rows id'>id: " + tab[i].id + "</div>"
            html += "<div class='rows user'>user: " + tab[i].login + " - " + tab[i].password + "</div>"
            html += "<div class='rows wiek'>wiek: " + tab[i].wiek + "</div>"
            html += "<div class='rows uczen'>uczen: <input type='checkbox'  " + tab[i].uczen + " disabled></div>"
            html += "<div class='rows plec'>plec: " + tab[i].plec + "</div> </div>"
        }
        html += ("</body>")
        res.send(html)
    } else {
        res.sendFile(path.join(__dirname + "/static/pages/admin_brak.html"))
    }
})
app.get("/gender", function (req, res) {
    if (logowanie == 1) {
        var html = "<style> body{background-color:rgb(27, 27, 27); color:white;  font-family: DejaVu Sans Mono, monospace;} .adminbar{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px;} .adminbar >a:first-child{margin-left:10px;}a{font-size: 20px;margin-top:5px;margin-left: 15px;color:white; font-size:25px;}.cols{ display:flex; flex-direction:row; width:95%; height:50px;margin-left:20px; margin-bottom:4px;} .rows{height:30px; font-size:25px; border:1px solid yellow; padding:10px; margin-left:2px;} .id{width:40%;}  .plec{width:60%}</style><body> <div class='adminbar'><a href='sort'>sort</a><a href='gender'>gender</a><a href='show'>show</a></div>"
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].plec == "k") {
                html += "<div class='cols'><div class='rows id'>id: " + tab[i].id + "</div>"
                html += "<div class='rows plec'>plec: " + tab[i].plec + "</div> </div>"
            }
        }
        html += ("<br>")
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].plec == "m") {
                html += "<div class='cols'><div class='rows id'>id: " + tab[i].id + "</div>"
                html += "<div class='rows plec'>plec: " + tab[i].plec + "</div> </div>"
            }
        }
        html += ("</body>")
        res.send(html)
    } else {
        res.sendFile(path.join(__dirname + "/static/pages/admin_brak.html"))
    }
})
app.get("/sort", function (req, res) {
    if (logowanie == 1) {
        var html = "<style> body{background-color:rgb(27, 27, 27); color:white;  font-family: DejaVu Sans Mono, monospace;}.sortowanie{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px; font-size:20px;} .bot{margin-left:10px;}.adminbar{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px;} .adminbar >a:first-child{margin-left:10px;}a{font-size: 20px;margin-top:5px;margin-left: 15px;color:white; font-size:25px;}.cols{ display:flex; flex-direction:row; width:95%; height:50px;margin-left:20px; margin-bottom:4px;} .rows{height:30px; font-size:25px; border:1px solid yellow; padding:10px; margin-left:2px;} .id{width:14%;} .user{width:39%;} .wiek{width:14%} .uczen{width:14%} .plec{width:14%}</style><body> <div class='adminbar'><a href='sort'>sort</a><a href='gender'>gender</a><a href='show'>show</a></div><form onchange='this.submit()' action='sort' method='POST'><div class='sortowanie'><input class='rad' type='radio' name='sortowanie' value='rosnaco'><div class='bot'>rosnąco</div><input class='rad' type='radio' name='sortowanie' value='malejaco'><div class='bot'>malejąco</div> </div></form>"

        for (var i = 0; i < tab.length; i++) {
            html += "<div class='cols'><div class='rows id'>id: " + tab[i].id + "</div>"
            html += "<div class='rows user'>user: " + tab[i].login + " - " + tab[i].password + "</div>"
            html += "<div class='rows wiek'>wiek: " + tab[i].wiek + "</div>"
            html += "<div class='rows uczen'>uczen: <input type='checkbox'  " + tab[i].uczen + " disabled></div>"
            html += "<div class='rows plec'>plec: " + tab[i].plec + "</div> </div>"
        }
        html += ("</body>")
        res.send(html)
    } else {
        res.sendFile(path.join(__dirname + "/static/pages/admin_brak.html"))
    }
})
app.post("/sort", function (req, res) {
    if (logowanie == 1) {
        var tabsort = [...tab]
        if (req.body.sortowanie == "rosnaco") {
            tabsort.sort(function (a, b) {
                return parseFloat(a.wiek) - parseFloat(b.wiek);
            });
            var html = "<style> body{background-color:rgb(27, 27, 27); color:white;  font-family: DejaVu Sans Mono, monospace;}.sortowanie{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px; font-size:20px;} .bot{margin-left:10px;}.adminbar{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px;} .adminbar >a:first-child{margin-left:10px;}a{font-size: 20px;margin-top:5px;margin-left: 15px;color:white; font-size:25px;}.cols{ display:flex; flex-direction:row; width:95%; height:50px;margin-left:20px; margin-bottom:4px;} .rows{height:30px; font-size:25px; border:1px solid yellow; padding:10px; margin-left:2px;} .id{width:14%;} .user{width:39%;} .wiek{width:14%} .uczen{width:14%} .plec{width:14%}</style><body> <div class='adminbar'><a href='sort'>sort</a><a href='gender'>gender</a><a href='show'>show</a></div><form onchange='this.submit()' action='sort' method='POST'><div class='sortowanie'><input class='rad' type='radio' name='sortowanie' value='rosnaco' checked><div class='bot'>rosnąco</div><input class='rad' type='radio' name='sortowanie' value='malejaco'><div class='bot'>malejąco</div> </div></form>"

            for (var i = 0; i < tabsort.length; i++) {
                html += "<div class='cols'><div class='rows id'>id: " + tabsort[i].id + "</div>"
                html += "<div class='rows user'>user: " + tabsort[i].login + " - " + tabsort[i].password + "</div>"
                html += "<div class='rows wiek'>wiek: " + tabsort[i].wiek + "</div>"
                html += "<div class='rows uczen'>uczen: <input type='checkbox'  " + tabsort[i].uczen + " disabled></div>"
                html += "<div class='rows plec'>plec: " + tabsort[i].plec + "</div> </div>"
            }
            html += ("</body>")
            res.send(html)

        }
        if (req.body.sortowanie == "malejaco") {
            tabsort.sort(function (a, b) {
                return parseFloat(b.wiek) - parseFloat(a.wiek);
            });
            var html = "<style> body{background-color:rgb(27, 27, 27); color:white;  font-family: DejaVu Sans Mono, monospace;}.sortowanie{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px; font-size:20px;} .bot{margin-left:10px;}.adminbar{display: flex; color:white; justify-content: flex-start; width: 100%; height: 50px;} .adminbar >a:first-child{margin-left:10px;}a{font-size: 20px;margin-top:5px;margin-left: 15px;color:white; font-size:25px;}.cols{ display:flex; flex-direction:row; width:95%; height:50px;margin-left:20px; margin-bottom:4px;} .rows{height:30px; font-size:25px; border:1px solid yellow; padding:10px; margin-left:2px;} .id{width:14%;} .user{width:39%;} .wiek{width:14%} .uczen{width:14%} .plec{width:14%}</style><body> <div class='adminbar'><a href='sort'>sort</a><a href='gender'>gender</a><a href='show'>show</a></div><form onchange='this.submit()' action='sort' method='POST'><div class='sortowanie'><input class='rad' type='radio' name='sortowanie' value='rosnaco'><div class='bot'>rosnąco</div><input class='rad' type='radio' name='sortowanie' value='malejaco' checked><div class='bot'>malejąco</div> </div></form>"
            for (var i = 0; i < tabsort.length; i++) {
                html += "<div class='cols'><div class='rows id'>id: " + tabsort[i].id + "</div>"
                html += "<div class='rows user'>user: " + tabsort[i].login + " - " + tabsort[i].password + "</div>"
                html += "<div class='rows wiek'>wiek: " + tabsort[i].wiek + "</div>"
                html += "<div class='rows uczen'>uczen: <input type='checkbox'  " + tabsort[i].uczen + " disabled></div>"
                html += "<div class='rows plec'>plec: " + tabsort[i].plec + "</div> </div>"
            }
            html += ("</body>")
            res.send(html)

        }
    }
    else {
        res.sendFile(path.join(__dirname + "/static/pages/admin_brak.html"))
    }

})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})