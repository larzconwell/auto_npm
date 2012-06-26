.PHONY: install clean uninstall reinstall

PREFIX=/usr/local
DESTDIR=

install:
	@mkdir -p $(DESTDIR)$(PREFIX)/bin && \
		mkdir -p $(DESTDIR)$(PREFIX)/lib/node_modules/auto_npm && \
		cp -R ./* $(DESTDIR)$(PREFIX)/lib/node_modules/auto_npm/ && \
		ln -snf ../lib/node_modules/auto_npm/bin/auto_npm.js $(DESTDIR)$(PREFIX)/bin/auto_npm && \
		chmod 755 $(DESTDIR)$(PREFIX)/lib/node_modules/auto_npm/bin/auto_npm.js && \
		echo 'Auto NPM installed.'

clean:
	@true

uninstall:
	@rm -f $(DESTDIR)$(PREFIX)/bin/auto_npm && \
		rm -fr $(DESTDIR)$(PREFIX)/lib/node_modules/auto_npm/ && \
		echo 'Auto NPM uninstalled.'

reinstall: uninstall install
