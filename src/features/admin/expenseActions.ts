"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

export interface OperatingExpenseInput {
  title: string;
  category: "SUPPLIES" | "MARKETING" | "EQUIPMENT" | "SHIPPING" | "SOFTWARE" | "OTHER";
  amount: number;
  description?: string;
  receiptImage?: string;
  date?: string;
}

export async function getOperatingExpensesAction() {
  try {
    await requireAdminSession();
    const expenses = await prisma.operatingExpense.findMany({
      orderBy: { date: "desc" },
    });
    return { success: true, expenses };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createOperatingExpenseAction(input: OperatingExpenseInput) {
  try {
    await requireAdminSession();
    const created = await prisma.operatingExpense.create({
      data: {
        title: input.title,
        category: input.category,
        amount: input.amount,
        description: input.description || null,
        receiptImage: input.receiptImage || null,
        date: input.date ? new Date(input.date) : new Date(),
        loggedBy: "Admin",
      },
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/analytics");
    return { success: true, expense: created };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteOperatingExpenseAction(id: string) {
  try {
    await requireAdminSession();
    await prisma.operatingExpense.delete({ where: { id } });
    revalidatePath("/admin/expenses");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export interface BusinessExpenseSettingsInput {
  costA5: number;
  costA4: number;
  costA3: number;
  costA2: number;
  costCanvas: number;
  costBlackFrame: number;
  costWoodFrame: number;
  packagingCostPerOrder: number;
  gatewayFeePercent: number;
  gstTaxPercent: number;
  note?: string;
}

export async function updateExpenseSettingsAction(input: BusinessExpenseSettingsInput) {
  try {
    await requireAdminSession();

    // 1. Update active SiteSettings
    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          costA5: input.costA5,
          costA4: input.costA4,
          costA3: input.costA3,
          costA2: input.costA2,
          costCanvas: input.costCanvas,
          costBlackFrame: input.costBlackFrame,
          costWoodFrame: input.costWoodFrame,
          packagingCostPerOrder: input.packagingCostPerOrder,
          gatewayFeePercent: input.gatewayFeePercent,
          gstTaxPercent: input.gstTaxPercent,
        },
      });
    }

    // 2. Append to ExpenseSettingHistory (Time-Versioned Log)
    await prisma.expenseSettingHistory.create({
      data: {
        costA5: input.costA5,
        costA4: input.costA4,
        costA3: input.costA3,
        costA2: input.costA2,
        costCanvas: input.costCanvas,
        costBlackFrame: input.costBlackFrame,
        costWoodFrame: input.costWoodFrame,
        packagingCostPerOrder: input.packagingCostPerOrder,
        gatewayFeePercent: input.gatewayFeePercent,
        gstTaxPercent: input.gstTaxPercent,
        note: input.note || "Updated variable unit expense configuration.",
      },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
