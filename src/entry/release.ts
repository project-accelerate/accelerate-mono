import "../config/node"
import { configureDb } from '../config/db'
import { configureTestData } from '../config/testData';

configureDb()
  .then(configureTestData)
  .then(() => process.exit())
