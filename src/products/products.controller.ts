import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDTO } from './dto/create-product.dto';
import { UpdateProductsDTO } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { RolesGuard } from 'src/auth/strategy/roles.guard';
import { Roles } from 'src/custom.decorator';
import { Role } from 'src/users/enums/role.enum';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async create(@Body() createProductDto: CreateProductsDTO, @Res() res: Response) {
    try {
      const product = await this.productService.create(createProductDto);
      res.status(201).send({ msg: 'success', product });
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: 'An error occurred' });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const products = await this.productService.findAll();
      res.status(200).send({ msg: 'success', products });
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: 'An error occurred' });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductsDTO, @Res() res: Response) {
    try {
      const product = await this.productService.update(+id, updateProductDto);
      res.status(200).send({ msg: 'success', product });
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: 'An error occurred' });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const deleted = await this.productService.remove(+id);
      res.status(200).send({ msg: 'success' });
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: 'An error occurred' });
    }
  }
}
