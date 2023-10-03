import { setting } from '@core/configs/setting.config';
import { SetMetadata } from '@nestjs/common';

export function CustomRepository(entity: unknown): ClassDecorator {
  return SetMetadata(setting.TYPEORM_CUSTOM_REPOSITORY, entity);
}
