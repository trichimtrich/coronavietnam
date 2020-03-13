import http.server
import socketserver 

HOST = "0.0.0.0"
PORT = 9999

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    ".js": "application/javascript",
})

socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer((HOST, PORT), Handler)
print("Server at {}:{}".format(HOST, PORT))

httpd.serve_forever()
httpd.shutdown()
httpd.server_close()