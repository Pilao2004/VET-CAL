import serverless from 'serverless-http';
import { createApiApp } from '../../server/api';

export const handler = serverless(createApiApp());
