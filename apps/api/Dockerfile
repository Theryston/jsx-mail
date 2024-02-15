FROM oven/bun

RUN mkdir -p app
WORKDIR /app

COPY . /app

RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install --upgrade pip && \
    pip3 install awscli --upgrade --user && \
    echo 'export PATH=~/.local/bin:$PATH' >> ~/.bashrc

RUN --mount=type=secret,id=AWS_ACCESS_KEY_ID \
		--mount=type=secret,id=AWS_SECRET_ACCESS_KEY \
		--mount=type=secret,id=AWS_DEFAULT_REGION \
		mkdir -p ~/.aws && \
    echo "[default]" > ~/.aws/config && \
		echo "AWS_ACCESS_KEY_ID=$(cat /run/secrets/AWS_ACCESS_KEY_ID)" >> ~/.aws/config && \
		echo "AWS_SECRET_ACCESS_KEY=$(cat /run/secrets/AWS_SECRET_ACCESS_KEY)" >> ~/.aws/config && \
		echo "AWS_DEFAULT_REGION=$(cat /run/secrets/AWS_DEFAULT_REGION)" >> ~/.aws/config

EXPOSE 3331

CMD ["bun", "run", "start"]