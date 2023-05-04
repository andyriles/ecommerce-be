import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import * as nodemailer from 'nodemailer';

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
    order.customerEmail = createOrderDto.customerEmail;
    order.products = products;
    const savedOrder = await this.orderRepository.save(order);
    const transporter = nodemailer.createTransport({
      // configure transport method here
      service: 'gmail',
      auth: {
        user: 'andyriles22@gmail.com', // generated ethereal user
        pass: 'bydqcwftirczlyoa', // generated ethereal password
      },
    });
    const productsText = products.map((product) => `${product.name} (${product.price}$)`).join(', ');

    const mailOptions = {
      from: 'andyriles22@gmail.com',
      to: createOrderDto.customerEmail,
      subject: 'Order Details',
      text: `Order ${order.id} has been created.  Products ordered: ${productsText}`,
      html: `<p>Order ${order.id} has been created. Products ordered: ${productsText}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    /* const accountSid = 'ACe904fa03e36e4265ffadb5da56010112';
    const authToken = 'f7822d857b9634af2e71c38c740deb1a';
    const client = require('twilio')(accountSid, authToken);

    const phoneNumber = createOrderDto.customerPhoneNumber;
    const transformedPhoneNumber = '+234' + phoneNumber.slice(1);
    console.log(transformedPhoneNumber);

    client.messages
      .create({
        body: `Order ${order.id} has been created.  Products ordered: ${productsText}`,
        from: '+13203628140',
        to: transformedPhoneNumber,
      })
      .then((message) => console.log(message.sid)); */
    return savedOrder;
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
    // order.customerName = customerName;
    order.products = products;
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.orderRepository.delete(id);
  }
}
