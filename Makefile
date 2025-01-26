check: lint test

lint:
	./node_modules/.bin/jshint *.js lib test

test:
	node --test \
		--require ./test/replay/index.js

.PHONY: check lint test
