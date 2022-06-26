const http = require("http")
const { URL } = require("url")

const bodyParser = require("./helpers/bodyParser")

const routes = require("./routes")

const server = http.createServer((req, res) => {
	const parsedUrl = new URL(req.url, "http://localhost:3000")

	console.log(`Request method: ${req.method} URL: ${parsedUrl.pathname}`)

	let { pathname } = parsedUrl
	let id = null

	const splitEndpoint = pathname.split("/").filter(Boolean)

	if (splitEndpoint.length > 1) {
		pathname = `/${splitEndpoint[0]}/:id`
		id = splitEndpoint[1]
	}

	const currentRoute = routes.find(
		route => route.endpoint === pathname && route.method === req.method
	)

	if (currentRoute) {
		//precisa ser assim pois o searchParams é Iterable
		req.query = Object.fromEntries(parsedUrl.searchParams.entries())
		req.params = { id }

		res.send = (statusCode, body) => {
			res.writeHead(statusCode, { "Content-Type": "application/json" })
			res.end(JSON.stringify(body))
		}

		if (["POST", "PUT", "PATCH"].includes(req.method)) {
			bodyParser(req, () => currentRoute.handler(req, res))
		} else {
			currentRoute.handler(req, res)
		}
	} else {
		res.writeHead(404, { "Content-Type": "text/html" })
		res.end(`Cannot ${req.method} ${parsedUrl.pathname}`)
	}
})

server.listen(3000, () => console.log("Server is running on port 3000"))
