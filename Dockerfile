FROM postgres:latest
RUN localedef -i uk_UA -c -f UTF-8 -A /usr/share/locale/locale.alias uk_UA.UTF-8
ENV LANG uk_UA.utf8