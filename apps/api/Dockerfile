FROM oven/bun

RUN mkdir -p app
WORKDIR /app

COPY . /app

# Install AWS CLI
RUN apt-get update && \
    apt-get install -y unzip && \
		curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
		unzip awscliv2.zip && \
		./aws/install

# Clean up
RUN apt-get remove -y unzip && \
    rm -rf awscliv2.zip aws

# Configure AWS CLI
RUN mkdir -p ~/.aws && \
    echo "[default]" > ~/.aws/config && \
		echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" >> ~/.aws/config && \
		echo "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" >> ~/.aws/config && \
		echo "AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}" >> ~/.aws/config

EXPOSE 3331

CMD ["bun", "run", "start"]