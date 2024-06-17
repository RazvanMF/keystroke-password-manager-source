FROM node:18-alpine
WORKDIR /keystroke-frontend-over-react/

COPY public/ /keystroke-frontend-over-react/public
COPY src/ /keystroke-frontend-over-react/src
COPY package.json /keystroke-frontend-over-react/

RUN npm install

CMD ["npm", "start"]