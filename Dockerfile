FROM python:3.12-slim 
EXPOSE 5000/tcp
EXPOSE 500/udp
WORKDIR /app 
COPY app.py app.py
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
CMD python app.py
