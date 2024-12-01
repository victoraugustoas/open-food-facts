import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CronDto {
  @ApiPropertyOptional()
  lastExecutionTime: Date | null;

  @ApiProperty()
  nextExecutionTime: Date;
}

export class UptimeDto {
  @ApiProperty()
  uptimeSeconds: number;

  @ApiProperty()
  uptimeHuman: string;
}

export class MemoryDto {
  @ApiProperty()
  rss: number;

  @ApiProperty()
  rssHuman: string;
}

export class MongoDbDto {
  @ApiProperty({ enum: ['up'] })
  status: 'up';
}

export class HealthDto {
  @ApiProperty()
  cron: CronDto;

  @ApiProperty()
  uptime: UptimeDto;

  @ApiProperty()
  memory: MemoryDto;

  @ApiProperty()
  mongodb: MongoDbDto;
}
