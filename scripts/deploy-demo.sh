#!/usr/bin/env bash
GIT_DEPLOY_REPO=git@github.com:JulienPradet/react-flip.git

cd dist && \
rm -rf .git && \
git init && \
git checkout -b gh-pages && \
git add . && \
git commit -m "Deploy to GitHub Pages" && \
git push --force "${GIT_DEPLOY_REPO}" gh-pages:gh-pages