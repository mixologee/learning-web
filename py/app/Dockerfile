FROM node:8

RUN useradd container_user
RUN apt-get update && apt-get install -y vim curl python3 python3-pip
RUN apt-get install -y python3-numpy python3-matplotlib python3-scipy python3-pandas python3-simpy
RUN apt-get install -y ipython3 ipython3-notebook
RUN apt-get install -y python3-opengl
RUN apt-get install -y python3-pyqt5 python3-pyqt5.qtopengl python3-pyqt5.qtquick
RUN apt-get install -y python3-h5py
RUN apt-get install -y python3-skimage
RUN apt-get install -y libatlas-dev libatlas3gf-base && pip3 install scikit-learn
RUN apt-get install -y spyder3
RUN pip3 install rope_py3k

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

RUN mkdir /home/container_user
RUN mkdir /home/container_user/work
RUN chown -R container_user:container_user /home/container_user

# Run the tests and build, to make sure everything is working nicely
RUN npm run build && npm run webpack && npm run test

#USER container_user
