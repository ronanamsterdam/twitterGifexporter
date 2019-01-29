FROM node:latest

RUN apt-get update

# Installing the packages needed to run Nightmare
RUN apt-get install -y \
  xvfb \
  x11-xkb-utils \
  xfonts-100dpi \
  xfonts-75dpi \
  xfonts-scalable \
  xfonts-cyrillic \
  x11-apps \
  clang \
  libdbus-1-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libgnome-keyring-dev \
  libgconf2-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  gcc-multilib \
  g++-multilib

ENV DEBUG="nightmare"

RUN npm install nightmare

COPY entrypoint.sh /entrypoint
RUN chmod +x /entrypoint


# We want the "add-apt-repository" command
RUN apt-get install -y software-properties-common

# Install "ffmpeg"
RUN add-apt-repository ppa:mc3man/trusty-media
RUN apt-get install -y ffmpeg

RUN apt-get install -y \
graphicsmagick \
graphicsmagick-imagemagick-compat \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN mkdir /app
RUN mkdir ./app/logs
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install
COPY . /app
EXPOSE 3000
ENTRYPOINT ["/entrypoint"]
CMD npm start