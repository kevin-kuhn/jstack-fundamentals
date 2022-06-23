const http = require("http")

const routes = require("./routes")

const server = http.createServer((req, res) => {
	console.log(`Request method: ${req.method} URL: ${req.url}`)

	const currentRoute = routes.find(
		route => route.endpoint === req.url && route.method === req.method
	)

	if (currentRoute) {
		currentRoute.handler(req, res)
	} else {
		res.writeHead(404, { "Content-Type": "text/html" })
		res.end(`Cannot ${req.method} ${req.url}`)
	}
})

server.listen(3000, () => console.log("Server is running on port 3000"))
