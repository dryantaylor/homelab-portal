FROM python:3.12-slim 
EXPOSE 5000/tcp
EXPOSE 500/udp
VOLUME /app 
WORKDIR /app
RUN mkdir /app/static
RUN mkdir /app/templates
COPY app.py app.py
COPY requirements.txt requirements.txt
COPY static/index.js /app/static/index.js
COPY templates/index.html /app/templates/index.html
RUN pip install -r requirements.txt
CMD python app.py
