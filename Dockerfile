FROM node:20
WORKDIR /app
ENV NG_CLI_ANALYTICS=false
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]
