import json

l = json.load(open("list.json", encoding="utf8"))
data = {}
for no in l:
    d = json.load(open("cases/{}.json".format(no), encoding="utf8"))
    data[no] = d

json.dump(data, open("data.json", "w", encoding="utf8"))
open("assets/global.js", "a").write("isProduction = true;\n")

