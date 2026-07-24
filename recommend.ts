import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { matchGiftToBudget } from "@/lib/recommend";

// GET /api/gifts
// Query params (all optional):
//   search        - matches gift name
//   category      - exact category match
//   happiness     - HAPPY | OMG_EXCITED | CHANGED_MY_LIFE
//   availability  - "available" to hide fully-claimed gifts
//   budget        - total resolved IDR budget, enables the match label
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category");
  const happiness = searchParams.get("happiness");
  const availability = searchParams.get("availability");
  const budgetParam = searchParams.get("budget");
  const budget = budgetParam ? Number(budgetParam) : null;

  const gifts = await prisma.gift.findMany({
    where: {
      archived: false,
      ...(search ? { name: { contains: search } } : {}),
      ...(category ? { category } : {}),
      ...(happiness ? { happinessLevel: happiness as any } : {}),
    },
    include: { claims: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  let shaped = gifts.map((g) => {
    const claimedSlots = g.claims.length;
    const remaining = g.quantityAvailable - claimedSlots;
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      imageUrl: g.imageUrl,
      price: g.price,
      purchaseLink: g.purchaseLink,
      happinessLevel: g.happinessLevel,
      category: g.category,
      quantityAvailable: g.quantityAvailable,
      remaining,
      isGroupEligible: g.quantityAvailable > 1,
      match: budget ? matchGiftToBudget(g.price, budget) : null,
    };
  });

  if (availability === "available") {
    shaped = shaped.filter((g) => g.remaining > 0);
  }

  return NextResponse.json({ gifts: shaped });
}

// POST /api/gifts - admin only, creates a new gift
export async function POST(req: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  const body = await req.json();

  const required = ["name", "description", "imageUrl", "price", "purchaseLink", "happinessLevel", "category"];
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const gift = await prisma.gift.create({
    data: {
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl,
      price: Number(body.price),
      purchaseLink: body.purchaseLink,
      happinessLevel: body.happinessLevel,
      category: body.category,
      quantityAvailable: Number(body.quantityAvailable) || 1,
    },
  });

  return NextResponse.json({ gift }, { status: 201 });
}
