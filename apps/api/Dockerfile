FROM ubuntu:latest
FROM oven/bun as bun

RUN mkdir -p app
WORKDIR /app

COPY . /app

# Install dependencies
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y unzip

# Install AWS
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

# Remove dependencies
RUN apt-get remove -y curl
RUN apt-get remove -y unzip

RUN --mount=type=secret,id=AWS_ACCESS_KEY_ID \
		--mount=type=secret,id=AWS_SECRET_ACCESS_KEY \
		--mount=type=secret,id=AWS_DEFAULT_REGION \
		aws configure set aws_access_key_id $(cat /run/secrets/AWS_ACCESS_KEY_ID) && \
		aws configure set aws_secret_access_key $(cat /run/secrets/AWS_SECRET_ACCESS_KEY) && \
		aws configure set region $(cat /run/secrets/AWS_DEFAULT_REGION)

EXPOSE 3331

CMD ["bun", "run", "start"]