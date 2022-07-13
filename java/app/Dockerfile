FROM node:8

RUN useradd container_user
RUN apt-get update && apt-get install -y vim curl default-jre default-jdk

# Set the working directory
WORKDIR /usr/src/app

# Set an entrypoint, to automatically install node modules
ENTRYPOINT ["/bin/bash", "-c", "if [[ ! -d node_modules ]]; then npm install; fi; exec \"${@:0}\";"]
CMD ["npm", "run", "start"]

# First, install dependencies to improve layer caching
COPY package.json /usr/src/app/
RUN npm install

# Add the code
COPY . /usr/src/app

ENV JAVA_HOME "/usr/lib/jvm/java-8-oracle"
RUN mkdir /home/container_user
RUN mkdir /home/container_user/work
RUN chown -R container_user:container_user /home/container_user

# Run the tests and build, to make sure everything is working nicely
RUN npm run build && npm run webpack && npm run test

USER container_user
