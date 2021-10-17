EXEC1 = keepConnections.sh
EXEC2 = forceConnect.sh
DEST = /usr/local/sbin/
install:
	cp $(EXEC1) $(DEST)
	cp $(EXEC2) $(DEST)
	chown root:root $(DEST)$(EXEC1)
	chown root:root $(DEST)$(EXEC2)
	chmod 755 $(DEST)$(EXEC1)
	chmod 755 $(DEST)$(EXEC2)
