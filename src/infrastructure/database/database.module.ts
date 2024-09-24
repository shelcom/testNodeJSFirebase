import {Module} from '@nestjs/common';

import {DatabaseSource} from './data-source';

@Module({
  providers: [DatabaseSource],
  exports: [DatabaseSource],
})
export class DatabaseModule {}
