import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchema.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// GET /transactions
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (e) { next(e); }
});

// POST /transactions
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const data = createTransactionSchema.parse(req.body);
    const transaction = await prisma.transaction.create({
      data: { ...data, userId: req.userId },
      include: { category: true },
    });
    res.status(201).json(transaction);
  } catch (e) { next(e); }
});

// PUT /transactions/:id
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const data = updateTransactionSchema.parse(req.body);
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data,
      include: { category: true },
    });
    res.json(transaction);
  } catch (e) { next(e); }
});

// DELETE /transactions/:id
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;