import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://maleekaFatima:safeBidDB@safebiddb.g55cd.mongodb.net/IVRSystem?retryWrites=true&w=majority'),
  },
];