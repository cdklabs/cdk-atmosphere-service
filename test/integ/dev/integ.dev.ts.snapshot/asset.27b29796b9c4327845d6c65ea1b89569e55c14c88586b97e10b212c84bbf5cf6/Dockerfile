FROM public.ecr.aws/docker/library/node:lts-bullseye

COPY cleanup.task.js cleanup.task.js

ENTRYPOINT ["node", "cleanup.task.js"]