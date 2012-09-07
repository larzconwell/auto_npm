.PHONY: install uninstall reinstall

install:
	@npm -g install .

uninstall:
	@npm -g uninstall auto_npm

reinstall: uninstall install
