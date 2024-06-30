
FROM python:latest

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

    
WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . ./

WORKDIR /app/src

EXPOSE 3001

CMD ["python", "app.py"]
