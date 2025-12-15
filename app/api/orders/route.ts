import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderType,
      tableNumber,
      deliveryAddress,
      deliveryNumber,
      deliveryPhone,
      deliveryTime,
      items,
      totalPrice,
    } = body;

    // Validate required fields
    if (!orderType || !items || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (orderType === "table" && !tableNumber) {
      return NextResponse.json(
        { error: "Table number is required for table orders" },
        { status: 400 }
      );
    }

    if (
      orderType === "delivery" &&
      (!deliveryAddress || !deliveryNumber || !deliveryPhone)
    ) {
      return NextResponse.json(
        { error: "Delivery information is required for delivery orders" },
        { status: 400 }
      );
    }

    // Insert order into database
    const result = await sql`
      INSERT INTO orders (
        order_type,
        table_number,
        delivery_address,
        delivery_number,
        delivery_phone,
        delivery_time,
        items,
        total_price,
        status
      ) VALUES (
        ${orderType},
        ${tableNumber || null},
        ${deliveryAddress || null},
        ${deliveryNumber || null},
        ${deliveryPhone || null},
        ${deliveryTime ? parseInt(deliveryTime) : null},
        ${JSON.stringify(items)},
        ${totalPrice},
        'pending'
      )
      RETURNING id
    `;

    return NextResponse.json(
      {
        success: true,
        orderId: result[0].id,
        message:
          orderType === "table"
            ? `Ordine confermato per il tavolo ${tableNumber}!`
            : `Ordine da asporto confermato! Consegna prevista tra ${deliveryTime} minuti.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}



