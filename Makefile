check: lint test

lint:
	./node_modules/.bin/jshint *.js lib test

test:
	node --test \
		$(TEST_OPTS) \
		--require ./test/replay/index.js

test-cov: TEST_OPTS := --experimental-test-coverage
test-cov: test

.PHONY: check lint test test-cov

