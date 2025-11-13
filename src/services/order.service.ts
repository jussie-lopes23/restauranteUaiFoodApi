import prisma from '../lib/prisma';
import { CreateOrderInput } from '../schemas/order.schema';
import { UserType } from '@prisma/client';

/**
 * Interface para os dados do usuário que vem do token
 */
interface AuthUser {
  id: string;
  type: UserType;
}

// 1. CRIAR Pedido
export const createOrderService = async (input: CreateOrderInput, user: AuthUser) => {
  const { paymentMethod, items, addressId } = input;

  // --- 1. Validação e Cálculo de Preços ---
  
  // Pega todos os IDs dos itens do pedido
  const itemIds = items.map((item) => item.itemId);

  // Busca todos os itens no banco de UMA VEZ
  const itemsInDb = await prisma.item.findMany({
    where: {
      id: { in: itemIds },
    },
  });

  // Verifica se todos os itens solicitados foram encontrados
  if (itemsInDb.length !== itemIds.length) {
    throw new Error('Um ou mais itens não foram encontrados.');
  }

  // Prepara os dados para os OrderItems
  const orderItemsData = itemsInDb.map((dbItem) => {
    const requestedItem = items.find((item) => item.itemId === dbItem.id)!;
    return {
      itemId: dbItem.id,
      quantity: requestedItem.quantity,
      // Pega o preço do BANCO DE DADOS, não do cliente
      unitPrice: dbItem.unitPrice, 
    };
  });

  // --- 2. Criação (Usando Transação) ---
  // A transação garante que o Pedido (Order) e os ItensDoPedido (OrderItem)
  // sejam criados juntos. Se algo falhar, o Prisma desfaz tudo (rollback).

  const createdOrder = await prisma.$transaction(async (tx) => {

    const address = await tx.address.findFirst({
      where: {
        id: addressId,
        users: {
          some: { id: user.id }, // Verifica se o user.id está na lista de usuários do endereço
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
        status: 'PENDING', // Status inicial padrão
        clientId: user.id,   // O cliente é o usuário logado
        createdById: user.id, // O criador é o usuário logado
        addressId: addressId,
      },
    });

    // Prepara os OrderItems para conectar ao Pedido recém-criado
    const orderItemsToCreate = orderItemsData.map((item) => ({
      ...item,
      orderId: order.id, // Linka com o ID do pedido
    }));

    // Cria todos os OrderItems de uma vez
    await tx.orderItem.createMany({
      data: orderItemsToCreate,
    });

    // Retorna o pedido completo
    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: { // Inclui os itens que acabamos de criar
          include: {
            item: true, // Inclui os dados do item (descrição, etc)
          }
        },
      },
    });
  });

  return createdOrder;
};


// 2. LISTAR Pedidos (Lógica de Admin vs Cliente)
export const listOrdersService = async (user: AuthUser) => {
  // Se for ADMIN, busca TODOS os pedidos
  if (user.type === UserType.ADMIN) {
    return prisma.order.findMany({
      include: {
        client: { select: { name: true, email: true } }, // Pega dados do cliente
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


// 3. BUSCAR UM Pedido por ID (Lógica de Admin vs Cliente)
export const getOrderByIdService = async (id: string, user: AuthUser) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, email: true } },
      orderItems: { include: { item: true } },
    },
  });

  if (!order) {
    throw new Error('Pedido não encontrado.');
  }

  // Se for CLIENT, verifica se o pedido é dele
  if (user.type === UserType.CLIENT && order.clientId !== user.id) {
    throw new Error('Acesso não autorizado a este pedido.');
  }

  // Se for Admin ou o dono do pedido, retorna
  return order;
};

// 4. ATUALIZAR STATUS (Admin)
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