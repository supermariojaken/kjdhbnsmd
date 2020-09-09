const movie = require('./main');
const base = Buffer.alloc(1, 0);

module.exports = function (req, res, url) {
	switch (req.method) {
		case 'GET': {
			const match = req.url.match(/\/movies\/([^.]+)(?:\.(zip|xml))?$/);
			if (!match) return;

			var id = match[1], ext = match[2];
			switch (ext) {
				case 'zip':
					res.setHeader('Content-Type', 'application/zip');
					movie.loadZip(id).then(v => { res.statusCode = 200, res.end(v) })
						.catch(e => { res.statusCode = 404, res.end() })
					break;
				default:
					res.setHeader('Content-Type', 'text/xml');
					movie.loadXml(id).then(v => { res.statusCode = 200, res.end(v) })
						.catch(e => { res.statusCode = 404, res.end() })
			}
			return true;
		}

		case 'POST': {
			if (!url.path.startsWith('/goapi/getMovie/')) return;
			res.setHeader('Content-Type', 'application/zip');

			movie.loadZip(url.query.movieId).then(b =>
				res.end(Buffer.concat([base, b]))
			).catch(e => res.end('1'));
			return true;
			.then(v => { res.statusCode = 200, res.end(0 + v) })
					//.catch(e => { res.statusCode = 404, res.end(1 + e) })

					// Movie not found? what the fuck!
					.catch(() => character.load('a-000001').then(v => { res.statusCode = 200, res.end(0 + v) }))
			});
			return true;
		}
		default: return;
	}
}
