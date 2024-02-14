FROM oven/bun

RUN mkdir -p app
WORKDIR /app

COPY . /app

RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install --upgrade pip && \
    pip3 install awscli --upgrade --user && \
    echo 'export PATH=~/.local/bin:$PATH' >> ~/.bashrc

RUN aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
RUN aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
RUN aws configure set default.region $AWS_DEFAULT_REGION

EXPOSE 3331

CMD ["bun", "run", "start"]