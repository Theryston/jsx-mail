FROM oven/bun

RUN mkdir -p app
WORKDIR /app

COPY . /app

RUN mkdir -p ~/.aws && \
    echo "[default]" > ~/.aws/config && \
		echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" >> ~/.aws/config && \
		echo "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" >> ~/.aws/config && \
		echo "AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}" >> ~/.aws/config

EXPOSE 3331

CMD ["bun", "run", "start"]