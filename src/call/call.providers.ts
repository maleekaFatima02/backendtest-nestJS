import { Connection } from 'mongoose';
import { CallSchema } from './call.schema';

export const callProviders = [
  {
    provide: 'CALL_MODEL',
    useFactory: (connection: Connection) => connection.model('Call', CallSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];