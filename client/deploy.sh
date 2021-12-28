#!/bin/sh

GOOGLE_PROJECT_ID=
CLOUD_RUN_SERVICE=

gcloud builds submit --tag eu.gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
  --project=$GOOGLE_PROJECT_ID
