######### Build #########
FROM node:18-alpine3.17 as build
WORKDIR /
COPY . .
RUN yarn install --frozen-lockfile --silent && yarn build

######### Production #########
FROM node:16-alpine3.17
COPY --from=build ./package.json package.json
COPY --from=build ./dist ./dist
COPY --from=build ./node_modules node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]