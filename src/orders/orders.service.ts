import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDTO): Promise<Order> {
    const products = await Promise.all(createOrderDto.productIds.map((id) => this.productRepository.findOne(id)));
    const order = new Order();
    order.customerName = createOrderDto.customerName;
    order.products = products;
    return this.orderRepository.save(order);
  }
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['products'],
    });
  }
  /* async findUserOrder(userId: number):Promise<Order>{
    return this.orderRepository.findOne({
      customerId: userId,
    });
  } */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne(id, {
      relations: ['products'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
  async update(id: number, updateOrderDto: UpdateOrderDTO): Promise<Order> {
    const products = await Promise.all(updateOrderDto.productIds.map((id) => this.productRepository.findOne(id)));
    const order = await this.findOne(id);
    //order.customerName = customerName;
    order.products = products;
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.orderRepository.delete(id);
  }
}
