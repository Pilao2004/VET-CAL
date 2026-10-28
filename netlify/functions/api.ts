import serverless from 'serverless-http';
import { connectLambda } from '@netlify/blobs';
import { createApiApp } from '../../server/api';

const app = serverless(createApiApp());

// connectLambda habilita o Netlify Blobs (registro das compras) nesta função
export const handler = async (event: any, context: any) => {
  connectLambda(event);
  return app(event, context);
};
