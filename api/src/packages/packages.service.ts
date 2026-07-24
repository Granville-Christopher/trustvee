import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package } from './schemas/package.schema';

const SEED_PACKAGES: Array<Partial<Package>> = [
  {
    code: 'spark',
    name: 'Spark',
    entryAmount: 3000,
    returnAmount: 15000,
    isElite: false,
    sortOrder: 1,
  },
  {
    code: 'rise',
    name: 'Rise',
    entryAmount: 5000,
    returnAmount: 20000,
    isElite: false,
    sortOrder: 2,
  },
  {
    code: 'pulse',
    name: 'Pulse',
    entryAmount: 10000,
    returnAmount: 40000,
    isElite: false,
    sortOrder: 3,
  },
  {
    code: 'elite',
    name: 'Elite',
    entryAmount: 25000,
    returnAmount: 100000,
    isElite: true,
    sortOrder: 4,
  },
  {
    code: 'prestige',
    name: 'Prestige',
    entryAmount: 50000,
    returnAmount: 250000,
    isElite: true,
    sortOrder: 5,
  },
  {
    code: 'apex',
    name: 'Apex',
    entryAmount: 100000,
    returnAmount: 600000,
    isElite: true,
    sortOrder: 6,
  },
];

@Injectable()
export class PackagesService implements OnModuleInit {
  private readonly logger = new Logger(PackagesService.name);

  constructor(
    @InjectModel(Package.name) private readonly packageModel: Model<Package>,
  ) {}

  async onModuleInit() {
    await this.seedPackages();
  }

  async seedPackages() {
    for (const pkg of SEED_PACKAGES) {
      await this.packageModel.updateOne(
        { code: pkg.code },
        { $set: { ...pkg, isActive: true } },
        { upsert: true },
      );
    }
    this.logger.log(`Seeded ${SEED_PACKAGES.length} packages`);
  }

  findAll() {
    return this.packageModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  }

  findByCode(code: string) {
    return this.packageModel.findOne({ code: code.toLowerCase(), isActive: true }).lean();
  }
}
