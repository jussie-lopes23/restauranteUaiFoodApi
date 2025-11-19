import prisma from '../lib/prisma';
import { CreateOrderInput } from '../schemas/order.schema';
import { UserType } from '@prisma/client';


interface AuthUser {
  id: string;
  type: UserType;
}

//CRIAR Pedido
export const createOrderService = async (input: CreateOrderInput, user: AuthUser) => {
  const { paymentMethod, items, addressId } = input;

  const itemIds = items.map((item) => item.itemId);
  const itemsInDb = await prisma.item.findMany({
    where: {
      id: { in: itemIds },
    },
  });

  if (itemsInDb.length !== itemIds.length) {
    throw new Error('Um ou mais itens não foram encontrados.');
  }

  const orderItemsData = itemsInDb.map((dbItem) => {
    const requestedItem = items.find((item) => item.itemId === dbItem.id)!;
    return {
      itemId: dbItem.id,
      quantity: requestedItem.quantity,
      unitPrice: dbItem.unitPrice, 
    };
  });

  const createdOrder = await prisma.$transaction(async (tx) => {
    // Garante que o endereço pertence ao usuário logado
    const address = await tx.address.findFirst({
      where: {
        id: addressId,
        users: {
          some: { id: user.id }, 
        },
      },
    });

    if (!address) {
      throw new Error('Endereço não encontrado ou não pertence a este usuário.');
    }

    // Cria o Pedido (Order)
    const order = await tx.order.create({
      data: {
        paymentMethod: paymentMethod,
        status: 'PENDING',
        clientId: user.id, 
        createdById: user.id,
        addressId: addressId,
      },
    });

    // Prepara os OrderItems para conectar ao Pedido recém-criado
    const orderItemsToCreate = orderItemsData.map((item) => ({
      ...item,
      orderId: order.id, 
    }));

    // Cria todos os OrderItems de uma vez
    await tx.orderItem.createMany({
      data: orderItemsToCreate,
    });

    // Retorna o pedido completo
    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: { 
          include: {
            item: true, 
          }
        },
      },
    });
  });

  return createdOrder;
};


// 2. LISTAR Pedidos
export const listOrdersService = async (user: AuthUser) => {
  // Se for ADMIN, busca TODOS os pedidos
  if (user.type === UserType.ADMIN) {
    return prisma.order.findMany({
      include: {
        client: { select: { name: true, email: true } }, 
        orderItems: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Se for CLIENT, busca SÓ OS DELE
  return prisma.order.findMany({
    where: {
      clientId: user.id,
    },
    include: {
      orderItems: { include: { item: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};


//BUSCA UM Pedido por ID 
export const getOrderByIdService = async (id: string, user: AuthUser) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, email: true } },
      orderItems: { include: { item: true } },
      address: true,
    },
  });

  if (!order) {
    throw new Error('Pedido não encontrado.');
  }

  // Se for CLIENT, verifica se o pedido pertence a ele
  if (user.type === UserType.CLIENT && order.clientId !== user.id) {
    throw new Error('Acesso não autorizado a este pedido.');
  }

  // Se for Admin ou o dono do pedido, retorna
  return order;
};

//ATUALIZA STATUS (Admin)
export const updateOrderStatusService = async (id: string, status: string) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new Error('Pedido não encontrado.');
  }

  return prisma.order.update({
    where: { id },
    data: { status: status },
  });
};