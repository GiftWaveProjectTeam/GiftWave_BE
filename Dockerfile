# build stage
#사용하는 node 버전
# FROM node:18-alpine AS build
#RUN,CMD의 명령이 실행될 디렉토리 경로
# WORKDIR /usr/src/app
#COPY (복사할 파일 경로) (이미지에서 파일이 위치할 경로)
# COPY . .
#이미지 실행 시 사용될 명령어
# RUN npm install
#FROM에서 설정한 이미지 위에서 스크립트 혹은 명령을 실행
# RUN npm run build

# prod stage
# FROM node:18-alpine
# WORKDIR /usr/src/app
# ARG NODE_ENV=production
#환경변수 설정
# ENV NODE_ENV=${NODE_ENV}
# COPY --from=build /usr/src/app/dist ./dist
# COPY package*.json ./
# RUN npm install --only=production
#설치 후 필요없으니까 다시 삭제(script 사용할꺼면 삭제 안해도 됨)
# RUN rm package*.json
#호스트와 연결할 포트 번호
# EXPOSE 3000
#컨테이너가 시작되었을 때 실행하는 명령
# CMD ["node", "dist/main.js"]

FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node","dist/main.js"]