import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { RolesGuard } from 'src/auth/strategy/roles.guard';
import { Roles } from 'src/custom.decorator';
import { Role } from 'src/users/enums/role.enum';
import { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  async create(@Body() createOrderDto: CreateOrderDTO, @Res() res: Response) {
    try {
      const order = await this.orderService.create(createOrderDto);
      res.status(200).send({ msg: 'success', order });
    } catch (error) {
      res.status(400).send({ msg: 'An error occurred' });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async findAll(@Res() res: Response) {
    const orders = await this.orderService.findAll();
    res.status(200).send({ msg: 'success', orders });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const order = await this.orderService.findOne(+id);
    res.status(200).send({ msg: 'success', order });
  }

  @Get('/find')
  findOnes() {
    return 'found';
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDTO, @Res() res: Response) {
    try {
      const nOrder = await this.orderService.update(+id, updateOrderDto);
      res.status(200).send({ msg: 'success', nOrder });
    } catch (error) {
      res.status(400).send({ msg: 'An error occurred' });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.orderService.remove(+id);
      res.status(200).send({ msg: 'success' });
    } catch (error) {
      res.status(400).send({ msg: 'An error occurred' });
    }
  }
}
