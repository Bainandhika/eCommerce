import type { Pool, RowDataPacket } from "mysql2/promise";
import { UserRepo } from "../modules/users/user.repo.js";
import { ProductRepo } from "../modules/products/product.repo.js";
import { OrderRepo } from "../modules/orders/order.repo.js";
import { DeliveryRepo } from "../modules/deliveries/delivery.repo.js";
import { CourierRepo } from "../modules/couriers/courier.repo.js";
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
} from "../modules/users/user.schema.js";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../modules/products/product.schema.js";
import type {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
} from "../modules/orders/order.schema.js";
import type {
  Delivery,
  CreateDeliveryInput,
  UpdateDeliveryInput,
} from "../modules/deliveries/delivery.schema.js";
import type {
  Courier,
  CreateCourierInput,
  UpdateCourierInput,
} from "../modules/couriers/courier.schema.js";

export class DatabaseService {
  private readonly userRepo: UserRepo;
  private readonly productRepo: ProductRepo;
  private readonly orderRepo: OrderRepo;
  private readonly deliveryRepo: DeliveryRepo;
  private readonly courierRepo: CourierRepo;

  constructor(private readonly pool: Pool) {
    this.userRepo = new UserRepo(pool);
    this.productRepo = new ProductRepo(pool);
    this.orderRepo = new OrderRepo(pool);
    this.deliveryRepo = new DeliveryRepo(pool);
    this.courierRepo = new CourierRepo(pool);
  }

  async executeRawQuery<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);
    return rows as T;
  }

  // ==================== USER METHODS ====================

  async createUser(data: CreateUserInput): Promise<User> {
    return this.userRepo.createUser(data);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepo.findUserById(id);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findUserByEmail(email);
  }

  async getAllUsers(skip = 0, take = 10): Promise<User[]> {
    return this.userRepo.getAllUsers(skip, take);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    return this.userRepo.updateUser(id, data);
  }

  async deleteUser(id: string): Promise<User> {
    return this.userRepo.deleteUser(id);
  }

  // ==================== PRODUCT METHODS ====================

  async createProduct(data: CreateProductInput): Promise<Product> {
    return this.productRepo.createProduct(data);
  }

  async findProductById(id: string): Promise<Product | null> {
    return this.productRepo.findProductById(id);
  }

  async getAllProducts(
    skip = 0,
    take = 10,
    search?: string
  ): Promise<Product[]> {
    return this.productRepo.getAllProducts(skip, take, search);
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    return this.productRepo.updateProduct(id, data);
  }

  async deleteProduct(id: string): Promise<Product> {
    return this.productRepo.deleteProduct(id);
  }

  async updateProductQuantity(id: string, quantity: number): Promise<Product> {
    return this.productRepo.updateProductQuantity(id, quantity);
  }

  // ==================== ORDER METHODS ====================

  async createOrder(data: CreateOrderInput): Promise<Order> {
    return this.orderRepo.createOrder(data);
  }

  async findOrderById(id: string): Promise<Order | null> {
    return this.orderRepo.findOrderById(id);
  }

  async getAllOrders(skip = 0, take = 10): Promise<Order[]> {
    return this.orderRepo.getAllOrders(skip, take);
  }

  async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    return this.orderRepo.updateOrder(id, data);
  }

  async deleteOrder(id: string): Promise<Order> {
    return this.orderRepo.deleteOrder(id);
  }

  async getOrdersByUserId(
    userId: string,
    skip = 0,
    take = 10
  ): Promise<Order[]> {
    return this.orderRepo.getOrdersByUserId(userId, skip, take);
  }

  async getOrdersByStatus(
    status: string,
    skip = 0,
    take = 10
  ): Promise<Order[]> {
    return this.orderRepo.getOrdersByStatus(status, skip, take);
  }

  // ==================== DELIVERY METHODS ====================

  async createDelivery(data: CreateDeliveryInput): Promise<Delivery> {
    return this.deliveryRepo.createDelivery(data);
  }

  async findDeliveryById(id: string): Promise<Delivery | null> {
    return this.deliveryRepo.findDeliveryById(id);
  }

  async getAllDeliveries(skip = 0, take = 10): Promise<Delivery[]> {
    return this.deliveryRepo.getAllDeliveries(skip, take);
  }

  async updateDelivery(
    id: string,
    data: UpdateDeliveryInput
  ): Promise<Delivery> {
    return this.deliveryRepo.updateDelivery(id, data);
  }

  async deleteDelivery(id: string): Promise<Delivery> {
    return this.deliveryRepo.deleteDelivery(id);
  }

  // ==================== COURIER METHODS ====================

  async createCourier(data: CreateCourierInput): Promise<Courier> {
    return this.courierRepo.createCourier(data);
  }

  async findCourierById(id: string): Promise<Courier | null> {
    return this.courierRepo.findCourierById(id);
  }

  async getAllCouriers(skip = 0, take = 10): Promise<Courier[]> {
    return this.courierRepo.getAllCouriers(skip, take);
  }

  async updateCourier(id: string, data: UpdateCourierInput): Promise<Courier> {
    return this.courierRepo.updateCourier(id, data);
  }

  async deleteCourier(id: string): Promise<Courier> {
    return this.courierRepo.deleteCourier(id);
  }
}
