FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir -p app
WORKDIR /app

COPY . /app

# Install dependencies
RUN apt update
RUN apt install -y curl
RUN apt install -y unzip

# Install AWS
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

# Remove not used dependencies
RUN apt remove -y curl
RUN apt remove -y unzip

# Configure AWS
RUN --mount=type=secret,id=AWS_ACCESS_KEY_ID \
		--mount=type=secret,id=AWS_SECRET_ACCESS_KEY \
		--mount=type=secret,id=AWS_DEFAULT_REGION \
		aws configure set aws_access_key_id $(cat /run/secrets/AWS_ACCESS_KEY_ID) && \
		aws configure set aws_secret_access_key $(cat /run/secrets/AWS_SECRET_ACCESS_KEY) && \
		aws configure set region $(cat /run/secrets/AWS_DEFAULT_REGION)

# Build
RUN --mount=type=secret,id=ENV_FILE \
		echo $(cat /run/secrets/ENV_FILE) > .env
RUN pnpm install
RUN pnpm run prepare:all
RUN pnpm build

EXPOSE 3331

CMD ["pnpm", "start"]