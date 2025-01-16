FROM public.ecr.aws/docker/library/node:lts-bullseye

RUN df -h
COPY index.js index.js

ENTRYPOINT ["node", "index.js"]