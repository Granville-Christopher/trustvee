import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PackagesService } from './packages.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  async list() {
    const packages = await this.packagesService.findAll();
    return {
      data: packages.map((pkg) => ({
        ...pkg,
        dailyClaim: Math.floor(pkg.returnAmount / 30),
      })),
    };
  }

  @Get(':code')
  async one(@Param('code') code: string) {
    const pkg = await this.packagesService.findByCode(code);
    if (!pkg) throw new NotFoundException('Package not found');
    return {
      data: {
        ...pkg,
        dailyClaim: Math.floor(pkg.returnAmount / 30),
      },
    };
  }
}
