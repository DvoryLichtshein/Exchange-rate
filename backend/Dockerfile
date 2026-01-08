FROM node:20

WORKDIR /app

 
ADD https://netfree.link/dl/unix-ca.sh /home/netfree-unix-ca.sh
RUN cat  /home/netfree-unix-ca.sh | sh
ENV NODE_EXTRA_CA_CERTS=/etc/ca-bundle.crt
ENV SSL_CERT_FILE=/etc/ca-bundle.crt
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

RUN apt-get update && \
    apt-get install -y python3 make g++ ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --build-from-source

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
