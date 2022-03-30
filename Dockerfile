
FROM node:16 as builder

WORKDIR /home/

COPY . /home/

RUN npm ci \
    && npm run build \
    && npm prune --production

# ---

FROM node:16

ENV NODE_ENV production

WORKDIR /home/

COPY --from=builder /home/package*.json /home/
COPY --from=builder /home/node_modules/ /home/node_modules/
COPY --from=builder /home/dist/ /home/dist/

CMD ["npm", "run", "start"]