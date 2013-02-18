.PHONY: install uninstall reinstall

install:
	@npm link

uninstall:
	@npm -g unlink auto_npm

reinstall: uninstall install
