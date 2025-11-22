import dotenv from "dotenv";
dotenv.config();
import { Datastore } from '@google-cloud/datastore';

// Connect to local Datastore emulator
const datastore = new Datastore({
  projectId: 'local-dev-project',
  apiEndpoint: 'localhost:8081'
});

export default datastore;